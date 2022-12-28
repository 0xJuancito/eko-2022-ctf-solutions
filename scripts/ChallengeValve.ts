import { ethers } from "hardhat";

const contractAddress = "0xAeb8d092cd58F9B3a5e6D9Fdd618126d83c27126";

async function main() {
  const attackerContract = await (await ethers.getContractFactory("ChallengeValveAttacker")).deploy();
  await attackerContract.deployed();

  const tx = await attackerContract.attack(contractAddress);
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
