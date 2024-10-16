import { TonConnect } from "@tonconnect/sdk";

let tonConnect;

if (typeof window !== "undefined") {
  tonConnect = new TonConnect({
    manifestUrl:
      "https://violet-traditional-rabbit-103.mypinata.cloud/ipfs/QmQJJAdZ2qSwdepvb5evJq7soEBueFenHLX3PoM6tiBffm",
  });
}

export { tonConnect };
