// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ITeleporterReceiver
 * @dev Interface that defines the method that contracts must implement to receive ICM messages
 */
interface ITeleporterReceiver {
    /**
     * @notice Called by TeleporterMessenger on the receiving chain when a Teleporter message is received
     * @param sourceBlockchainID The blockchain ID that the message was sent from
     * @param originSenderAddress The address that sent the message on the origin chain
     * @param message The message payload sent from the origin chain
     */
    function receiveTeleporterMessage(
        bytes32 sourceBlockchainID,
        address originSenderAddress,
        bytes calldata message
    ) external;
}
