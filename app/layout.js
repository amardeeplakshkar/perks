"use client";

import Script from "next/script";
import "./globals.css";
import Footer from "../components/Footer";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add meta tags for better mobile handling */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="h-screen overflow-hidden flex flex-col bg-black">
        {/* Load Telegram Web App SDK */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
          onError={() => console.error("Failed to load Telegram SDK")}
        />
        <div className="flex-1 flex flex-col p-2">
          {/* TonConnect provider with your manifest */}
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
