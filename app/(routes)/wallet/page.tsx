"use client";

import { useState, useEffect, useCallback } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Address } from "@ton/core";

export default function WalletPage() {
  const [tonConnectUI] = useTonConnectUI();
  const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleWalletConnection = useCallback((address: string) => {
    setTonWalletAddress(address);
    console.log("Wallet connected successfully with address:", address);
    setIsLoading(false);
  }, []);

  const handleWalletDisconnection = useCallback(() => {
    setTonWalletAddress(null);
    console.log("Wallet disconnected successfully!");
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const checkWalletConnection = async () => {
      console.log("Checking wallet connection...");
      if (tonConnectUI.account?.address) {
        console.log("Wallet already connected:", tonConnectUI.account.address);
        handleWalletConnection(tonConnectUI.account.address);
      } else {
        handleWalletDisconnection();
      }
    };

    checkWalletConnection();

    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        console.log("Status changed: Connected");
        handleWalletConnection(wallet.account.address);
      } else {
        console.log("Status changed: Disconnected");
        handleWalletDisconnection();
      }
    });

    return () => {
      console.log("Cleaning up listeners...");
      unsubscribe();
    };
  }, [tonConnectUI, handleWalletConnection, handleWalletDisconnection]);

  const openInNewTab = (url: string) => {
  if (window.Telegram?.WebApp) {
    // Open the link in the Telegram browser.
    window.Telegram.WebApp.openLink(url);
  } else {
    // Fallback for other browsers.
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

      // Add click listener to ensure deeplinks open in an external browser.
      const openDeeplink = (event: Event) => {
        const target = event.target as HTMLAnchorElement;
        if (target.tagName === "A" && target.href.includes("ton://")) {
          event.preventDefault(); // Prevent default behavior inside the mini-app.
          openInNewTab(target.href); // Open the deeplink in a new browser tab.
        }
      };

      // Listen for clicks on the modal links.
      document.addEventListener("click", openDeeplink);

      // Clean up the event listener after the modal is closed.
      tonConnectUI.onStatusChange(() => {
        document.removeEventListener("click", openDeeplink);
      });
    }
  } catch (error) {
    console.error("Error in wallet action:", error);
  }
};

  const formatAddress = (address: string) => {
    const tempAddress = Address.parse(address).toString();
    return `${tempAddress.slice(0, 4)}...${tempAddress.slice(-4)}`;
  };

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
      <h1 className="text-4xl font-bold mb-8">TON Connect Demo</h1>
      {tonWalletAddress ? (
        <div className="flex flex-col items-center">
          <p className="mb-4">Connected: {formatAddress(tonWalletAddress)}</p>
          <button
            onClick={handleWalletAction}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <button
          onClick={handleWalletAction}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect TON Wallet
        </button>
      )}
    </main>
  );
}
