import { CardContainer } from "@/components/CardContainer";
import React from "react";
import type { Metadata } from "next";

const tokens = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
  },
  { id: "ethereum", symbol: "eth", name: "Ethereum" },
  { id: "tether", symbol: "usdt", name: "Tether" },
  {
    id: "bitdao",
    symbol: "bit",
    name: "BitDAO",
  },
];

type tokens = {
  [key: string]: {
    usd: number;
  };
};

const fetchTokensPrice = async () => {
  const ids = tokens.map((token) => token.id).join(",");
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${"usd"}`
  );
  const data = res.json();
  return data;
};

export const metadata: Metadata = {
  title: "Web3 Project 1 | Home",
};

const Home = async () => {
  const data: tokens = await fetchTokensPrice();

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tokens.map(({ id }) => {
          if (data[id]) {
            return (
              <CardContainer key={id}>
                <h5 className="hidden md:block text-sm capitalize text-slate-500 truncate">
                  {`
                  ${id} Price (${tokens
                    .find((token) => token.id === id)
                    ?.symbol.toUpperCase()})
                `}
                </h5>
                <h5 className="md:hidden text-xs text-slate-500">
                  {tokens
                    .find((token) => token.id === id)
                    ?.symbol.toUpperCase()}
                </h5>
                <h3 className="font-bold  mt-3 md:text-xl">${data[id]?.usd}</h3>
              </CardContainer>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Home;
