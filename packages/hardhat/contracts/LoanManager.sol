// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./RealEstateNFT.sol";
import "./interfaces/ITeleporterMessenger.sol";
import "./libraries/InterestDistributionMessages.sol";

interface ILendingPool {
    function provideFundsForLoan(uint256 amount, address borrower) external;
    function receiveLoanRepayment(uint256 amount) external;
}

/**
 * @title LoanManager
 * @dev Contrato para gestión de préstamos con integración ICM
 * Solo custodia NFTs y transfiere tokens, usa ICM para automatización
 */
contract LoanManager is Ownable, ReentrancyGuard, Pausable, IERC721Receiver {
    using InterestDistributionMessages for bytes;

    RealEstateNFT public realEstateNFT;
    ILendingPool public lendingPool;
    IERC20 public usdtToken;
    ITeleporterMessenger public teleporterMessenger;
    
    // ICM Configuration
    bytes32 public destinationBlockchainID;
    address public lendingPoolAddress;
    uint256 public constant REQUIRED_GAS_LIMIT = 200000;

    // Estados ultra-simples
    mapping(uint256 => address) public nftOwners; // tokenId => original owner
    mapping(uint256 => bool) public activeLoans; // tokenId => has active loan

    // Eventos
    event LoanCreated(uint256 indexed tokenId, address indexed borrower, uint256 amount);
    event LoanRepayment(uint256 indexed tokenId, uint256 amount);
    event LoanCompleted(uint256 indexed tokenId);
    event ICMMessageSent(bytes32 indexed messageId, uint256 indexed tokenId, uint256 amount);

    constructor(
        address initialOwner,
        address _realEstateNFT,
        address _lendingPool,
        address _usdtToken,
        address _teleporterMessenger,
        bytes32 _destinationBlockchainID
    ) Ownable(initialOwner) {
        realEstateNFT = RealEstateNFT(_realEstateNFT);
        lendingPool = ILendingPool(_lendingPool);
        usdtToken = IERC20(_usdtToken);
        teleporterMessenger = ITeleporterMessenger(_teleporterMessenger);
        destinationBlockchainID = _destinationBlockchainID;
        lendingPoolAddress = _lendingPool;
    }

    /**
     * @dev Crear préstamo - Backend ya validó todo
     */
    function createLoan(uint256 tokenId, uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Monto invalido");
        require(realEstateNFT.ownerOf(tokenId) == msg.sender, "No eres propietario");
        require(!activeLoans[tokenId], "NFT ya en uso");

        // Transferir NFT a custodia
        realEstateNFT.safeTransferFrom(msg.sender, address(this), tokenId);
        
        // Guardar estado minimal
        nftOwners[tokenId] = msg.sender;
        activeLoans[tokenId] = true;

        // Proveer fondos
        lendingPool.provideFundsForLoan(amount, msg.sender);

        emit LoanCreated(tokenId, msg.sender, amount);
    }

    /**
     * @dev Pagar préstamo con automatización ICM
     * Backend calculó monto exacto y breakdown de intereses
     */
    function repayLoan(
        uint256 tokenId, 
        uint256 amount,
        uint256 interestAmount,
        uint256 principalAmount
    ) external nonReentrant whenNotPaused {
        require(activeLoans[tokenId], "No active loan");
        require(amount > 0, "Monto invalido");
        require(interestAmount + principalAmount == amount, "Breakdown incorrecto");

        // Transferir USDT al pool
        usdtToken.transferFrom(msg.sender, address(lendingPool), amount);
        lendingPool.receiveLoanRepayment(amount);

        // INTEGRACIÓN ICM: Enviar mensaje asíncrono para distribuir intereses
        _sendInterestDistributionMessage(
            tokenId,
            amount,
            interestAmount,
            principalAmount,
            msg.sender
        );

        emit LoanRepayment(tokenId, amount);
    }

    /**
     * @dev Completar préstamo y devolver NFT
     */
    function completeLoan(uint256 tokenId) external onlyOwner {
        require(activeLoans[tokenId], "No active loan");
        
        address originalOwner = nftOwners[tokenId];
        realEstateNFT.safeTransferFrom(address(this), originalOwner, tokenId);
        
        // Limpiar estado
        delete nftOwners[tokenId];
        delete activeLoans[tokenId];
        
        emit LoanCompleted(tokenId);
    }

    /**
     * @dev Transferir NFT para subasta (default)
     */
    function transferToAuction(uint256 tokenId, address auctionContract) external onlyOwner {
        require(activeLoans[tokenId], "No active loan");
        
        realEstateNFT.safeTransferFrom(address(this), auctionContract, tokenId);
        
        // Limpiar estado
        delete nftOwners[tokenId];
        delete activeLoans[tokenId];
    }

    /**
     * @dev Configurar parámetros ICM
     */
    function setICMConfiguration(
        address _teleporterMessenger,
        bytes32 _destinationBlockchainID,
        address _lendingPoolAddress
    ) external onlyOwner {
        teleporterMessenger = ITeleporterMessenger(_teleporterMessenger);
        destinationBlockchainID = _destinationBlockchainID;
        lendingPoolAddress = _lendingPoolAddress;
    }

    /**
     * @dev Enviar mensaje ICM para distribución de intereses
     */
    function _sendInterestDistributionMessage(
        uint256 tokenId,
        uint256 paymentAmount,
        uint256 interestAmount,
        uint256 principalAmount,
        address borrower
    ) internal {
        // Codificar mensaje de distribución de intereses
        bytes memory messagePayload = InterestDistributionMessages.encodeDistributeInterest(
            tokenId,
            paymentAmount,
            interestAmount,
            principalAmount,
            borrower,
            block.timestamp
        );

        // Configurar mensaje ICM
        TeleporterMessageInput memory messageInput = TeleporterMessageInput({
            destinationBlockchainID: destinationBlockchainID,
            destinationAddress: lendingPoolAddress,
            feeInfo: TeleporterFeeInfo({
                feeTokenAddress: address(0), // Sin fee por ahora
                amount: 0
            }),
            requiredGasLimit: REQUIRED_GAS_LIMIT,
            allowedRelayerAddresses: new address[](0), // Cualquier relayer puede entregar
            message: messagePayload
        });

        // Enviar mensaje ICM
        bytes32 messageId = teleporterMessenger.sendCrossChainMessage(messageInput);
        
        emit ICMMessageSent(messageId, tokenId, paymentAmount);
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}