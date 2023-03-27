"use client";

import Link from "next/link";
import React from "react";

import { CardContainer } from "./CardContainer";
import { usePathname } from "next/navigation";
import { AiTwotoneAppstore } from "react-icons/ai";
import { RiBearSmileLine } from "react-icons/ri";
import { BsGraphUp } from "react-icons/bs";
import { CiVault } from "react-icons/ci";

export const nav = [
  {
    title: "Home",
    url: "/",
    icons: <BsGraphUp />,
  },
  {
    title: "Apps",
    url: "/apps",
    icons: <AiTwotoneAppstore />,
  },
  {
    title: "Treasury",
    url: "/treasury",
    icons: <CiVault />,
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <nav className="sm:flex hidden mr-8 relative ">
      <div className="flex justify-between items-center flex-col sticky top-5 grow">
        <div className="h-14 w-full mb-8 flex items-center justify-center">
          <Link
            href="/"
            className="h-12 w-12 text-white text-2xl flex items-center justify-center bg-slate-900 rounded-full border border-slate-900 hover:shadow-lg hover:shadow-slate-700/30"
          >
            <RiBearSmileLine />
            <span className="sr-only">Home</span>
          </Link>
        </div>
        <CardContainer className="flex flex-1 flex-col items-center w-21">
          <div className="flex flex-col justify-center items-center gap-5">
            {nav.map(({ title, url, icons }) => (
              <Link
                key={title}
                href={url}
                className={`h-12 w-12 text-2xl flex items-center justify-center rounded-md border hover:shadow-lg hover:shadow-slate-500/30 hover:border-0 ${
                  url === pathname
                    ? "bg-slate-900 text-white"
                    : " border border-slate-500/30"
                }`}
              >
                {icons}
                <span className="sr-only">{title}</span>
              </Link>
            ))}
          </div>
        </CardContainer>
      </div>
    </nav>
  );
};

export default Sidebar;
