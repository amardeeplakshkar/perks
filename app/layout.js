"use client";
import Script from "next/script";
import {WalletProvider} from "../components/context/WalletContext"
import "./globals.css";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen max-w-dvh overflow-hidden flex flex-col bg-black">
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <div className="flex-1 flex flex-col p-2">
          <WalletProvider>
          <TonConnectUIProvider manifestUrl="https://apricot-selected-dog-88.mypinata.cloud/ipfs/QmXvaFWgecTknsxyq4zASJSHMCqKJ3vXz2KgFnejC6oGHu">
            <ToastContainer position="top-right" autoClose={3000} />
            {children}
          </TonConnectUIProvider>
          </WalletProvider>
        </div>
        <footer className="sticky bottom-0 w-full">
          <Footer />
        </footer>
      </body>
    </html>
  );
}
