import React, { FC } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web3 Project 1 | Apps",
};

const Apps: FC = () => {
  return (
    <div className="h-full flex justify-center items-center">
      <h3 className="text-center font-bold text-2xl text-slate-500">
        Coming Soon
      </h3>
    </div>
  );
};

export default Apps;
