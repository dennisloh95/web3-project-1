import React, { FC } from "react";
import type { Metadata } from "next";
import { FcIdea } from "react-icons/fc";
import Link from "next/link";
import { CardContainer } from "@/components/CardContainer";

export const metadata: Metadata = {
  title: "Web3 Project 1 | Apps",
};

const availableApps = [
  {
    name: "Crowdfunding",
    url: "/crowdfunding",
    icon: <FcIdea />,
  },
];

const Apps: FC = () => {
  return (
    <>
      <h1 className="font-bold text-2xl pb-5">Available Apps</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9  gap-5">
        {availableApps.map(({ name, url, icon }) => (
          <Link key={url} href={`/apps${url}`}>
            <CardContainer className="aspect-square border-slate-500/30 hover:drop-shadow-xl flex items-center justify-center  flex-col overflow-hidden">
              <div className="flex-1 text-4xl flex items-center">{icon}</div>
              <p className="truncate text-sm font-medium text-slate-500">
                {name}
              </p>
            </CardContainer>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Apps;
