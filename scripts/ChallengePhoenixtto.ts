import { ethers } from "hardhat";

const contractAddress = "0x3807Ab11aA49f20ec66A678EFe4b8c8be1fAb0B0";

async function main() {
  const contract = (await ethers.getContractFactory("Laboratory")).attach(contractAddress);

  const phoenixttoAddr = await contract.addr();
  const phoenixtto = (await ethers.getContractFactory("Phoenixtto")).attach(phoenixttoAddr);

  const tx = await phoenixtto.capture("");
  await tx.wait();

  const deployer = await (await ethers.getContractFactory("ChallengePhoenixttoDeployer")).deploy(contract.address);
  await deployer.deployed();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
