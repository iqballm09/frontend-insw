import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog";
import { useAppState } from "@/provider/AppProvider";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { Button } from "./ui/button";

const DialogNotCompletedDocumentDetail = () => {
    const listRequired = []
    const context = useAppState()
    const isContainer = context.isContainer;
    const isCocExist = context.containerItems.find(
        (val) => val.ownership == "Carrier Owned Container"
    );
    const isSocExist = context.containerItems.find(
        (val) => val.ownership == "Shipper Owned Container"
    );
    const isSpkExist = context.supportingDocument.find(
        (val) => val.documentType == "0500005"
    );
    const isVinExist = context.supportingDocument.find(
        (val) => val.documentType == "0500010"
    );
    const isLoiExist = context.supportingDocument.find(
        (val) => val.documentType == "0500004"
    );

    const isInvoiceExist = context.supportingDocument.find(
      (val) => val.documentType == "0400380"
    );

    if (context.requestDetailForm?.paymentType === "1" && !context.paymentItems.length) {
        listRequired.push("Payment Detail - Payment Document");
    }

    if (isContainer) {
        if (isCocExist && !(!!isSpkExist)) {
            listRequired.push("Supporting Document - Surat Peminjaman Kontainer (SPK)")
        }
        if (isSocExist && !(!!isLoiExist)) {
            listRequired.push("Supporting Document - Letter of Indemnity (LOI)")
        }
      } else {
        if (!(!!isVinExist)) {
          listRequired.push("Supporting Document - Dokumen VIN")
        }
      }

    if (context.requestDetailForm?.paymentType === "2" && !(!!isInvoiceExist)) {
      listRequired.push("Supporting Document - Invoice");
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="cursor-pointer" size={"sm"}>Show Detail</Button>
            </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Document Details are required!</AlertDialogTitle>
              <AlertDialogDescription>
                {listRequired.map((item, index) => (
                    <p key={index}><a style={{ fontWeight: 'bold' }}>{item.split(" - ")[0]}</a> : {item.split(" - ")[1]}</p>
                ))}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogAction>Back</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
}

export default DialogNotCompletedDocumentDetail;