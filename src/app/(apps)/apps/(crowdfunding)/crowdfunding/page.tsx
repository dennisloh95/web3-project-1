"use client";

import ClientOnly from "@/components/ClientOnly";
import DisplayCampaigns from "@/components/crowdfunding/DisplayCampaigns";
import { toast } from "@/components/toast";
import { useGetCampaigns, useGetUserCampaigns } from "@/hooks/crowdfunding";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Tab } from "@headlessui/react";
import CreateCampaign from "@/components/crowdfunding/CreateCampaign";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const tabItems = [
  {
    name: "Campaigns",
  },
  {
    name: "Create",
  },
  {
    name: "My Campaigns",
  },
];

const Crowdfunding = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { campaigns, isLoading } = useGetCampaigns();
  const { myCampaigns } = useGetUserCampaigns();
  return (
    <>
      <h1 className="font-bold text-2xl pb-5">Crowdfunding</h1>

      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex gap-3 mb-5">
          {tabItems.map((item) => (
            <Tab
              key={item.name}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg shadow py-2.5 text-sm font-medium leading-5 border-2 hover:shadow-lg",
                  selected
                    ? "bg-slate-900 text-white border-slate-900 "
                    : "bg-white text-slate-500 border-slate-500/30"
                )
              }
            >
              {item.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <ClientOnly>
              <DisplayCampaigns
                title="All campaigns"
                campaigns={campaigns}
                isLoading={isLoading}
              />
            </ClientOnly>
          </Tab.Panel>
          <Tab.Panel>
            <CreateCampaign />
          </Tab.Panel>
          <Tab.Panel>
            <DisplayCampaigns
              title="My campaigns"
              campaigns={myCampaigns}
              isLoading={isLoading}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

export default Crowdfunding;
