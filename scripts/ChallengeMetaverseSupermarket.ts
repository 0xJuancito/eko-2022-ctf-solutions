import { ethers } from "hardhat";

const contractAddress = "0xB14f34e96b39A37077e1A9b1356B3E4E5e98cAc3";

async function main() {
  const attackerContract = await (
    await ethers.getContractFactory("ChallengeMetaverseSupermarketAttacker")
  ).deploy(contractAddress);
  await attackerContract.deployed();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
