"use client";
import FormDo from "@/components/FormDo";
import CenteredProgress, { ProgressDemo } from "@/components/ProgressBar";
import useGetBank from "@/hooks/useGetBank";
import useGetDetailDo from "@/hooks/useGetDetailDo";
import useGetDocumentType from "@/hooks/useGetDocumentType";
import { useAppState } from "@/provider/AppProvider";
import { useEffect, useState } from "react";


export default function Page({ params }: { params: { id: string } }) {
  const ctx = useAppState();
  const queryDetailDo = useGetDetailDo(+params.id);
  const queryBank = useGetBank();
  const queryDoc = useGetDocumentType();
  const [assign, setAssign] = useState(false);

  if (queryDetailDo.isLoading || queryBank.isLoading || queryDoc.isLoading) {
    return <CenteredProgress/>;
  }

  if (queryDetailDo.isError) {
    return <>Error when fetching data</>;
  }

  if (
    queryDetailDo.isSuccess &&
    queryBank.isSuccess &&
    queryDoc.isSuccess &&
    !assign
  ) {
    const data = queryDetailDo.data;
    setAssign(true);

    if (data && queryBank.data && queryDoc.data) {
      console.log("assign");
      console.log("edit_page:", ctx.isEditPage);

      ctx.setStatusCurrentDO(data.statusReqdo.name);

      ctx.setIsShippingLineProcessing(
        data.statusReqdo.name == "Processed" && ctx.userInfo?.roleId == 2
      );

      ctx.setRequestDetailForm({
        requestorAlamat: data.requestDetailForm.requestorAlamat,
        requestorName: data.requestDetailForm.requestorName,
        requestorNib: data.requestDetailForm.requestorNib,
        requestorNpwp: data.requestDetailForm.requestorNpwp,
        doExpired: data.requestDetailForm.reqdoExp as string,
        ladingBillDate: data?.requestDetailForm.blDate,
        ladingBillNumber: data?.requestDetailForm.blNumber,
        ladingBillType: String(data?.requestDetailForm.blType),
        paymentType: String(data?.requestDetailForm.metodeBayar),
        requestorType: String(data?.requestDetailForm.requestorType),
        shippingType: data?.requestDetailForm.shippingLine,
        urlBlFile: data?.requestDetailForm.blFile as string,
        vesselName: data?.requestDetailForm.vesselName,
        voyageNumber: data?.requestDetailForm.voyageNumber,
        BcDate: data?.requestDetailForm.bc11Date ?? undefined,
        BcNumber: data?.requestDetailForm.bc11Number,
        ladingBillFile: {
          name: data?.requestDetailForm.blFile?.split("/").pop(),
          type: "application/pdf",
          size: 0,
        },
        posNumber: data?.requestDetailForm.posNumber,
        urlFileFF: {
          name: data?.requestDetailForm.requestorFile
            ? data?.requestDetailForm.requestorFile?.split("/").pop()
            : null,
          type: "application/pdf",
          size: 0,
        },
        urlSuratKuasa: data?.requestDetailForm.requestorFile ?? undefined,
        callSign: data.requestDetailForm.callSign,
        doExpiredDate: data.requestDetailForm.doExp,
        doReleaseNo: data.requestDetailForm.doReleaseNumber,
        doReleaseDate: data.requestDetailForm.doReleaseDate,
        terminalOperator: data.requestDetailForm.terminalOp,
      });

      const {
        portLoading: portOfLoading,
        placeLoading: placeOfLoading,
        placeDestination: portOfDestination,
        placeDischarge: portOfDischarge,
      } = data.partiesDetailForm;

      ctx.setPartiesDetailForm({
        placeOfLoading,
        portOfLoading,
        portOfLoadingCode: portOfLoading,
        portOfDestination,
        portOfDestinationCode: portOfDestination,
        portOfDischarge,
        portOfDischargeCode: portOfDischarge,
        consigneeName: !!data.partiesDetailForm.consigneeName ? data.partiesDetailForm.consigneeName : undefined,
        consigneeNpwp: !!data.partiesDetailForm.consigneeNpwp ? data.partiesDetailForm.consigneeNpwp : undefined,
        shipperName: !!data.partiesDetailForm.shipperName ? data.partiesDetailForm.shipperName : undefined,
        notifyPartyName: !!data.partiesDetailForm.notifyPartyName ? data.partiesDetailForm.notifyPartyName : undefined,
        notifyPartyNpwp: !!data.partiesDetailForm.notifyPartyNpwp ? data.partiesDetailForm.notifyPartyNpwp : undefined
      });

      ctx.setContainerItems([
        ...data.containerDetailForm.map((val) => ({
          Id: String(val.Id),
          containerNumber: val.containerNumber,
          grossWeight: String(val.grossWeightAmount),
          kd_size: val.sizeType,
          ownership: String(val.ownership),
          sealNumber: val.containerSeal,
          size: 0,
          sizeAndType: val.sizeType,
          unit: val.grossWeightUnit,
          depoId: String(val.depoForm.Id),
          depoName: val.depoForm.nama,
          depoNpwp: val.depoForm.npwp,
          noTelp: val.depoForm.noTelp,
          alamat: val.depoForm.alamat,
          kotaDepo: val.depoForm.kota,
          kodePos: val.depoForm.kodePos,
        })),
      ]);

      ctx.setPaymentItems([
        ...data.paymentDetailForm.map((item) => ({
          accountNumber: item.accountNumber,
          bank: String(item.bank),
          bankName: queryBank.data.find((bank: any) => bank.kode == item.bank)
            .uraian,
          currency: item.currency,
          invoiceDate: item.invoiceDate,
          invoiceNumber: item.invoiceNumber,
          paymentReceipt: {
            name: item.urlFile.split("/").pop(),
            type: "application/pdf",
            size: 0,
          },
          totalPayment: String(item.totalPayment),
          urlPayment: item.urlFile,
        })),
      ]);

      ctx.setSupportingDocument([
        ...data.supportingDocumentForm.map((item) => ({
          date: item.documentDate,
          document: {
            name: item.urlFile.split("/").pop(),
            type: "application/pdf",
            size: 0,
          },
          documentName: queryDoc.data.find(
            (doc: any) => doc.kode == item.documentType
          ).uraian,
          documentNumber: item.documentNumber,
          documentType: String(item.documentType),
          urlDocument: item.urlFile,
        })),
      ]);

      ctx.setCargoItems([
        ...data.nonContainerDetailForm.map((item) => ({
          Id: String(item.Id),
          descriptionOfGoods: item.goodsDescription,
          grossQuantity: String(item.grossWeightAmount),
          grossSatuan: item.grossWeightUnit,
          measurementQuantity: String(item.measurementVolume),
          measurementSatuan: item.measurementUnit,
          packageQuantity: String(item.packageQuantityAmount),
          packageSatuan: item.packageQuantityUnit,
        })),
      ]);

      ctx.setVinItems([
        ...data.vinDetailForm.vinData.map((val) => ({
          Id: String(val.Id), 
          vinNumber: val.vinNumber,
        })),
      ]);
    }
  }

  return (
    <div className="my-4">
      <div className="flex justify-between items-center text-4xl font-bold border-b pb-4">
        <h1>
          Detail DO | {!ctx.isContainer ? "Non Container" : "Container"}
        </h1>
      </div>
      {ctx.requestDetailForm && <FormDo />}
    </div>
  );
}
