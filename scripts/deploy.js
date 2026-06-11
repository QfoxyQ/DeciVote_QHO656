import hre from "hardhat";
import fs from "fs";

async function main() {
  const { ethers } = hre;
  const DeciVote = await ethers.getContractFactory("DeciVote");
  const deciVote = await DeciVote.deploy();
  await deciVote.waitForDeployment();
  const address = await deciVote.getAddress();
  console.log("DeciVote deployed to:", address);
  fs.writeFileSync("contract-address.json", JSON.stringify({ address }, null, 2));
}

main().catch(console.error);
main().catch(console.error);
