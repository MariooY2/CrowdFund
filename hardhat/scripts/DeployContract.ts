import { viem } from "hardhat";
async function main() {
  const Crowdfunding = await viem.deployContract("Crowdfunding");
  console.log(`Token contract deployed at ${Crowdfunding.address}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
