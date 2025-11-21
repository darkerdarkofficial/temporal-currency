# The Birth Certificate of the First Temporal Currency

**Artist / Creator**: 0x1ac50f0b3f587d01d279fbc0e4f2a87650faf0a8  
**Genesis**: November 21, 2025  
**Duration**: 30 encrypted months (2.5 years)  
**Checkpoints**: Monthly (30 total)  
**Final reveal**: May 21, 2028  

This repository is the complete, open-source reference implementation of **Proof-of-Intent (PoI)** — the world’s first temporal currency where **time is the primary asset** and ETH is the bonded stake.

## Live Instances (Sepolia Testnet)
- Contract: [0x4ef3a71c28d6b7ef9b3c8f7d2a9e1b6c5d8f0e3a](https://sepolia.etherscan.io/address/0x4ef3a71c28d6b7ef9b3c8f7d2a9e1b6c5d8f0e3a)
- Frontend: https://temporal.currency (coming after you run `npm run dev`)
- Initial Ciphertext (30.000000 months): ipfs://bafybei...

## Quick Start

```bash
# 1. Clone & install
git clone https://github.com/temporal-currency/temporal-currency.git
cd temporal-currency

# 2. Build OpenFHE ciphertext (30 months)
cd openfhe && mkdir build && cd build && cmake .. && make
./temporal_cipher   # → produces temporal_genesis.ct

# 3. Deploy contract + upload ciphertext
cd ../../
cp .env.example .env   # add your keys + web3.storage token
npx hardhat run scripts/deploy.js --network sepolia

# 4. Run frontend
cd frontend
npm install
npm run dev
# → http://localhost:3000