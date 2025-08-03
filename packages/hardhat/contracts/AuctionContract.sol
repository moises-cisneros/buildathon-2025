//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RealEstateNFT.sol";

/**
 * @title AuctionContract
 * @dev Contrato para subastas de NFTs
 */
contract AuctionContract is Ownable {
    using SafeERC20 for IERC20;

    RealEstateNFT public immutable realEstateNFT;
    IERC20 public immutable usdtToken;

    event AuctionCompleted(uint256 indexed tokenId, address indexed winner, uint256 amount);
    event FundsTransferred(address indexed to, uint256 amount);

    constructor(
        address initialOwner,
        address _realEstateNFT,
        address _usdtToken
    ) Ownable(initialOwner) {
        realEstateNFT = RealEstateNFT(_realEstateNFT);
        usdtToken = IERC20(_usdtToken);
    }

    /**
     * @dev Ejecutar resultado de subasta - Backend ya determinó todo
     */
    function executeAuction(
        uint256 tokenId,
        address winner,
        uint256 amount,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        // Recibir pago del ganador
        if (amount > 0) {
            usdtToken.safeTransferFrom(winner, address(this), amount);
        }
        
        // Transferir NFT al ganador
        realEstateNFT.safeTransferFrom(address(this), winner, tokenId);
        
        // Distribuir fondos según backend
        for (uint i = 0; i < recipients.length; i++) {
            if (amounts[i] > 0) {
                usdtToken.safeTransfer(recipients[i], amounts[i]);
                emit FundsTransferred(recipients[i], amounts[i]);
            }
        }
        
        emit AuctionCompleted(tokenId, winner, amount);
    }

    /**
     * @dev Transferir NFT para subasta
     */
    function receiveNFT(uint256 tokenId) external onlyOwner {
        realEstateNFT.safeTransferFrom(msg.sender, address(this), tokenId);
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
