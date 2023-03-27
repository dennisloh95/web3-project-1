"use client";

import React, { CSSProperties, FC } from "react";
import ReactECharts from "echarts-for-react";

type dataProps = {
  data: {
    value: string;
    name: string;
    itemStyle?: CSSProperties;
    selected?: boolean;
  }[];
};

const TopTokensPie: FC<dataProps> = ({ data }) => {
  const options = {
    toolbox: {
      show: false,
      feature: {
        saveAsImage: { show: true },
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{a}</br> {b}: {d}%",
    },
    legend: {
      show: true,
      bottom: 0,
      left: "center",
    },
    series: [
      {
        name: "BitDAO Treasury",
        type: "pie",
        radius: ["40%", "60%"],
        selectedMode: "single",
        avoidLabelOverlap: true,
        label: {
          show: true,
        },
        data,
        itemStyle: {
          borderRadius: 5,
          borderColor: "#fff",
          borderWidth: 2,
        },
        emphasis: {
          label: {
            show: true,
            fontWeight: "bold",
          },
        },
      },
    ],
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Top Treasury Tokens</h2>
      <span className="text-xs text-slate-500">*Only with greater than 1%</span>
      <ReactECharts
        option={options}
        className="w-full h-auto overflow-hidden"
      />
    </div>
  );
};

export default TopTokensPie;
