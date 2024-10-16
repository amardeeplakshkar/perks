"use client";
import Script from "next/script";
import "./globals.css";
import Footer from "../components/Footer";
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
          <TonConnectUIProvider manifestUrl="https://apricot-selected-dog-88.mypinata.cloud/ipfs/QmXvaFWgecTknsxyq4zASJSHMCqKJ3vXz2KgFnejC6oGHu">
            {children}
          </TonConnectUIProvider>
        </div>
        <footer className="sticky bottom-0 w-full">
          <Footer />
        </footer>
      </body>
    </html>
  );
}
