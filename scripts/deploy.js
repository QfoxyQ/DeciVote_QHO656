import { network } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const { ethers } = await network.connect("ganache");

  const deciVote = await ethers.deployContract("DeciVote");
  await deciVote.waitForDeployment();

  const address = await deciVote.getAddress();
  console.log("DeciVote deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
