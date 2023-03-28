import React, { useState } from "react";
import FormField from "./FormField";
import { FaCoins } from "react-icons/fa";
import { Button } from "../Button";
import {
  CreateCampaignFormType,
  useCreateCampaign,
} from "@/hooks/crowdfunding";
import { checkIfImage } from "@/lib/utils";
import { toast } from "../toast";

const CreateCampaign = () => {
  const [form, setForm] = useState<CreateCampaignFormType>({
    name: "",
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });

  const { createCampaign, isLoading, isSuccess } = useCreateCampaign(form);

  const handleFormFieldChange = (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        try {
          createCampaign?.();
        } catch (err) {
          console.log("err: ", err);
        }
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
          <Button isLoading={isLoading}>Submit new campaign</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
