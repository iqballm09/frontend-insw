"use client";
import React, { useEffect } from "react";
import { DataTable } from "./data-table-home";
import { columns } from "./Column-Request-DO";
import { useAppState } from "@/provider/AppProvider";
import useGetListDo from "@/hooks/useGetListDo";
import { toast } from "sonner";
import { ListDo } from "@/models/ListDo";
import CenteredProgress from "./ProgressBar";

const ListDO = ({ token }: { token: string }) => {
  useEffect(() => {
    localStorage.setItem("access_token", token);
  }, [token]);
  const query = useGetListDo();
  const context = useAppState();
  if (query.isLoading) {
    return <CenteredProgress/>;
  }

  if (query.isError) {
    return <>Error when fetching list DO Request</>;
  }

  const filteredData = context.filterStatus === "All Status" ? query.data : query.data.filter((item: ListDo) => item.status === context.filterStatus);

  return (
    <>
      {query.isSuccess && (
        <DataTable columns={columns} data={filteredData as ListDo[]} />
      )}
    </>
  );
};

export default ListDO;
