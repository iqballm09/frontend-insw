"use client";
import { ContainerDataTemplateResponse } from "@/models/ContainerResponse";
import { useAppState } from "@/provider/AppProvider";
import { FileType, uploadFile } from "@/utils/api";
import { Cargo, Container } from "@/utils/dummy-cargo-detail";
import React, { PropsWithChildren, useRef } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { DownloadCloud, UploadCloud } from "lucide-react";
import { Input } from "./ui/input";
import { v4 as uuidv4 } from "uuid";
import { NonContainerDataTemplateResponse } from "@/models/NonContainerResponse";
import { VinDataTemplateResponse } from "@/models/VinResponse";
import { Vin } from "./Column-Vin0";
import useGetOwnership from "@/hooks/useGetOwnership";

const UploadAndDownload = ({ type }: { type: FileType }) => {
  const template: Record<string, string> = {
    container: "/templateExcelContainerDoSp.xlsx",
    cargo: "/templateExcelCargoDoSp.xlsx",
    vin: "/templateExcelVinDoSp.xlsx",
  };

  const context = useAppState();
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const queryOwnership = useGetOwnership();

  const handleFile = (type: FileType) => {
    if (!uploadRef.current?.files?.[0]) {
      return;
    }

    toast.promise(uploadFile(uploadRef.current?.files?.[0], type), {
      loading: "Uploading...",
      success(data) {
        if (type == "container") {
          const res = data as ContainerDataTemplateResponse[];
          const containers: Container[] = res.map((item) => ({
            Id: uuidv4(),
            containerNumber: item.containerNo,
            grossWeight: String(item.grossWeight.amount),
            ownership: queryOwnership.data.filter((el: any) => el.kode === item.ownership).map((item: any) => item.uraian),
            sealNumber: item.sealNo,
            sizeAndType: item.sizeType.kodeSize,
            unit: item.grossWeight.unit,
          }));

          context.setContainerItems((prev) => [...containers, ...prev]);
        }

        if (type == "cargo") {
          const res = data as NonContainerDataTemplateResponse[];
          const cargo: Cargo[] = res.map((item) => ({
            Id: uuidv4(),
            descriptionOfGoods: item.goodsDescription,
            grossQuantity: String(item.grossWeight.amount),
            grossSatuan: item.grossWeight.unit,
            measurementQuantity: String(item.measurementVolume.amount),
            measurementSatuan: item.measurementVolume.unit,
            packageQuantity: String(item.packageQuantity.amount),
            packageSatuan: item.packageQuantity.unit,
          }));
          context.setCargoItems((prev) => [...cargo, ...prev]);
        }

        if (type == "vin") {
          const res = data as VinDataTemplateResponse;
          const vin: Vin[] = res.vinNumber.map((item: string) => ({
            Id: uuidv4(),
            vinNumber: String(item),
          }));
          context.setVinItems((prev) => [...vin, ...prev]);
        }
        return "Success upload file";
      },
      error: "Error upload file: File Template Invalid!",
    });
  };
  return (
    <div className=" space-x-2">
      <a target="_blank" href={template[type]} title="Download Template">
        <Button>
          <DownloadCloud />
        </Button>
      </a>
      <Input
        type="file"
        className="hidden"
        ref={uploadRef}
        onChange={() => handleFile(type)}
      />
      <Button onClick={() => uploadRef.current?.click()} title="Upload Template">
        <UploadCloud />
      </Button>
    </div>
  );
};

export default UploadAndDownload;
