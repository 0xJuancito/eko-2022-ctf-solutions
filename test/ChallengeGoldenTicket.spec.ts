import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "GoldenTicket";

describe(CONTRACT_NAME, () => {
  let _owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;

  beforeEach(async () => {
    [_owner, attacker] = await ethers.getSigners();

    contract = await (await ethers.getContractFactory(CONTRACT_NAME)).deploy();
  });

  it("Solves the challenge", async () => {
    await (await ethers.getContractFactory("ChallengeGoldenTicketAttacker", attacker)).deploy(contract.address);

    expect(await contract.hasTicket(attacker.address)).to.be.true;
  });
});
