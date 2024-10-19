"use client"; // Ensure this runs in the browser

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { ReactNode } from "react";

interface TonProviderProps {
  children: ReactNode;
}

// TonConnectUIProvider wrapper to maintain state across the app
export default function TonConnectProvider({ children }: TonProviderProps) {
  return (
    <TonConnectUIProvider manifestUrl="https://apricot-selected-dog-88.mypinata.cloud/ipfs/QmXvaFWgecTknsxyq4zASJSHMCqKJ3vXz2KgFnejC6oGHu">
      {children}
    </TonConnectUIProvider>
  );
}
