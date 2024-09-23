import { useAppState } from "@/provider/AppProvider";
import { CheckCircle2, ChevronLeft, Save, SaveAll, Send, XCircle } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  DocumentType,
  Invoice,
  Parties,
  RequestDOContainerPayload,
  RequestDetail,
} from "@/utils/model";
import { toast } from "sonner";
import usePutDoKontainer from "@/hooks/usePutDoKontainer";
import usePutDoNonKontainer from "@/hooks/usePutDoNonKontainer";
import DialogNotCompletedDocumentDetail from "../DialogNotCompletedDocumentDetail";
import DialogNotCompletedCargoDetail from "../DialogNotCompletedCargoDetail";
import DialogNotCompletedNotificationData from "../DialogNotCompletedNotificationData";
import TimelineForm from "../TimelineForm";

const ReviewForm = () => {
  const context = useAppState();
  const isContainer = context.isContainer;
  const isNotificationDataNotCompleted = !!context.listRequiredNotificationData.length
  const isDocumentNotCompleted =
    (context.requestDetailForm?.paymentType === "1" && context.paymentItems.length <= 0) || context.supportingDocument.length <= 0;
  const updateDoKontainer = usePutDoKontainer();
  const updateDoNonKontainer = usePutDoNonKontainer();
  const [loader, setLoader] = useState(false);
  const [agree, setAgree] = useState(false);

  const updateRequiredNotificationData = () => {
    const listRequired = []
    console.log("request type", context.requestDetailForm?.requestorType === "2")
    console.log("url ff", !!context.requestDetailForm?.urlFileFF)
    console.log("file ff", !!context.requestDetailForm?.urlSuratKuasa)
    if (context.requestDetailForm?.requestorType == "2") {
        listRequired.push(`Request Detail - Surat Kuasa (FF) - ${(!!context.requestDetailForm.urlSuratKuasa && !!context.requestDetailForm.urlFileFF) ? true : false}`)
    }
    listRequired.push(`Request Detail - Request DO Expired - ${!!context.requestDetailForm?.doExpired ? true : false}`);
    listRequired.push(`Request Detail - Payment Method - ${!!context.requestDetailForm?.paymentType ? true : false}`)
    listRequired.push(`Request Detail - Vessel Name - ${!!context.requestDetailForm?.vesselName ? true : false}`)
    listRequired.push(`Request Detail - Voyage Number - ${!!context.requestDetailForm?.voyageNumber ? true : false}`)
    listRequired.push(`Parties Detail - Consignee Name - ${!!context.partiesDetailForm?.consigneeName ? true : false}`)
    listRequired.push(`Parties Detail - Consignee NPWP - ${!!context.partiesDetailForm?.consigneeNpwp ? true : false}`)
    listRequired.push(`Parties Detail - Notify Party Name - ${!!context.partiesDetailForm?.notifyPartyName ? true : false}`)
    listRequired.push(`Parties Detail - Notify Party NPWP - ${!!context.partiesDetailForm?.notifyPartyNpwp ? true : false}`)
    listRequired.push(`Parties Detail - Shipper Name - ${!!context.partiesDetailForm?.shipperName ? true : false}`)
    listRequired.push(`Parties Detail - Place of Loading - ${!!context.partiesDetailForm?.placeOfLoading ? true : false}`);
    listRequired.push(`Parties Detail - Port of Loading - ${!!context.partiesDetailForm?.portOfLoading ? true : false}`);
    listRequired.push(`Parties Detail - Port of Discharge - ${!!context.partiesDetailForm?.portOfDischarge ? true : false}`);
    listRequired.push(`Parties Detail - Port of Destination - ${!!context.partiesDetailForm?.portOfDestination ? true : false}`);
    
    const result = listRequired.filter((item) => item.includes(" - false"));
    context.setListRequiredNotificationData(result)
  }

  const handleLabel = () => {
    setAgree((prev) => !prev);
    console.log(agree)
    console.log(!agree || (isDocumentNotCompleted 
      || isNotificationDataNotCompleted
      || ((!context.isContainer && !context.cargoItems.length &&
           !context.vinItems.length) || (context.isContainer && !context.containerItems.length))))
  }

  const handleDraft = async (type: string) => {
    if (type == "Submitted" && !agree) {
      toast.error("Agree disclaimer is required!");
      return;
    }

    setLoader(true);

    const invoice: Invoice[] = await Promise.all(
      context.paymentItems.map(async (item) => {
        return {
          accountNo: item.accountNumber,
          bankId: item.bank,
          currency: item.currency,
          invoiceDate: item.invoiceDate,
          invoiceNo: item.invoiceNumber,
          totalAmount: +item.totalPayment,
          urlFile: item.urlPayment,
        };
      })
    );

    const documentType: DocumentType[] = await Promise.all(
      context.supportingDocument.map(async (item) => {
        const doc: DocumentType = {
          document: item.documentType,
          documentDate: item.date,
          documentNo: item.documentNumber,
          urlFile: item.urlDocument,
        };
        return doc;
      })
    );

    const requestDetail: RequestDetail = {
      requestor: {
        nib: context.userInfo?.organization.nib,
        npwp: context.userInfo?.organization.npwp,
        requestorAddress: context.userInfo?.organization.address.address,
        requestorName: context.userInfo?.profile.details.full_name,
        requestorType: context.requestDetailForm?.requestorType,
        urlFile: context.requestDetailForm?.urlSuratKuasa,
      },
      shippingLine: {
        doExpired: context.requestDetailForm?.doExpired,
        shippingType: context.requestDetailForm?.shippingType,
        vesselName: context.requestDetailForm?.vesselName,
        voyageNumber: context.requestDetailForm?.voyageNumber,
      },
      document: {
        ladingBillDate: context.requestDetailForm?.ladingBillDate,
        ladingBillNumber: context.requestDetailForm?.ladingBillNumber,
        ladingBillType: context.requestDetailForm?.ladingBillType,
        urlFile: context.requestDetailForm?.urlBlFile,
        bc11Date: context.requestDetailForm?.BcDate,
        bc11Number: context.requestDetailForm?.BcNumber,
        posNumber: context.requestDetailForm?.posNumber,
      },
      payment: context.requestDetailForm?.paymentType,
    };

    const parties: Parties = {
      consignee: {
        name: context.partiesDetailForm?.consigneeName,
        npwp: context.partiesDetailForm?.consigneeNpwp,
      },
      notifyParty: {
        name: context.partiesDetailForm?.notifyPartyName,
        npwp: context.partiesDetailForm?.notifyPartyNpwp,
      },
      shipper: {
        name: context.partiesDetailForm?.shipperName,
        npwp: context.partiesDetailForm?.notifyPartyNpwp, // TODO: ASK
      },
    };

    const DOpayloadRequest: RequestDOContainerPayload = {
      request: {
        requestType: isContainer ? 1 : 2,
        requestDetail,
        parties,
        paymentDetail: {
          invoice,
        },
        cargoDetail: {
          container: context.containerItems.map((item, idx) => ({
            Id: item.Id ? String(item.Id) : "",
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
          })),
          nonContainer: context.cargoItems.map((item, idx) => ({
            Id: item.Id ? String(item.Id) : "",
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
        },
        vinDetail: {
          ladingBillNumber: context.requestDetailForm
            ?.ladingBillNumber as string,
          vinData: context.vinItems.map((item) => ({
            Id: item.Id ? String(item.Id) : "",
            vinNumber: item.vinNumber
          })),
        },
        location: {
          locationType: [
            {
              location: "0",
              countryCode: context.partiesDetailForm?.placeOfLoading,
              portCode: context.partiesDetailForm?.portOfLoadingCode,
              portDetail: context.partiesDetailForm?.portOfLoading,
            },
            {
              location: "1",
              countryCode: context.partiesDetailForm?.placeOfLoading,
              portCode: context.partiesDetailForm?.portOfDischargeCode,
              portDetail: context.partiesDetailForm?.portOfDischarge,
            },
            {
              location: "2",
              countryCode: context.partiesDetailForm?.placeOfLoading,
              portCode: context.partiesDetailForm?.portOfDestinationCode,
              portDetail: context.partiesDetailForm?.portOfDestination,
            },
          ],
        },
        supportingDocument: {
          documentType,
        },
      },
    };

    console.log(DOpayloadRequest);

    if (isContainer) {
      if (context.isEditPage && context.containerIdActive) {
        updateDoKontainer.mutateAsync({
          id: context.containerIdActive,
          payload: DOpayloadRequest,
          status: type,
        });
      } 
    } else {
      if (context.isEditPage && context.containerIdActive) {
        updateDoNonKontainer.mutateAsync({
          id: context.containerIdActive,
          payload: DOpayloadRequest,
          status: type,
        });
      }
    }
    setLoader(false);
  };

  return (
    <>
    {(<TimelineForm/>)}
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl self-start font-semibold border-b inline py-2">
        Checkpoint
      </h3>
      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="col-span-1 flex items-center gap-4">
          {isNotificationDataNotCompleted 
            ? (<XCircle className="text-destructive" />) 
            : (<CheckCircle2 className="text-green-500" />)
          }
          <div className="flex-1 text-lg font-bold">
            Notification Data{" "}
            <span className="block text-lg font-normal">
              {cn(
                isNotificationDataNotCompleted ? "Incomplete" : "Complete"
              )}
            </span>
            {isNotificationDataNotCompleted && (<DialogNotCompletedNotificationData/>)}
          </div>
        </div>
        <div className="col-span-1 flex items-center gap-4">
          {context.containerItems.length <= 0 && isContainer ? (
            <XCircle className="text-destructive" />
          ) : context.cargoItems.length <= 0 && !isContainer ? (
            <XCircle className="text-destructive" />
          ) : context.vinItems.length <= 0 && !isContainer ? 
            (<XCircle className="text-destructive" />) 
            : (<CheckCircle2 className="text-green-500" />
          )}
          <div className="flex-1 text-lg font-bold">
            {context.isContainer ? "Container" : "Non Container"} Data
            <span className="block text-lg font-normal">
              {cn(
                !context.containerItems.length && isContainer
                  ? "Incomplete"
                  : (!context.cargoItems.length || !context.vinItems.length) && !isContainer
                  ? "Incomplete"
                  : "Complete"
              )}
            </span>
            {((!context.containerItems.length && isContainer) 
              || ((!context.cargoItems.length || !context.vinItems.length) && !isContainer)) 
              && (<DialogNotCompletedCargoDetail/>)}
          </div>
        </div>
        <div className="col-span-1 flex items-center gap-4">
          {isDocumentNotCompleted ? (
            <XCircle className="text-destructive" />
          ) : (
            <CheckCircle2 className="text-green-500" />
          )}
          <div className="flex-1 text-lg font-bold">
            {" "}Document Data
            <span className="block text-lg font-normal">
              {isDocumentNotCompleted ? "Incomplete" : "Complete"}
            </span>
            {isDocumentNotCompleted && (<DialogNotCompletedDocumentDetail/>)}
          </div>
        </div>
        <div className="col-span-full mt-6 border rounded-md p-4 flex items-center gap-4">
          <Checkbox onClick={handleLabel} className="text-green-500" />
          <Label className="flex-1 text-2xl font-bold ">
            Disclaimer{" "}
            <span className="block text-lg font-normal">
              Dengan ini saya menyatakan bertanggung jawab atas kebenaran
              hal-hal yang diberitahukan dalam dokumen ini.
            </span>
          </Label>
        </div>
      </div>
      <div className="col-span-12 flex justify-between">
        <Button className="flex gap-2" onClick={context.handlePrevForm}>
          <ChevronLeft /> Back
        </Button>

        <div className="flex gap-4">
          <Button
            onClick={() => handleDraft("Draft")}
            variant={"outline"}
            className="flex gap-2"
            disabled={loader}
          >
            {loader ? (
              "Saving..."
            ) : (
              <>
                Save Draft <SaveAll />
              </>
            )}
          </Button>
          <Button
            onClick={() => handleDraft("Submitted")}
            className={cn("flex gap-2")}
            disabled={!agree || (isDocumentNotCompleted 
                      || isNotificationDataNotCompleted
                      || ((!context.isContainer && !context.cargoItems.length &&
                           !context.vinItems.length) || (context.isContainer && !context.containerItems.length)))
                    }
          >
            Send <Send />
          </Button>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default ReviewForm;
