"use client";
import Script from "next/script";
import "./globals.css";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
export default function RootLayout({ children }) {
  const contextClass = {
    success: "bg-blue-600",
    error: "bg-red-600",
    info: "bg-gray-600",
    warning: "bg-orange-400",
    default: "bg-indigo-600",
    dark: "bg-white-600 font-gray-300",
  };

  return (
    <html lang="en">
      <body className="h-screen max-w-dvh overflow-hidden flex flex-col bg-black">
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <div className="flex-1 flex flex-col p-2">
          <TonConnectUIProvider manifestUrl="https://apricot-selected-dog-88.mypinata.cloud/ipfs/QmXvaFWgecTknsxyq4zASJSHMCqKJ3vXz2KgFnejC6oGHu">
            <ToastContainer
              toastClassName={(context) =>
                contextClass[context?.type || "default"] +
                " relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
              }
              bodyClassName={() => "text-sm font-white font-med block p-3"}
              position="bottom-left"
              autoClose={3000}
            />
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
