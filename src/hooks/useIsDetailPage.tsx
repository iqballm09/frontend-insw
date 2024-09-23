import { useAppState } from "@/provider/AppProvider";
import { useParams } from "next/navigation";
import React from "react";

export const useIsDetailPage = () => {
  const params = useParams<{ id: string }>();
  const context = useAppState();
  return !!params.id && !context.isEditPage;
};
