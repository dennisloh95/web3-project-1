"use client";

import React, { FC, useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useEnsAvatar } from "wagmi";
import { Button } from "./Button";
import { requiredChains } from "./Providers";
import { InjectedConnector } from "wagmi/connectors/injected";
import { shortenAddress } from "@/lib/utils";
import { toast } from "./toast";
import { switchNetwork, getNetwork } from "@wagmi/core";

const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { connect, error } = useConnect({
    connector: new InjectedConnector({ chains: requiredChains }),
  });
  const { disconnect } = useDisconnect();
  const { chain } = getNetwork();

  const connectHandler = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  useEffect(() => {
    if (error) {
      toast({
        title: "Error connecting Wallet",
        message: "Please check if wallet is installed",
        type: "error",
      });
    }
  }, [error]);

  // fix hydration issue
  const [walletAddress, setWalletAddress] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    setWalletAddress(address);
  }, [address]);

  // useEffect(() => {
  //   if (chain?.id !== 5) {
  //     const switchNetworkHandler = async () => {
  //       try {
  //         await switchNetwork({
  //           chainId: 5,
  //         });
  //       } catch (err) {
  //         // console.log(err);
  //       }
  //     };
  //     switchNetworkHandler();
  //   }
  // }, [chain]);

  return (
    <Button onClick={connectHandler}>
      {walletAddress ? shortenAddress(walletAddress) : "Connect Wallet"}
    </Button>
  );
};

export default WalletConnect;
