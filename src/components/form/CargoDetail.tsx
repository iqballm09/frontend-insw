"use client";
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Container,
  FileText,
  ListChecks,
  Megaphone,
  Save,
} from "lucide-react";
import { useAppState } from "@/provider/AppProvider";
import { DataTable } from "../data-table-container";
import { ContainerItemForm } from "./ContainerItemForm";
import CargoDetailNonKontainer from "./CargoDetailNonKontainer";
import UploadAndDownload from "../UploadAndDownload";
import usePostContainerDetail from "@/hooks/usePostContainerDetail";
import usePostCargoVinDetail from "@/hooks/usePostCargoVinDetail";
import { CreateColumnsContainer } from "../Column-Container";
import { useIsDetailPage } from "@/hooks/useIsDetailPage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CargoDetail = () => {
  const context = useAppState();
  const isContainer = context.isContainer;
  const createContainerDetail = usePostContainerDetail();
  const createCargoVinDetail = usePostCargoVinDetail();
  const isDetailPage = useIsDetailPage();

  function hasDuplicates(array: string[]) {
    return new Set(array).size !== array.length;
  }

  const handleSave = async () => {
    if (isContainer) {
      const listConNumber = context.containerItems.map((item) => item.containerNumber);
      if (hasDuplicates(listConNumber)) {
        toast.error("Container numbers are not allowed to be duplicated!");
        return;
      }
      const payloadData = context.containerItems.map((item: any) => ({
        Id: item.Id,
        containerNo: item.containerNumber,
        grossWeight: {
          amount: +item.grossWeight,
          unit: item.unit,
        },
        ownership: item.ownership,
        sealNo: item.sealNumber,
        sizeType: {
          kodeSize: item.sizeAndType,
        },
        depoDetail: {
          depoName: item.depoName ? item.depoName : "",
          depoNpwp: item.depoNpwp ? item.depoNpwp : "",
          noTelp: item.noTelp ? item.noTelp : "",
          alamat: item.alamat ? item.alamat : "",
          kotaDepo: item.kotaDepo ? item.kotaDepo : "",
          kodePos: item.kodePos ? item.kodePos : "",
        },
      }));
      await createContainerDetail.mutateAsync({
        id: context.containerIdActive,
        payload: payloadData,
        status: context.isShippingLineProcessing ? "Processed" : "Draft",
      });
    } else {
      const payloadData = {
        nonContainer: context.cargoItems.map((item: any) => ({
          Id: item.Id,
          grossWeight: {
            amount: +item.grossQuantity,
            unit: item.grossSatuan,
          },
          measurementVolume: {
            amount: +item.measurementQuantity,
            unit: item.measurementSatuan,
          },
          packageQuantity: {
            amount: +item.packageQuantity,
            unit: item.packageSatuan,
          },
          goodsDescription: item.descriptionOfGoods,
        })),
        vinDetail: {
          ladingBillNumber: context.requestDetailForm?.ladingBillNumber,
          vinData: context.vinItems.map((vin: any) => ({
            Id: vin.Id,
            vinNumber: vin.vinNumber,
          })),
        },
      };
      createCargoVinDetail.mutateAsync({
        id: context.containerIdActive,
        payload: payloadData,
      });
    }
  };

  const handlePrev = () => {
    context.handlePrevForm();
  };

  const handleNext = () => {
    if (isContainer) {
      const listConNumber = context.containerItems.map((item) => item.containerNumber);
      if (hasDuplicates(listConNumber)) {
        toast.error("Container Numbers Are Not Allowed to be Duplicated!");
        return;
      }
      if (context.isShippingLineProcessing) {
        const checkInputDepo = context.containerItems.map((item) => {
          if (!item.depoName || !item.noTelp) {
            toast.error(`Depo data on container number ${item.containerNumber} must be filled!`);
            return false;
          }
          return true;
        });
        if (!checkInputDepo.includes(false)) {
          context.handleNextForm();
        }
      } else {
        context.handleNextForm();
      }
      console.log("Kontainer detail", context.containerItems);
    } else {
      console.log("Cargo detail", context.cargoItems);
      console.log("VIN Detail", context.vinItems);
      context.handleNextForm();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, handler: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  };

  return (
    <>
      <div className="flex justify-center gap-20 py-5 border-b">
        <div
          className={cn(
            "flex flex-col items-center gap-2 cursor-pointer",
            context.formIndex <= 1 ? "text-primary" : "text-muted-foreground"
          )}
          onClick={() => {
            context.handleSpecificForm(0);
          }}
          onKeyDown={(e) => handleKeyDown(e, () => context.handleSpecificForm(0))}
          role="button"
          tabIndex={0}
        >
          <Megaphone width={50} height={50} />
          <p className="text-xs font-medium">Notification Data</p>
        </div>
        <div
          className={cn(
            "flex flex-col items-center gap-2 cursor-pointer",
            context.formIndex == 2 ? "text-primary" : "text-muted-foreground"
          )}
          onClick={() => {
            context.handleSpecificForm(context.containerIdActive ? 2 : 0);
          }}
          onKeyDown={(e) => handleKeyDown(e, () => context.handleSpecificForm(context.containerIdActive ? 2 : 0))}
          role="button"
          tabIndex={0}
        >
          <Container width={50} height={50} />
          <p className="text-xs font-medium">
            {context.isContainer ? "Container" : "Non Container"} Data
          </p>
        </div>
        <div
          className={cn(
            "flex flex-col items-center gap-2 cursor-pointer",
            context.formIndex == 3 ? "text-primary" : "text-muted-foreground"
          )}
          onClick={() => {
            if (context.isShippingLineProcessing && isContainer) {
              const checkInputDepo = context.containerItems.map((item) => {
                if (!item.depoName || !item.noTelp) {
                  toast.error(`Depo data on container number ${item.containerNumber} must be filled!`);
                  return false;
                }
                return true;
              });
              if (!checkInputDepo.includes(false)) {
                context.handleSpecificForm(context.containerIdActive ? 3 : 0);
              }
            } else {
              context.handleSpecificForm(context.containerIdActive ? 3 : 0);
            }
          }}
          onKeyDown={(e) => handleKeyDown(e, () => context.handleSpecificForm(context.containerIdActive ? 3 : 0))}
          role="button"
          tabIndex={0}
        >
          <FileText width={50} height={50} />
          <p className="text-xs font-medium">Document Data</p>
        </div>
        {!isDetailPage && (
          <div
            className={cn(
              "flex flex-col items-center gap-2 cursor-pointer",
              context.formIndex == 4 ? "text-primary" : "text-muted-foreground"
            )}
            onClick={() => {
              context.handleSpecificForm(context.containerIdActive ? 4 : 0);
            }}
            onKeyDown={(e) => handleKeyDown(e, () => context.handleSpecificForm(context.containerIdActive ? 4 : 0))}
            role="button"
            tabIndex={0}
          >
            <ListChecks width={50} height={50} />
            <p className="text-xs font-medium">Checkpoint</p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {isContainer ? (
          <>
            <h3 className="text-2xl self-start font-semibold border-b inline py-2">
              Container Detail
            </h3>

            {["Draft", "Rejected"].includes(context.statusCurrentDO) &&
              context.userInfo?.roleId == 1 && (
                <div className="flex gap-2 justify-end">
                  <UploadAndDownload type="container" />
                  <ContainerItemForm />
                </div>
              )}
            <DataTable data={context.containerItems} columns={CreateColumnsContainer()} />
          </>
        ) : (
          <CargoDetailNonKontainer />
        )}
        <div className="col-span-12 flex justify-between">
          <Button className="flex gap-2" onClick={handlePrev}>
            <ChevronLeft /> Back
          </Button>
          <div className="flex gap-4">
            {!isDetailPage && (
              <Button onClick={handleSave} className="flex gap-2" variant={"outline"}>
                Save <Save />
              </Button>
            )}

            <Button onClick={handleNext} className="flex gap-2">
              Next <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CargoDetail;