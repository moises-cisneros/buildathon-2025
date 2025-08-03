// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/ITeleporterMessenger.sol";

/**
 * @title MockTeleporterMessenger
 * @dev Mock del TeleporterMessenger para testing local y desarrollo
 * En producción se usaría el TeleporterMessenger real de Avalanche
 */
contract MockTeleporterMessenger is ITeleporterMessenger {
    uint256 private _messageNonce;
    
    mapping(bytes32 => bool) public receivedMessages;
    mapping(bytes32 => TeleporterMessageInput) public sentMessages;
    
    event MockMessageSent(
        bytes32 indexed messageID,
        bytes32 indexed destinationBlockchainID,
        address indexed destinationAddress,
        bytes message
    );
    
    event MockMessageDelivered(
        bytes32 indexed messageID,
        bytes32 indexed sourceBlockchainID,
        address indexed originSender
    );

    /**
     * @dev Simula envío de mensaje cross-chain
     */
    function sendCrossChainMessage(
        TeleporterMessageInput calldata messageInput
    ) external override returns (bytes32 messageID) {
        _messageNonce++;
        
        // Generar ID único del mensaje
        messageID = keccak256(
            abi.encodePacked(
                block.chainid,
                messageInput.destinationBlockchainID,
                _messageNonce,
                msg.sender,
                messageInput.message
            )
        );
        
        // Guardar mensaje
        sentMessages[messageID] = messageInput;
        
        emit MockMessageSent(
            messageID,
            messageInput.destinationBlockchainID,
            messageInput.destinationAddress,
            messageInput.message
        );
        
        return messageID;
    }

    /**
     * @dev Simula entrega de mensaje - Solo para testing
     */
    function deliverMessage(
        bytes32 messageID,
        bytes32 sourceBlockchainID,
        address originSender
    ) external {
        require(!receivedMessages[messageID], "Message already delivered");
        
        TeleporterMessageInput memory message = sentMessages[messageID];
        require(message.destinationAddress != address(0), "Message not found");
        
        // Marcar como recibido
        receivedMessages[messageID] = true;
        
        // Llamar al destinatario
        (bool success,) = message.destinationAddress.call(
            abi.encodeWithSignature(
                "receiveTeleporterMessage(bytes32,address,bytes)",
                sourceBlockchainID,
                originSender,
                message.message
            )
        );
        
        require(success, "Message delivery failed");
        
        emit MockMessageDelivered(messageID, sourceBlockchainID, originSender);
    }

    /**
     * @dev Implementación de verificación de mensaje recibido
     */
    function messageReceived(bytes32 messageID) external view override returns (bool) {
        return receivedMessages[messageID];
    }

    /**
     * @dev Obtener mensaje enviado para testing
     */
    function getSentMessage(bytes32 messageID) 
        external 
        view 
        returns (TeleporterMessageInput memory) 
    {
        return sentMessages[messageID];
    }

    /**
     * @dev Obtener nonce actual para testing
     */
    function getCurrentNonce() external view returns (uint256) {
        return _messageNonce;
    }
}
