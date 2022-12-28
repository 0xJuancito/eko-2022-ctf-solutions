import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "SmartHorrocrux";

describe(CONTRACT_NAME, () => {
  let _owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;

  beforeEach(async () => {
    [_owner, attacker] = await ethers.getSigners();

    contract = await (await ethers.getContractFactory(CONTRACT_NAME)).deploy({ value: 2 });
  });

  it("Solves the challenge", async () => {
    const destroyer = await (await ethers.getContractFactory("SmartHorrocruxDestroyer", attacker)).deploy();
    await destroyer.destroy(contract.address, { value: 1 });

    await (await ethers.getContractFactory("SmartHorrocruxAttacker", attacker)).deploy(contract.address);

    const tx = contract.alive();
    await expect(tx).to.be.rejectedWith(Error);
  });
});
