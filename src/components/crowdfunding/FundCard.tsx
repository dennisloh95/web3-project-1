import { daysLeft, shortenAddress } from "@/lib/utils";
import React, { FC } from "react";
import { BiUser } from "react-icons/bi";
import { CardContainer } from "@/components/CardContainer";
import { ParseCampaignType } from "@/hooks/crowdfunding";
import Link from "next/link";

const FundCard: FC<ParseCampaignType> = ({
  title,
  owner,
  description,
  target,
  deadline,
  amountCollected,
  image,
  pId,
}) => {
  const remainingDays = daysLeft(deadline);

  return (
    <Link href={`/apps/crowdfunding/${pId}`}>
      <CardContainer className="border-2 border-slate-500/20 overflow-hidden">
        {/* eslint-disable @next/next/no-img-element */}
        <img
          src={image}
          alt="poster"
          className="w-full aspect-video object-cover rounded"
        />
        <div className="flex flex-col p-4">
          <div className="block">
            <h3 className="font-semibold   text-left  truncate">{title}</h3>
            <p className="mt-3  truncate">{description}</p>
          </div>

          <div className="flex justify-between flex-wrap mt-[15px] gap-2">
            <div className="flex flex-col">
              <h4 className=" font-semibold">{amountCollected}</h4>
              <p className="mt-[3px]  font-normal text-sm  truncate">
                Raised of {target}
              </p>
            </div>

            <div className="flex flex-col">
              <h4 className=" font-semibold  ">{remainingDays}</h4>
              <p className="mt-[3px]  font-normal text-sm  truncate">
                Days Left
              </p>
            </div>

            <div className="flex items-center mt-[20px] gap-[12px]">
              <div className="w-[30px] text-lg border border-slate-500 h-[30px] rounded-full flex justify-center items-center">
                <BiUser />
              </div>
              <p className="flex-1  text-sm truncate">
                by {shortenAddress(owner)}
                {/* <a
                  target="_blank"
                  href={`https://explorer.testnet.mantle.xyz/address/${owner}`}
                  className=" hover:underline"
                >

                  {shortenAddress(owner)}
                </a> */}
              </p>
            </div>
          </div>
        </div>
      </CardContainer>
    </Link>
  );
};

export default FundCard;
