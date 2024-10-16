"use client";

import React, { useEffect, useState } from "react";
import { tonConnect } from "../utils/tonConnect";

export default function WalletPage() {
  const [wallets, setWallets] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch available wallets when the component mounts
  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const availableWallets = await tonConnect.getWallets();
        console.log("Available wallets:", availableWallets);
        setWallets(availableWallets);
      } catch (error) {
        console.error("Failed to fetch wallets:", error);
        alert("Failed to load wallets. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWallets();

    // Add event listener for wallet status change
    tonConnect.onStatusChange((wallet) => {
      if (wallet) {
        console.log("Wallet connected:", wallet);
        setWalletInfo(wallet);
        setIsConnected(true);
      } else {
        setIsConnected(false);
        setWalletInfo(null);
      }
    });
  }, []);

  const connectWallet = async (wallet, attempt = 1) => {
    try {
      console.log(`Attempting to connect (attempt ${attempt})...`);
      await tonConnect.connect({
        universalLink: wallet.universalLink,
        bridgeUrl: wallet.bridgeUrl,
        manifestUrl: "https://violet-traditional-rabbit-103.mypinata.cloud/ipfs/QmQJJAdZ2qSwdepvb5evJq7soEBueFenHLX3PoM6tiBffm"
      });
      console.log("Wallet connected!");
    } catch (error) {
      console.error(`Connection failed on attempt ${attempt}:`, error);
      if (attempt < 3) {
        // Retry up to 3 times
        connectWallet(wallet, attempt + 1);
      } else {
        alert("Wallet connection failed. Please try again.");
      }
    }
  };
  

  const sendTransaction = async () => {
    if (!walletInfo) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      await tonConnect.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 60, // Valid for 60 seconds
        messages: [
          {
            address: process.env.NEXT_PUBLIC_TON_WALLET_ADDRESS,
            amount: "10000000", // 0.01 TON in nanoTONs
            payload: "",
          },
        ],
      });
      alert("Transaction sent successfully!");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Connect TON Wallet</h2>

      {isConnected ? (
        <>
          <p className="bg-red-700">Connected to: {walletInfo.account.address}</p>
          <button onClick={sendTransaction}>Send 0.01 TON</button>
        </>
      ) : isLoading ? (
        <p className="bg-red-700">Loading wallets...</p>
      ) : (
        <ul>
          {wallets.map((wallet) => (
            <li key={wallet.name} style={{ marginBottom: "10px" }}>
              <button onClick={() => connectWallet(wallet)}>
                Connect with {wallet.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
