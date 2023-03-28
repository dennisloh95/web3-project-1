import { CardContainer } from "@/components/CardContainer";
import React from "react";

const AppsLayout = ({ children }: { children: React.ReactNode }) => {
  return <CardContainer className="h-full p-5">{children}</CardContainer>;
};

export default AppsLayout;
