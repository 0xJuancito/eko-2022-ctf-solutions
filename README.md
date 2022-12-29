# Proof of Hack Protocol Solutions

Solutions to [Eko 2022](https://www.ctfprotocol.com/tracks/eko2022) CTF challenges ⛳️

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

## Trickster

### Vulnerability

Anyone can withdraw all the funds from the contract.

### POC

The contracts implement a proxy pattern incorrectly. The `Jackpot` contract is the one holding the funds, and can be reinitialized by anyone by calling the `initialize` method again and overwrite the original `proxyJackpot` address used for access control.

- [Test](./test/ChallengeTrickster.spec.ts)

### Attack Steps

- Obtain the address of the `Jackpot` contract
- Call initialize to set the attacker as the new "jackpotProxy" to bypass validation
- Withdraw funds

## The Lost Kitty

### Vulnerability

The contract uses `block.timestamp`, `blockhash`, and `block.number` for randomization.

### POC

The contract uses deterministic variables for randomization and the result can be calculated beforehand.

- [Test](./test/ChallengeHiddenKitty.spec.ts)

### Attack Steps

- Create an attacker contract
- Precalculate the "random" value
- Call the target contract with the precalculated slot value

## Root me

### Vulnerability

Anyone can get root access by registering a new identifier.

### POC

The security of the identifiers relies on `keccak256(abi.encodePacked(user, salt))`, but it doesn't consider that the `encodePacked` method will return the same results for multiple strings concatenated, like `("ROOT", "ROOT")` and `("ROO","TROOT")`.

- [Test](./test/ChallengeRootMe.spec.ts)

### Attack Steps

- Register an identifier with `("ROO","TROOT")` or any other equivalent pair that wasn't used
- Call the `write` method to override the `victory` variable

## Smart Horrocrux

### POC

- First step is to make the contract not `invincible`. To do so, we need the contract balance to be 1 wei. This can be achieved by emptying the contract balance, and then sending it exactly one wei.
- Then calculate the `spell` and `magic` to be able to call the `kill` method internally via `destroyIt`

- [Test](./test/ChallengeSmartHorrocrux.spec.ts)

### Attack Steps

- Empty the contract balance by calling any function not implemented, which will get to the `fallback` function
- Send 1 wei to the contract (by selfdestructing another contract for example)
- Convert the `spell` from `bytes32` to `string`
- Calculate the `magic` by calculating the reverse function of `kedavra = abi.encodePacked(bytes4(bytes32(uint256(spellInBytes) - magic)))`
- Call the `destroyIt` method
- It will call the `kill` method internally

## Root me

### Vulnerability

Anyone can get tickets without waiting any time.

### POC

- The `updateWaitTime` method is vulnerable to an overflow on `waitlist[msg.sender] += uint40(_time);`
- The `joinRaffle` method uses deterministic "randomness" on `uint256 randomNumber = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp)));`

- [Test](./test/ChallengeGoldenTicket.spec.ts)

### Attack Steps

- Join the waitlist
- Call the `updateWaitTime` method with a value that makes it overflow
- Call `joinRaffle` with the precalculated "random" value

## Stonks

### Vulnerability

The contract can lose all funds due to error with remainder.

### POC

There is a miscalculation regarding remainders when the amount is lower than the oracle price in `require(amountGMEin / ORACLE_TSLA_GME == amountTSLAout, "Invalid price");`. Leading to cases like `49 / 50 == 0` being a valid case. This can be used to exploit prices.

- [Test](./test/ChallengeStonks.spec.ts)

### Attack Steps

- Sell all TSLA stonks
- Buy TSLA stonks with an GME amount lower than the oracle price, for 0 TSLA
- Repeat until the TSLA balance is 0

## Gas Valve

### POC

The goal is to make the `useNozzle` fail. In order to do that `nozzle.insert` has to consume all the remaining gas for the function.

- [Test](./test/ChallengeValve.spec.ts)

### Attack Steps

- Make a call to the contract limiting the gas or create a `nozzle.insert` function that consumes almost all gas to make the `useNozzle` fail

## Pelusa

### POC

The main challenges here are

- Generate a contract with an address that satisfies `address % 100 == 10`. This can be done by trying with different salt values
- Implement the corresponding functions of the attacker contract that will be called
- The `passTheBall` requirements are bypassed because `require(msg.sender.code.length == 0, "Only EOA players")` does not apply on contract creation, where the code length is 0

- [Test](./test/ChallengePelusa.spec.ts)

### Attack Steps

- Create a contract with an address that satisfies `address % 100 == 10`
- Call `passTheBall` to set the `msg.sender` as the `player` on the storage
- Calculate the `owner` on the new contract with the `deployer` of the original contract
- Call `shoot` on the attacker contract
  - It will check the `getBallPossesion` method
  - It will check that the `owner` is correct
  - It will check the `handOfGod` where we set the `goals` variable to 2, and return the `22_06_1986` value

## Phoenixtto

### POC

This is a metamorphic contract. It looks like it should re-deploy the same contract every time, but in fact, after being destructed it can deploy a different runtime code implementation. The trick is to deploy a new contract that modifies the underlying storage of the proxy.

- [Test](./test/ChallengePhoenixtto.spec.ts)

### Attack Steps

- Create an implementation contract implementing the `reBorn` method, but assigning the attacker as the `owner`
- Destroy the original implementation by calling `capture` on it with any value
- Deploy the new implementation with the `Laboratory.reBorn` method

## Phoenixtto

### Vulnerability

- Meal tokens can be minted for free

### POC

If the oracle is not set, it is set as 0, which is the response from the `ecrecover` when it fails.

- [Test](./test/ChallengePhoenixtto.spec.ts)

### Attack Steps

- Create an oracle price calldata with price of 0
- Create a signature with a valid `v` value
- Mint tokens for free
