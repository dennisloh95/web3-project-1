import React, { useEffect, useState } from "react";
import contractInterface from "@/contracts/CrowdFunding.json";
import {
  useAccount,
  useContractWrite,
  useContractRead,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import daysjs from "dayjs";

const contractChain = 5001;

type CampaignType = {
  owner: string;
  title: string;
  description: string;
  target: BigInt;
  deadline: BigInt;
  amountCollected: BigInt;
  image: string;
  searchKeyword: string;
};

export type ParseCampaignType = {
  amountCollected: string;
  deadline: number;
  description: string;
  image: string;
  owner: string;
  pId: number;
  target: string;
  title: string;
};

export type CreateCampaignFormType = {
  name: string;
  title: string;
  description: string;
  target: string;
  deadline: string;
  image: string;
};

const useCreateCampaign = (props: CreateCampaignFormType) => {
  const { title, description, target, deadline, image } = props;
  const debouncedTarget = useDebounce<string>(target, 500);

  const getTarget = (debouncedTarget: string) => {
    if (Number.isNaN(parseInt(debouncedTarget))) {
      return "0";
    } else {
      return parseInt(debouncedTarget).toString();
    }
  };

  const { address, isConnected } = useAccount();
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: "0x0809b1Fe09c5145329E1c653f94bff42aA43E6Ed",
    abi: contractInterface.abi,
    functionName: "createCampaign",
    chainId: contractChain,
    args: [
      address,
      title,
      description,
      ethers.utils.parseUnits(getTarget(debouncedTarget), 18),
      new Date(deadline).getTime(),
      image,
    ],
    enabled: Boolean(address && isConnected && target && image),
  });
  const {
    write: createCampaign,
    data,
    isSuccess: isCreateStarted,
  } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return { createCampaign, isLoading, isSuccess, isCreateStarted, data };
};

const useDonateCampaign = (pId: number, amount: string) => {
  const debouncedAmount = useDebounce<string>(amount, 500);

  const getAmount = (debouncedAmount: string) => {
    if (Number.isNaN(parseInt(debouncedAmount))) {
      return "0";
    } else {
      return parseInt(debouncedAmount).toString();
    }
  };

  const { address, isConnected } = useAccount();
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: "0x0809b1Fe09c5145329E1c653f94bff42aA43E6Ed",
    abi: contractInterface.abi,
    functionName: "donateToCampaign",
    chainId: contractChain,
    args: [pId],
    enabled: Boolean(address && isConnected),
    overrides: {
      value: ethers.utils.parseEther(getAmount(debouncedAmount)),
    },
  });
  const {
    write: donateToCampaign,
    data,
    isSuccess: isCreateStarted,
  } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return { donateToCampaign, isLoading, isSuccess, isCreateStarted, data };
};

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const useGetCampaigns = () => {
  const { data, isError, isLoading } = useContractRead({
    address: "0x0809b1Fe09c5145329E1c653f94bff42aA43E6Ed",
    abi: contractInterface.abi,
    functionName: "getCampaigns",
    chainId: contractChain,
  });
  const [campaigns, setCampaigns] = useState<ParseCampaignType[]>([]);

  useEffect(() => {
    if (Array.isArray(data)) {
      const parsedCampaigns = data
        .map((campaign: CampaignType, i: number) => ({
          owner: campaign.owner,
          title: campaign.title,
          description: campaign.description,
          target: ethers.utils.formatEther(campaign.target.toString()),
          deadline: Number(campaign.deadline),
          amountCollected: ethers.utils.formatEther(
            campaign.amountCollected.toString()
          ),
          image: campaign.image,
          pId: i,
        }))
        .filter(({ deadline }) => daysjs().isBefore(daysjs(deadline)));

      if (parsedCampaigns.length) {
        setCampaigns(parsedCampaigns);
      }
    }
  }, [data]);

  return { campaigns, isError, isLoading };
};

const useGetSingleCampaign = (pId: number) => {
  const { campaigns } = useGetCampaigns();
  const [campaign, setCampaign] = useState<ParseCampaignType | null>(null);

  useEffect(() => {
    if (campaigns.length) {
      let filteredCampaign = campaigns.filter(
        (campaign) => campaign.pId === pId
      );
      if (filteredCampaign.length) {
        setCampaign(filteredCampaign[0]);
      }
    }
  }, [campaigns, pId]);

  return { campaign };
};

const useGetUserCampaigns = () => {
  const { campaigns } = useGetCampaigns();
  const { address, isConnected } = useAccount();
  const [myCampaigns, setMyCampaigns] = useState(campaigns);

  useEffect(() => {
    if (isConnected && address) {
      let filteredCampaigns = campaigns.filter(
        (campaign) => campaign.owner === address
      );
      setMyCampaigns(filteredCampaigns);
    }
  }, [campaigns, isConnected, address]);

  return { myCampaigns };
};

const useGetDonations = (pId: number) => {
  const { data, isLoading } = useContractRead({
    address: "0x0809b1Fe09c5145329E1c653f94bff42aA43E6Ed",
    abi: contractInterface.abi,
    functionName: "getDonators",
    chainId: contractChain,
    args: [pId],
  });

  const [donators, setDonators] = useState<
    { donator: any; donation: string }[]
  >([]);

  useEffect(() => {
    if (Array.isArray(data)) {
      const numberOfDonations = data[0].length;
      const parsedDonations = [];
      for (let i = 0; i < numberOfDonations; i++) {
        parsedDonations.push({
          donator: data[0][i],
          donation: ethers.utils.formatEther(data[1][i].toString()),
        });
      }
      setDonators(parsedDonations);
    }
  }, [data]);

  return { donators, isLoading };
};

export {
  useGetCampaigns,
  useDebounce,
  useCreateCampaign,
  useGetUserCampaigns,
  useGetDonations,
  useGetSingleCampaign,
  useDonateCampaign,
};
