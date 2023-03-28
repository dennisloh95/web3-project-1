"use client";

import React, { ReactNode } from "react";
import { configureChains, createClient, goerli, WagmiConfig } from "wagmi";
import { publicProvider } from "@wagmi/core/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { Chain } from "wagmi";

export const mantle = {
  id: 5001,
  name: "Mantle",
  network: "mantle",
  nativeCurrency: {
    decimals: 18,
    name: "BitDAO",
    symbol: "Bit",
  },
  rpcUrls: {
    public: { http: ["https://rpc.testnet.mantle.xyz"] },
    default: { http: ["https://rpc.testnet.mantle.xyz"] },
  },
  blockExplorers: {
    default: { name: "Wadsley", url: "https://explorer.testnet.mantle.xyz" },
  },
} as const satisfies Chain;

// web3
const { chains, provider, webSocketProvider } = configureChains(
  [goerli, mantle],
  [publicProvider()]
);

export const requiredChains = chains;
const web3Client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
  webSocketProvider,
});

const Providers = ({ children }: { children: ReactNode }) => {
  return <WagmiConfig client={web3Client}>{children}</WagmiConfig>;
};

export default Providers;
