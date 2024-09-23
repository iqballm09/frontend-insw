import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog";
import { useAppState } from "@/provider/AppProvider";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { Button } from "./ui/button";

const DialogNotCompletedNotificationData = () => {
    const context = useAppState()
    const listRequired = context.listRequiredNotificationData;
    const updateRequiredNotificationData = () => {
      const listRequired = []
      if (context.requestDetailForm?.requestorType == "2") {
          listRequired.push(`Request Detail - Surat Kuasa (FF) - ${(!!context.requestDetailForm.urlSuratKuasa && !!context.requestDetailForm.urlFileFF) ? true : false}`)
      }
      if (context.requestDetailForm?.ladingBillType == "1") {
        listRequired.push(`Request Detail - BL file (Original) - ${(!!context.requestDetailForm.urlBlFile && !!context.requestDetailForm.ladingBillFile) ? true : false}`)
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
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="cursor-pointer" onClick={() => updateRequiredNotificationData()} size={"sm"}>Show Detail</Button>
            </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Request and Parties Details are required!</AlertDialogTitle>
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

export default DialogNotCompletedNotificationData;