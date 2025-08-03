// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TeleporterStructs
 * @dev Structs necesarios para la integración con Avalanche ICM
 */

/**
 * @dev Información de fee para mensajes Teleporter
 */
struct TeleporterFeeInfo {
    address feeTokenAddress;
    uint256 amount;
}

/**
 * @dev Input para enviar un mensaje Teleporter
 */
struct TeleporterMessageInput {
    bytes32 destinationBlockchainID;
    address destinationAddress;
    TeleporterFeeInfo feeInfo;
    uint256 requiredGasLimit;
    address[] allowedRelayerAddresses;
    bytes message;
}

/**
 * @title ITeleporterMessenger
 * @dev Interface simplificada para TeleporterMessenger de Avalanche ICM
 */
interface ITeleporterMessenger {
    /**
     * @notice Envía un mensaje cross-chain
     * @param messageInput La información del mensaje a enviar
     * @return messageID El ID único del mensaje enviado
     */
    function sendCrossChainMessage(
        TeleporterMessageInput calldata messageInput
    ) external returns (bytes32 messageID);

    /**
     * @notice Verifica si un mensaje ha sido recibido
     * @param messageID El ID del mensaje a verificar
     * @return Si el mensaje ha sido recibido
     */
    function messageReceived(bytes32 messageID) external view returns (bool);
}
