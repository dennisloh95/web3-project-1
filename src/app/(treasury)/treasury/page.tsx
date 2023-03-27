import React, { cache } from "react";
import { formatNumber, shortenAddress, toUSD } from "@/lib/utils";
import colors from "tailwindcss/colors";
import TopTokensPie from "@/components/TopTokensPie";
import { CardContainer } from "@/components/CardContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web3 Project 1 | Treasury",
};

type TreasuryType = {
  data: {
    tokens: {
      id: string;
      symbol: string;
      balance: string;
      priceUSD: string;
      valueUSD: string;
    }[];
    holders: {
      id: string;
      amount: string;
    }[];
    numberOfHolders: {
      id: string;
      symbol: string;
      number: string;
    }[];
    dailyVolumes: {
      symbol: string;
      volume: string;
    }[];
  };
};

const getTreasury: () => Promise<TreasuryType> = cache(async () => {
  const response = await fetch(
    `https://gateway.thegraph.com/api/${process.env.THEGRAPH_API}/subgraphs/id/4N8HpyQP9r1ZsTQYavyQ5v9TffgUz5aFApmaeQ4P3Zs4`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `{
          tokens(where:{
            valueUSD_gt:10
          },first:10,orderBy:valueUSD,orderDirection:desc) {
            id
            symbol
            balance
            priceUSD
            valueUSD
          }
          holders(first:5,orderBy:amount,orderDirection:desc){
            id
            amount
          }
          numberOfHolders{
            id
            symbol
            number
          }
          dailyVolumes{
            volume
            symbol
          }
        }`,
      }),
      next: {
        // revalidate every 3 hours
        revalidate: 10800,
      },
    }
  );

  return response.json();
});

const Treasury = async () => {
  const res = await getTreasury();

  const treasuryTotalAmountNumber = res.data.tokens.reduce(
    (acc, { valueUSD }) => {
      return acc + parseFloat(valueUSD);
    },
    0
  );
  const treasuryTotalAmount = toUSD(treasuryTotalAmountNumber);

  const bitdaoPrice = toUSD(
    parseFloat(
      res.data.tokens.find((token) => token.symbol === "BIT")?.priceUSD ?? "0"
    )
  );

  const pieData = res.data.tokens
    .filter(
      ({ valueUSD }) => parseFloat(valueUSD) > treasuryTotalAmountNumber * 0.01
    )
    .map(({ valueUSD, symbol }) => ({
      value: parseFloat(valueUSD).toFixed(2),
      name: symbol,
      itemStyle: {
        color: symbol === "BIT" ? "#c1ff3c" : colors.slate[400],
      },
      selected: symbol === "BIT" ? true : false,
    }));

  return (
    <div className="h-full">
      <div className="flex flex-col md:flex-row flex-1 w-full h-full gap-5">
        <div className="flex flex-1 flex-col gap-5">
          <CardContainer className="flex flex-col gap-y-5">
            <h1 className="font-bold text-2xl">BitDAO</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-5">
              <div className="rounded py-3">
                <h5 className="text-sm ">Current Price</h5>
                <h3 className="text-2lg font-bold">{bitdaoPrice}</h3>
              </div>
              <div className="rounded py-3">
                <h5 className="text-sm ">Treasury</h5>
                <h3 className="text-2lg font-bold">{treasuryTotalAmount}</h3>
              </div>
              <div className="rounded py-3">
                <h5 className="text-sm ">Holders</h5>
                <h3 className="text-2lg font-bold">
                  {res.data.numberOfHolders[0].number}
                </h3>
              </div>
              <div className="rounded py-3">
                <h5 className="text-sm ">Daily Volumes</h5>
                <h3 className="text-2lg font-bold">
                  {toUSD(parseFloat(res.data.dailyVolumes[0].volume))}
                </h3>
              </div>
            </div>
          </CardContainer>
          <CardContainer className="flex grow flex-col  gap-y-5">
            <h2 className="text-xl font-bold">Treasury</h2>
            <div>
              <div className="hidden md:grid md:grid-cols-6 gap-5 p-3 items-center text-sm relative font-medium">
                <div className="truncate">
                  <span>Token</span>
                </div>
                <div className="truncate col-span-2">
                  <span>Balance</span>
                </div>
                <div className="truncate">
                  <span>Price</span>
                </div>
                <div className="truncate col-span-2">
                  <span>Value</span>
                </div>
              </div>
              <div>
                {res.data.tokens.map(
                  ({ id, symbol, balance, priceUSD, valueUSD }) => (
                    <div
                      key={id}
                      className="grid md:grid-cols-6 gap-3 md:gap-5 p-3 items-center text-sm relative border-b border-slate-500/30 last:border-b-0"
                    >
                      <div>
                        <span className="md:hidden w-20 inline-block">
                          Token:
                        </span>
                        {symbol}
                      </div>
                      <div className="col-span-2 truncate">
                        <span className="md:hidden w-20 inline-block">
                          Balance:
                        </span>
                        {formatNumber(parseFloat(balance))}
                      </div>
                      <div>
                        <span className="md:hidden w-20 inline-block">
                          Price:
                        </span>
                        {toUSD(parseFloat(priceUSD))}
                      </div>
                      <div className="col-span-2 truncate">
                        <span className="md:hidden w-20 inline-block">
                          Value:
                        </span>
                        {toUSD(parseFloat(valueUSD))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContainer>
        </div>
        <CardContainer className="flex flex-col w-full md:w-[300px] gap-5">
          <div>
            <h2 className="text-xl font-bold mb-3">Top 5 Holders</h2>
            <table className="text-left w-full">
              <thead>
                <tr>
                  <th className="font-bold text-sm">Address</th>
                  <th className="font-bold text-sm">{`Amount(BIT)`}</th>
                </tr>
              </thead>
              <tbody>
                {res.data.holders.map(({ id, amount }) => (
                  <tr key={id} className="text-sm leading-relaxed">
                    <td>
                      <a
                        href={`https://etherscan.io/address/${id}`}
                        target="_blank"
                        className="underline"
                      >
                        {shortenAddress(id)}
                      </a>
                    </td>
                    <td>{formatNumber(parseFloat(amount))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <TopTokensPie data={pieData} />
          </div>
        </CardContainer>
      </div>
    </div>
  );
};

export default Treasury;
