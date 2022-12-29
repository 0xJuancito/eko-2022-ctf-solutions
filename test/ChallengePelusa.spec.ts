import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "Pelusa";

describe(CONTRACT_NAME, () => {
  let _owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;

  beforeEach(async () => {
    [_owner, attacker] = await ethers.getSigners();

    contract = await (await ethers.getContractFactory(CONTRACT_NAME)).deploy();
    await contract.deployed();
  });

  it("Solves the challenge", async () => {
    const pelusaDeployer = await (await ethers.getContractFactory("PelusaDeployer", attacker)).deploy(contract.address);
    await pelusaDeployer.deployed();

    const attackerContractAddress = await pelusaDeployer.attacker();
    const attackerContract = (await ethers.getContractFactory("ChallengePelusaAttacker")).attach(
      attackerContractAddress,
    );

    const tx = await attackerContract.attack(_owner.address);
    await tx.wait();

    expect(await contract.goals()).to.eq(2);
  });
});
