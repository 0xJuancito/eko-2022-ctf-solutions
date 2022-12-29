import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CONTRACT_NAME = "Laboratory";

describe(CONTRACT_NAME, () => {
  let _owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let contract: Contract;

  beforeEach(async () => {
    [_owner, attacker] = await ethers.getSigners();

    contract = await (await ethers.getContractFactory(CONTRACT_NAME)).deploy(attacker.address);
    await contract.deployed();

    const tx = await contract.mergePhoenixDitto();
    await tx.wait();
  });

  it("Solves the challenge", async () => {
    const phoenixttoAddr = await contract.addr();
    const phoenixtto = (await ethers.getContractFactory("Phoenixtto", attacker)).attach(phoenixttoAddr);

    const tx = await phoenixtto.capture("");
    await tx.wait();

    const deployer = await (
      await ethers.getContractFactory("ChallengePhoenixttoDeployer", attacker)
    ).deploy(contract.address);
    await deployer.deployed();

    expect(await contract.isCaught()).to.be.true;
  });
});
