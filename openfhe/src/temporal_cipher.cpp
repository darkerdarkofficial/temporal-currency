
// temporal_cipher.cpp
// OpenFHE CKKS – Temporal Currency (30 months genesis)
// Compile: g++ temporal_cipher.cpp -o temporal_cipher -lopenfhe -std=c++17

#include "openfhe.h"
#include "binfhe/binfhecontext.h"
#include <iostream>
#include <fstream>
#include <vector>

using namespace lbcrypto;

int main(int argc, char** argv) {
    // 1. CKKS parameters – 30 months with high precision
    uint32_t depth = 10;
    uint32_t scaleModSize = 50;
    uint32_t batchSize = 8;

    CCParams<CryptoContextCKKS> parameters;
    parameters.SetMultiplicativeDepth(depth);
    parameters.SetScalingModSize(scaleModSize);
    parameters.SetBatchSize(batchSize);

    CryptoContext<DCRTPoly> cc = GenCryptoContext(parameters);
    cc->Enable(PKE);
    cc->Enable(LEVELEDHE);
    cc->Enable(ADVANCEDSHE);

    // 2. Key generation
    auto keyPair = cc->KeyGen();
    cc->EvalMultKeyGen(keyPair.secretKey);
    cc->EvalRotateKeyGen(keyPair.secretKey, {1, -1});  // for future slot rotation if needed

    // 3. Initial state: 30.000000 months remaining, progress = 0.0
    std::vector<double> timeRemaining = {30.000000, 0.0};  // slot 0 = months, slot 1 = progress
    Plaintext pt = cc->MakeCKKSPackedPlaintext(timeRemaining);
    auto ct = cc->Encrypt(keyPair.publicKey, pt);

    // 4. Serialize ciphertext to file (will be uploaded to IPFS)
    std::ofstream ciphertextFile("temporal_genesis.ct", std::ios::binary);
    Serialized ser;
    ct->Serialize(&ser);
    SerializeToFile("temporal_genesis.ct", ser, SerType::BINARY);
    std::cout << "Genesis ciphertext (30.000000 months) written to temporal_genesis.ct\n";

    // 5. Public key for future homomorphic adjustments
    Serialized pubKeySer;
    keyPair.publicKey->Serialize(&pubKeySer);
    SerializeToFile("temporal_public.key", pubKeySer, SerType::BINARY);
    std::cout << "Public key written to temporal_public.key\n";

    std::cout << "Upload temporal_genesis.ct to IPFS → this is your birth certificate ciphertext.\n";
    return 0;
}