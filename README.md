# Proof of Hack Protocol Solutions

Solutions to [Proof of Hack Protocol](https://github.com/Proof-Of-Hack-Protocol/challenges) CTF challenges ⛳️

**🚧 WIP**

## Mothership

### Vulnerability

Anyone can become leader of the Mothership.

### POC

The `CleaningModule` and the `RefuelModule` do not have any access control, so they can be called by anyone, allowing to update storage variables from the `SpaceShip` contract through `delegatecall`, and thus escalating priviliges until getting the leadership of the Mothership.

- [Test](./test/ChallengeMothership.spec.ts)
- [Attacker Contract](./contracts/attackers/ChallengeMothershipAttacker.sol)

### Attack Steps

- Deploy a `LeadershipModuleAttacker` contract to override the `isLeaderApproved` of the `LeadershipModule` module
- Deploy an attacker contract to perform the exploit
- For each ship (except for one), call the `replaceCleaningCompany` method with the attacker contract address, to assign that address as the captain
- The remaining ship will be a candidate to become the leader:
  - Reset the captain by calling `replaceCleaningCompany` from the `CleaningModule` with the `0x0` address
  - Assign the attacker as a crew member by calling `addAlternativeRefuelStationsCodes` from the `RefuelModule`
  - Assign the captain and make the mothership know about it by calling `spaceShip.askForNewCaptain` with the attacker address
- Everything is set up now to promote to the attacker to a leader. All spaceships have an approve module that returns true. There is one spaceship with a captain that can be promoted to leader
- Call `mothership.promoteToLeader` with the attacker address
- Call `mothership.hack`
