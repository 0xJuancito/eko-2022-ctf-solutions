import { ethers } from "hardhat";

const contractAddress = "0x624A2E66B447B3e3519b257D5A2E47c82B98B2b0";

async function main() {
  const attackerContract = await (await ethers.getContractFactory("HiddenKittyCatAttacker")).deploy(contractAddress);
  await attackerContract.deployed();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
