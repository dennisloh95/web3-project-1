import React, { useEffect, useState } from "react";
import FormField from "./FormField";
import { FaCoins } from "react-icons/fa";
import { Button } from "../Button";
import {
  CreateCampaignFormType,
  useCreateCampaign,
} from "@/hooks/crowdfunding";
import { checkIfImage, shortenAddress } from "@/lib/utils";
import { toast } from "../toast";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

const targetedChain = 5001;
let transactionHash =
  "0xd1cc6fbf1aae51cece206b9fc5ab47077d6149f004874da63fbb62e4460366fc";

const CreateCampaign = () => {
  const [form, setForm] = useState<CreateCampaignFormType>({
    name: "",
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });
  const { createCampaign, isLoading, isSuccess, data } =
    useCreateCampaign(form);

  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork({
    chainId: targetedChain,
  });

  useEffect(() => {
    if (!isConnected) {
      toast({
        title: "Connect wallet to use the app",
        message: "Please check if wallet is connected",
        type: "error",
      });
    }

    if (chain?.id !== targetedChain && switchNetwork) {
      switchNetwork();
    }
  }, [chain, isConnected, switchNetwork]);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Create campaign successful!",
        message: "Your campaign has been created.",
        type: "success",
      });
      setForm({
        name: "",
        title: "",
        description: "",
        target: "",
        deadline: "",
        image: "",
      });
    }
  }, [isSuccess]);

  const handleFormFieldChange = (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handlerCreateCampaign = () => {
    checkIfImage(form.image, async (exists) => {
      if (exists) {
        createCampaign?.();
      } else {
        toast({
          title: "Invalid image",
          message: "Provide valid image URL",
          type: "error",
        });
        setForm({ ...form, image: "" });
      }
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log("submit");
    handlerCreateCampaign();
  };

  return (
    <div className="bg-white flex justify-center items-center flex-col rounded-md sm:p-10 p-4 bo">
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-slate-900 rounded-[10px]">
        <h2 className="font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          Start a Campaign
        </h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full mt-[65px] flex flex-col gap-[30px]"
      >
        <div className="flex flex-wrap gap-[40px] ">
          <FormField
            labelName="Your name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange("name", e)}
          />
          <FormField
            labelName="Campaign Title*"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange("title", e)}
          />
        </div>
        <FormField
          labelName="Story *"
          placeholder="Write your story"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange("description", e)}
        />
        <div className="w-full flex justify-start items-center p-4 border border-slate-500/30 shadow border-2 h-[120px] rounded-[10px]">
          <FaCoins className="text-3xl" />
          <h4 className="font-bold text-[25px] text-slate-900 ml-[20px]">
            You will get 100% of the raised amount
          </h4>
        </div>
        <div className="flex flex-wrap gap-[40px] ">
          <FormField
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange("target", e)}
          />
          <FormField
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange("deadline", e)}
          />
        </div>
        <FormField
          labelName="Campaign image *"
          placeholder="Place image URL of your campaign"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange("image", e)}
        />
        <div className="flex justify-center items-center mt-[40px] flex-col">
          <Button
            isLoading={isLoading}
            disabled={!createCampaign || isLoading}
            type="submit"
          >
            {isLoading ? "Creating..." : "Submit new campaign"}
          </Button>
          {data?.hash && isLoading && (
            <span className="mt-3 animate-pulse">
              Transaction pending on{" "}
              <a
                href={`https://explorer.testnet.mantle.xyz/tx/${data.hash}`}
                target="_blank"
                className="text-sm underline"
              >
                {shortenAddress(data.hash)}
              </a>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
