import { TransactionResponse } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract, utils } from "ethers";
import { ethers } from "hardhat";

describe("HiddenKitty", () => {
  let _owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;
  let tx: TransactionResponse;

  beforeEach(async () => {
    [_owner, attacker] = await ethers.getSigners();

    const factory = await (await ethers.getContractFactory("ChallengeHiddenKittyFactory")).deploy();

    tx = await factory.deploy(_owner.address);
    await tx.wait();

    const contractAddress = await factory.challenge();
    contract = (await ethers.getContractFactory("House")).attach(contractAddress);
  });

  it("Solves the challenge", async () => {
    await tx.wait(69);

    await (await ethers.getContractFactory("HiddenKittyCatAttacker", attacker)).deploy(contract.address);

    expect(await contract.catFound()).to.be.true;
  });
});
