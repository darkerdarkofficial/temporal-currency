
export const ProofOfIntentABI = [
  {"inputs":[{"internalType":"string","name":"_initialCiphertextIpfs","type":"string"}],"stateMutability":"payable","type":"constructor"},
  {"inputs":[],"name":"bondedETH","outputs":[{"internalType":"uint256","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"creator","outputs":[{"internalType":"address","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"genesisTimestamp","outputs":[{"internalType":"uint256","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"ipfsCiphertext","outputs":[{"internalType":"string","type":"string"}],"stateMutability":"view","type":"function"}
] as const;