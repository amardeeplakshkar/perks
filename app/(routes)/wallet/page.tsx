  
"use client";

import { useState, useEffect, useCallback } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import TonAddress from "../../../components/Address";
import { useWallet } from "../../../components/context/WalletContext";
import TonLogo from "../../public/ton-logo.png";
import Image from "next/image";

export default function WalletPage() {
  const [tonConnectUI] = useTonConnectUI();
  const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setWalletAddress } = useWallet();

  const openInNewTab = (url: string) => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.openLink(url); // Open the link in Telegram’s external browser.
    } else {
      const newTab = window.open(url, "_blank", "noopener,noreferrer");
      if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
        alert("Please enable popups to open the wallet.");
      }
    }
  };

  const handleWalletAction = async () => {
    try {
      if (tonConnectUI.connected) {
        console.log("Disconnecting wallet...");
        setIsLoading(true);
        await tonConnectUI.disconnect();
        console.log("Wallet disconnected.");
      } else {
        console.log("Opening wallet connect modal...");
        await tonConnectUI.openModal();
      }
    } catch (error) {
      console.error("Error in wallet action:", error);
    }
  };

  const handleLinkClick = (event: MouseEvent) => {
    const target = event.target as HTMLAnchorElement;
    if (target.tagName === "A" && target.href.startsWith("ton://")) {
      event.preventDefault(); // Prevent navigation within the mini-app.
      openInNewTab(target.href); // Open the link in an external browser.
    }
  };

  useEffect(() => {
    // Add click event listener when the component mounts
    document.addEventListener("click", handleLinkClick);

    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener("click", handleLinkClick);
    };
  }, []);

  const handleWalletConnection = useCallback(
    (address: string) => {
      const base64Address = Address.parse(address).toString({
        urlSafe: true,
        bounceable: true, // Ensures it matches the wallet's display format.
      });

      setTonWalletAddress(base64Address);
      setWalletAddress(base64Address);
      console.log("Wallet connected with address:", base64Address);
      setIsLoading(false);
    },
    [setWalletAddress]
  );

  const handleWalletDisconnection = useCallback(() => {
    setTonWalletAddress(null);
    console.log("Wallet disconnected!");
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (tonConnectUI.account?.address) {
        handleWalletConnection(tonConnectUI.account.address);
      } else {
        handleWalletDisconnection();
      }
    };

    checkWalletConnection();

    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        handleWalletConnection(wallet.account.address);
      } else {
        handleWalletDisconnection();
      }
    });

    return () => unsubscribe();
  }, [tonConnectUI, handleWalletConnection, handleWalletDisconnection]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded">
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">TON Wallet Connect</h1>
      {tonWalletAddress ? (
        <div className="flex flex-col items-center">
          <p className="mb-4">
            <TonAddress />
          </p>
          <button
            onClick={() => tonConnectUI.disconnect()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <button
          onClick={handleWalletAction}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center gap-2"
        >
          <Image src={TonLogo} alt="Ton Logo" height={30} width={30} />
          Connect TON Wallet
        </button>
      )}
    </main>
  );
}
