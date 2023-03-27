"use client";

import React, { ReactNode } from "react";
import { configureChains, createClient, goerli, WagmiConfig } from "wagmi";
import { publicProvider } from "@wagmi/core/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

// web3
const { chains, provider, webSocketProvider } = configureChains(
  [goerli],
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
