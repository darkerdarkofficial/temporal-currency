
// frontend/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow, addMonths } from "date-fns";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ProofOfIntentABI } from "@/abi/ProofOfIntent";

const CONTRACT_ADDRESS = "0xYourDeployedAddressHere" as `0x${string}`;

export default function Home() {
  const { address, isConnected } = useAccount();
  const [timeLeft, setTimeLeft] = useState("30.000000 months");

  const { data: creator } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ProofOfIntentABI,
    functionName: "creator",
  });

  const { data: genesis } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ProofOfIntentABI,
    functionName: "genesisTimestamp",
  });

  const isCreator = address === creator;

  // Simulate decaying time (real version would fetch decrypted value at checkpoint)
  useEffect(() => {
    if (!genesis) return;
    const interval = setInterval(() => {
      const elapsed = (Date.now() / 1000 - Number(genesis)) / (30 * 24 * 3600);
      const remaining = 30 - elapsed;
      setTimeLeft(remaining > 0 ? remaining.toFixed(6) + " months" : "EXPIRED");
    }, 1000);
    return () => clearInterval(interval);
  }, [genesis]);

  return (
    <div className="min-h-screen bg-black text-white font-mono p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl mb-4">The Birth Certificate of the First Temporal Currency</h1>
        <p className="text-xl mb-8 opacity-70">30 encrypted months · 2.5 years · monthly checkpoints</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-900 p-8 rounded">
            <h2 className="text-3xl mb-4">Time Remaining</h2>
            <div className="text-6xl font-bold text-green-400">{timeLeft}</div>
            <p className="mt-4 opacity-60">OpenFHE CKKS ciphertext (homomorphically adjustable)</p>
          </div>

          <div className="bg-gray-900 p-8 rounded">
            <h2 className="text-3xl mb-4">Next Checkpoint</h2>
            <div className="text-4xl">
              {genesis && formatDistanceToNow(addMonths(new Date(Number(genesis) * 1000), 1), { addSuffix: true })}
            </div>
            <p className="mt-4 opacity-60">Final reveal: May 21, 2028</p>
          </div>
        </div>

        {isCreator && (
          <div className="bg-purple-900 p-8 rounded mb-8">
            <h2 className="text-3xl mb-4">Creator Controls</h2>
            <button className="bg-white text-black px-6 py-3 rounded mr-4">+1 month (homomorphic)</button>
            <button className="bg-white text-black px-6 py-3 rounded">-0.5 month</button>
          </div>
        )}

        <div className="text-center opacity-50 text-sm">
          Contract: {CONTRACT_ADDRESS} · Creator: {creator?.slice(0, 8)}... · 30/30 checkpoints remaining
        </div>
      </div>
    </div>
  );
}