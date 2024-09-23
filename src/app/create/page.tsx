import FormDo from "@/components/FormDo";
import HeaderDo from "@/components/HeaderDo";
import TimelineForm from "@/components/TimelineForm";
import React from "react";

const Page = async () => {
  return (
    <div className="my-4">
      <div className="flex justify-between items-center text-4xl font-bold border-b pb-4">
        <HeaderDo />
      </div>
      <FormDo />
    </div>
  );
};

export default Page;
