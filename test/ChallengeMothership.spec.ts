import { TransactionResponse } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "Mothership";

describe(CONTRACT_NAME, () => {
  let _owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;
  let tx: TransactionResponse;

  beforeEach(async () => {
    [_owner, attacker] = await ethers.getSigners();

    contract = await (await ethers.getContractFactory(CONTRACT_NAME)).deploy();
  });

  it("Solves the challenge", async () => {
    const attackerContract = await (
      await ethers.getContractFactory("ChallengeMothershipAttacker", attacker)
    ).deploy(contract.address);

    tx = await attackerContract.attack();

    expect(await contract.hacked()).to.be.true;
  });
});
