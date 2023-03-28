"use client";

import { ParseCampaignType } from "@/hooks/crowdfunding";
import React, { FC } from "react";
import FundCard from "./FundCard";

interface DisplayCampaignsProps {
  title: string;
  isLoading: boolean;
  campaigns: ParseCampaignType[];
}

const DisplayCampaigns: FC<DisplayCampaignsProps> = ({
  title,
  isLoading,
  campaigns,
}) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-500 mb-5">
        {title} ({campaigns.length})
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4">
        {isLoading && <div>loading</div>}
        {!isLoading && campaigns.length === 0 && <div>No Campaigns</div>}
        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign) => (
            <FundCard {...campaign} key={campaign.pId} />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
