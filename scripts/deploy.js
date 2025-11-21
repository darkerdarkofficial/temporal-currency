
// scripts/deploy.js
// npx hardhat run scripts/deploy.js --network sepolia

const { ethers } = require("hardhat");
const fs = require("fs");
const { File } = require("web3.storage");
const { Web3Storage } = require("web3.storage");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1. Upload OpenFHE ciphertext to IPFS
  const token = process.env.WEB3_STORAGE_TOKEN; // set in .env
  if (!token) throw new Error("WEB3_STORAGE_TOKEN missing");

  const client = new Web3Storage({ token });
  const ciphertext = fs.readFileSync("../openfhe/temporal_genesis.ct");
  const file = new File([ciphertext], "temporal_genesis.ct");
  const cid = await client.upload([file]);
  const ipfsHash = `ipfs://${cid}`;
  console.log("Ciphertext uploaded →", ipfsHash);

  // 2. Deploy contract
  const PoI = await ethers.getContractFactory("ProofOfIntent");
  const poi = await PoI.deploy(ipfsHash, { value: ethers.parseEther("0.1") });
  await poi.waitForDeployment();

  console.log("ProofOfIntent deployed to:", poi.target);
  console.log("Etherscan:", `https://sepolia.etherscan.io/address/${poi.target}`);
  console.log("Birth certificate complete. 30 months remaining.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});