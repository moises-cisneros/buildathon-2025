// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title InterestDistributionMessages
 * @dev Librería para codificar/decodificar mensajes de distribución de intereses ICM
 */
library InterestDistributionMessages {
    /**
     * @dev Tipos de mensajes para automatización ICM
     */
    enum MessageType {
        DISTRIBUTE_INTEREST, // Distribuir intereses a prestamistas
        LOAN_PAYMENT_RECEIVED, // Notificar pago de préstamo
        LOAN_DEFAULTED // Notificar default de préstamo
    }

    /**
     * @dev Estructura para mensaje de distribución de intereses
     */
    struct DistributeInterestMessage {
        MessageType msgType;
        uint256 tokenId;
        uint256 paymentAmount;
        uint256 interestAmount;
        uint256 principalAmount;
        address borrower;
        uint256 timestamp;
    }

    /**
     * @dev Estructura para notificación de pago
     */
    struct LoanPaymentMessage {
        MessageType msgType;
        uint256 tokenId;
        uint256 paymentAmount;
        address borrower;
        bool isFullPayment;
        uint256 timestamp;
    }

    /**
     * @dev Codifica mensaje de distribución de intereses
     */
    function encodeDistributeInterest(
        uint256 tokenId,
        uint256 paymentAmount,
        uint256 interestAmount,
        uint256 principalAmount,
        address borrower,
        uint256 timestamp
    ) internal pure returns (bytes memory) {
        DistributeInterestMessage memory message = DistributeInterestMessage({
            msgType: MessageType.DISTRIBUTE_INTEREST,
            tokenId: tokenId,
            paymentAmount: paymentAmount,
            interestAmount: interestAmount,
            principalAmount: principalAmount,
            borrower: borrower,
            timestamp: timestamp
        });

        return abi.encode(message);
    }

    /**
     * @dev Codifica mensaje de pago de préstamo
     */
    function encodeLoanPayment(
        uint256 tokenId,
        uint256 paymentAmount,
        address borrower,
        bool isFullPayment,
        uint256 timestamp
    ) internal pure returns (bytes memory) {
        LoanPaymentMessage memory message = LoanPaymentMessage({
            msgType: MessageType.LOAN_PAYMENT_RECEIVED,
            tokenId: tokenId,
            paymentAmount: paymentAmount,
            borrower: borrower,
            isFullPayment: isFullPayment,
            timestamp: timestamp
        });

        return abi.encode(message);
    }

    /**
     * @dev Decodifica mensaje de distribución de intereses
     */
    function decodeDistributeInterest(bytes memory data) internal pure returns (DistributeInterestMessage memory) {
        return abi.decode(data, (DistributeInterestMessage));
    }

    /**
     * @dev Decodifica mensaje de pago de préstamo
     */
    function decodeLoanPayment(bytes memory data) internal pure returns (LoanPaymentMessage memory) {
        return abi.decode(data, (LoanPaymentMessage));
    }

    /**
     * @dev Obtiene el tipo de mensaje
     */
    function getMessageType(bytes memory data) internal pure returns (MessageType) {
        MessageType msgType = abi.decode(data, (MessageType));
        return msgType;
    }
}
