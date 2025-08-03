//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ITeleporterReceiver.sol";
import "./libraries/InterestDistributionMessages.sol";

/**
 * @title LendingPool
 * @dev Pool con integración ICM para automatización de procesos
 */
contract LendingPool is Ownable, ITeleporterReceiver {
    using SafeERC20 for IERC20;
    using InterestDistributionMessages for bytes;

    IERC20 public immutable usdtToken;
    address public loanManagerContract;
    address public teleporterMessenger;
    
    mapping(address => uint256) public balances;
    uint256 public totalDeposits;

    event Deposit(address indexed lender, uint256 amount);
    event Withdrawal(address indexed lender, uint256 amount);
    event LoanFunded(address indexed borrower, uint256 amount);
    event RepaymentReceived(uint256 amount);
    event ICMInterestDistributed(uint256 indexed tokenId, uint256 interestAmount, uint256 timestamp);
    event ICMMessageReceived(bytes32 indexed sourceBlockchainID, address sender, uint256 tokenId);

    constructor(
        address initialOwner, 
        address _usdtToken,
        address _teleporterMessenger
    ) Ownable(initialOwner) {
        usdtToken = IERC20(_usdtToken);
        teleporterMessenger = _teleporterMessenger;
    }

    function setLoanManagerContract(address _loanManagerContract) external onlyOwner {
        loanManagerContract = _loanManagerContract;
    }

    function setTeleporterMessenger(address _teleporterMessenger) external onlyOwner {
        teleporterMessenger = _teleporterMessenger;
    }

    /**
     * @dev Depósito simple
     */
    function deposit(uint256 amount) external {
        usdtToken.safeTransferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
        totalDeposits += amount;
        emit Deposit(msg.sender, amount);
    }

    /**
     * @dev Retiro con monto calculado
     */
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(usdtToken.balanceOf(address(this)) >= amount, "Insufficient liquidity");
        
        balances[msg.sender] -= amount;
        totalDeposits -= amount;
        usdtToken.safeTransfer(msg.sender, amount);
        emit Withdrawal(msg.sender, amount);
    }

    /**
     * @dev Financiar préstamo - solo LoanManager
     */
    function provideFundsForLoan(address borrower, uint256 amount) external {
        require(msg.sender == loanManagerContract, "Unauthorized");
        require(usdtToken.balanceOf(address(this)) >= amount, "Insufficient funds");
        
        usdtToken.safeTransfer(borrower, amount);
        emit LoanFunded(borrower, amount);
    }

    /**
     * @dev Recibir pago de préstamo
     */
    function receiveLoanRepayment(uint256 amount) external {
        require(msg.sender == loanManagerContract, "Unauthorized");
        emit RepaymentReceived(amount);
    }

    /**
     * @dev Actualizar balance de usuario
     */
    function updateBalance(address user, uint256 newBalance) external onlyOwner {
        balances[user] = newBalance;
    }

    /**
     * @dev Implementación ITeleporterReceiver - Recibir mensajes ICM
     */
    function receiveTeleporterMessage(
        bytes32 sourceBlockchainID,
        address originSenderAddress,
        bytes calldata message
    ) external override {
        require(msg.sender == teleporterMessenger, "Solo TeleporterMessenger");
        require(originSenderAddress == loanManagerContract, "Solo LoanManager autorizado");

        // Decodificar tipo de mensaje
        InterestDistributionMessages.MessageType msgType = 
            InterestDistributionMessages.getMessageType(message);

        if (msgType == InterestDistributionMessages.MessageType.DISTRIBUTE_INTEREST) {
            _handleInterestDistribution(sourceBlockchainID, message);
        } else if (msgType == InterestDistributionMessages.MessageType.LOAN_PAYMENT_RECEIVED) {
            _handleLoanPaymentNotification(sourceBlockchainID, message);
        }
    }

    /**
     * @dev Procesar distribución de intereses automática via ICM
     */
    function _handleInterestDistribution(
        bytes32 sourceBlockchainID,
        bytes memory message
    ) internal {
        InterestDistributionMessages.DistributeInterestMessage memory distMsg = 
            InterestDistributionMessages.decodeDistributeInterest(message);

        // AQUÍ IRÍA LA LÓGICA DE DISTRIBUCIÓN DE INTERESES
        // Por ahora emitimos evento para demostrar que funciona
        emit ICMInterestDistributed(
            distMsg.tokenId, 
            distMsg.interestAmount, 
            distMsg.timestamp
        );
        
        emit ICMMessageReceived(sourceBlockchainID, address(this), distMsg.tokenId);
    }

    /**
     * @dev Procesar notificación de pago de préstamo via ICM
     */
    function _handleLoanPaymentNotification(
        bytes32 sourceBlockchainID,
        bytes memory message
    ) internal {
        InterestDistributionMessages.LoanPaymentMessage memory payMsg = 
            InterestDistributionMessages.decodeLoanPayment(message);

        // AQUÍ IRÍA LA LÓGICA DE PROCESAMIENTO DE NOTIFICACIÓN
        // Por ahora emitimos evento para demostrar que funciona
        emit ICMMessageReceived(sourceBlockchainID, address(this), payMsg.tokenId);
    }
}
