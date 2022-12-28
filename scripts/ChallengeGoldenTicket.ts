import { ethers } from "hardhat";

const contractAddress = "0x7425C716A0D6E4dbbC9D8D9866567c981Dc06473";

async function main() {
  const attackerContract = await (
    await ethers.getContractFactory("ChallengeGoldenTicketAttacker")
  ).deploy(contractAddress);
  await attackerContract.deployed();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
