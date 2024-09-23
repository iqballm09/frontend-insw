import React from "react";
import { ContainerItemForm } from "./form/ContainerItemForm";
import DeleteContainerItem from "./DeleteContainerItem";
import { Container } from "@/utils/dummy-cargo-detail";

export const ActionContainerItems = ({ con }: { con: Container }) => {
  return (
    <div className="flex gap-2 justify-center">
      <ContainerItemForm key={Object.values(con).join("_")} container={con} />
      <DeleteContainerItem con={con} />
    </div>
  );
};
