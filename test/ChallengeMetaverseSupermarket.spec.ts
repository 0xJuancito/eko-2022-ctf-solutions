import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "InflaStore";

describe(CONTRACT_NAME, () => {
  let _owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;

  beforeEach(async () => {
    [_owner, attacker] = await ethers.getSigners();

    contract = await (await ethers.getContractFactory(CONTRACT_NAME)).deploy(attacker.address);
  });

  it("Solves the challenge", async () => {
    await (await ethers.getContractFactory("ChallengeMetaverseSupermarketAttacker", attacker)).deploy(contract.address);

    const mealAddress = await contract.meal();
    const meal = (await ethers.getContractFactory("Meal")).attach(mealAddress);
    expect(await meal.balanceOf(attacker.address)).to.be.greaterThanOrEqual(10);
  });
});
