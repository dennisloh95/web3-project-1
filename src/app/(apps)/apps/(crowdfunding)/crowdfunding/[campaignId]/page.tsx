"use client";

import { Button } from "@/components/Button";
import { CardContainer } from "@/components/CardContainer";
import CountBox from "@/components/crowdfunding/CountBox";
import { toast } from "@/components/toast";
import {
  useDonateCampaign,
  useGetDonations,
  useGetSingleCampaign,
} from "@/hooks/crowdfunding";
import { calculateBarPercentage, daysLeft, shortenAddress } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { BiUser, BiChevronLeft } from "react-icons/bi";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

const targetedChain = 5001;

type CampaignDetailProps = {
  params: { campaignId: string };
};

const CampaignDetail: FC<CampaignDetailProps> = ({
  params: { campaignId },
}) => {
  const { donators } = useGetDonations(parseInt(campaignId));
  const { campaign } = useGetSingleCampaign(parseInt(campaignId));
  const [amount, setAmount] = useState("");

  const { donateToCampaign, isLoading, isSuccess, data } = useDonateCampaign(
    parseInt(campaignId),
    amount
  );

  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork({
    chainId: targetedChain,
  });

  useEffect(() => {
    if (!isConnected) {
      toast({
        title: "Connect wallet to use the app",
        message: "Please check if wallet is connected",
        type: "error",
      });
    }

    if (chain?.id !== targetedChain && switchNetwork) {
      switchNetwork();
    }
  }, [chain, isConnected, switchNetwork]);

  if (!campaign) {
    return <></>;
  }

  return (
    <div>
      <Link
        href="/apps/crowdfunding"
        className="flex items-center justify-center p-1 w-fit"
      >
        <BiChevronLeft className="mr-1" /> Back
      </Link>
      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          {/* eslint-disable @next/next/no-img-element */}
          <img
            src={campaign.image}
            alt="campaign"
            className="w-full h-[410px] object-cover rounded-xl "
          />
          <div className="relative w-full h-[8px] rounded-md  border border-slate-900 mt-2">
            <div
              className="absolute h-full bg-slate-900"
              style={{
                width: `${calculateBarPercentage(
                  parseFloat(campaign.target),
                  parseFloat(campaign.amountCollected)
                )}%`,
                maxWidth: "100%",
              }}
            ></div>
          </div>
        </div>

        <CardContainer>
          <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
            <CountBox title="Days Left" value={daysLeft(campaign.deadline)} />
            <CountBox
              title={`Raised of ${campaign.target}`}
              value={campaign.amountCollected}
            />
            <CountBox title={`Total Backers`} value={donators.length} />
          </div>
        </CardContainer>
      </div>

      <div className="flex mt-[60px] lg:flex-row flex-col gap-5">
        <div className="flex flex-col gap-[40px] flex-[2]">
          <div>
            <h4 className="font-semibold text-[18px] text-slate-900 uppercase">
              Creator
            </h4>
            <div className="flex mt-[20px] flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[40px] h-[40px] text-2xl border border-slate-500  rounded-full flex justify-center items-center">
                <BiUser />
              </div>
              <div>
                <a
                  href={`https://explorer.testnet.mantle.xyz/address/${campaign.owner}`}
                  target="_blank"
                  className="hover:underline"
                >
                  <h4 className="font-semibold text-[14px] text-slate-900 break-all">
                    {campaign.owner}
                  </h4>
                </a>
                {/* <p className="mt-[4px] font-normal text-[12px] text-[#808191 ]">
                  10 Campaigns
                </p> */}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[18px] text-slate-900 uppercase">
              Story
            </h4>
            <div className="mt-[20px] ">
              <p className="font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                {campaign.description}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[18px] text-slate-900 uppercase">
              Donators
            </h4>
            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? (
                donators.map((item, index) => (
                  <div
                    key={`${item.donator}-${index}`}
                    className="flex justify-between items-center gap-4"
                  >
                    <p className="font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                      {index + 1}. {item.donator}
                    </p>
                    <p className="font-normal text-[16px] text-[#808191] leading-[26px] break-all min-w-[40px] text-right">
                      {item.donation}
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                  No donators yet. Be the first one!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <CardContainer>
            <div className="flex flex-col p-4  rounded-[10px] mt-[20px]">
              <p className="font-medium text-[20px] leading-[30px] text-center">
                Fund the campaign
              </p>
              <div className="mt-[30px]">
                <input
                  type="number"
                  placeholder="BIT 0.1"
                  step="0.1"
                  min="1"
                  className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a4a43] bg-transparent text-slate-900 text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="mt-[20px] py-4  rounded-[10px]">
                  <h4 className="font-semibold text-[14px] leading-[22px] text-slate-900">
                    Back it because you believe in it.
                  </h4>
                  <p className="mt-[20px] font-normal leading-[22px] text-[#808191]">
                    Support the project for no reward, just because it speaks to
                    you.
                  </p>
                </div>
                <Button
                  isLoading={isLoading}
                  disabled={!donateToCampaign || isLoading}
                  onClick={() => donateToCampaign?.()}
                >
                  {isLoading ? "Donating..." : "Fund Campaign"}
                </Button>
                {data?.hash && isLoading && (
                  <div className="mt-3 animate-pulse">
                    Transaction pending on{" "}
                    <a
                      href={`https://explorer.testnet.mantle.xyz/tx/${data.hash}`}
                      target="_blank"
                      className="text-sm underline"
                    >
                      {shortenAddress(data.hash)}
                    </a>
                  </div>
                )}
                {data?.hash && isSuccess && (
                  <div className="mt-3">
                    Transaction successful on{" "}
                    <a
                      href={`https://explorer.testnet.mantle.xyz/tx/${data.hash}`}
                      target="_blank"
                      className="text-sm underline"
                    >
                      {shortenAddress(data.hash)}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </CardContainer>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
