// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "../ChallengePhoenixtto.sol";

contract ChallengePhoenixttoReborn {
    address public owner;

    function reBorn() external {
        owner = tx.origin;
    }
}

contract ChallengePhoenixttoDeployer {
    constructor(address laboratory) {
        Laboratory(laboratory).reBorn(type(ChallengePhoenixttoReborn).creationCode);
    }
}
