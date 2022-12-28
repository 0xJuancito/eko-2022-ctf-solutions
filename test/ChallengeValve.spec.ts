import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "Valve";

describe(CONTRACT_NAME, () => {
  let _owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;

  beforeEach(async () => {
    [_owner, attacker] = await ethers.getSigners();

    contract = await (await ethers.getContractFactory(CONTRACT_NAME)).deploy();
  });

  it("Solves the challenge", async () => {
    const attackerContract = await (await ethers.getContractFactory("ChallengeValveAttacker", attacker)).deploy();

    const tx = await attackerContract.attack(contract.address);
    await tx.wait();

    expect(await contract.open()).to.be.true;
  });
});
