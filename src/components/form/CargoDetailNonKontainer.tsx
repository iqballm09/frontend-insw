import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DataTable } from "../data-table-container";
import { CreateColumnsCargo } from "../Column-Cargo";
import { useAppState } from "@/provider/AppProvider";
import { CargoItemForm } from "./CargoItemForm";
import { VinItemForm } from "./VinItemForm";
import UploadAndDownload from "../UploadAndDownload";
import { CreateColumnsVin } from "../Column-Vin";

const CargoDetailNonKontainer = () => {
  const context = useAppState();

  const handleTabCargoChange = () => {
    context.setIsCargoPage(true);
    console.log("tab", context.isCargoPage)
  }

  const handleTabVinChange = () => {
    context.setIsCargoPage(false);
    console.log("tab", context.isCargoPage)
  }

  useEffect(() => {
    console.log(context.statusCurrentDO);
  }, [context.statusCurrentDO]);
  return (
    <Tabs defaultValue="cargo" className="mt-2">
      <TabsList>
        <TabsTrigger onClick={handleTabCargoChange} value="cargo">Cargo Detail</TabsTrigger>
        <TabsTrigger onClick={handleTabVinChange} value="vin">VIN</TabsTrigger>
      </TabsList>
      <TabsContent value="cargo" className="space-y-6">
        <div className="flex justify-between">
          <h3 className="text-2xl self-start font-semibold border-b inline py-2">
            Cargo Detail
          </h3>
          <div className="flex gap-2">
            {["Draft", "Rejected"].includes(context.statusCurrentDO) &&
              context.userInfo?.roleId == 1 && (
                <UploadAndDownload type="cargo" />
              )}
            <CargoItemForm />
          </div>
        </div>
        <DataTable data={context.cargoItems} columns={CreateColumnsCargo()} />
      </TabsContent>
      <TabsContent value="vin" className="space-y-6">
        <div className="flex justify-between">
          <h3 className="text-2xl self-start font-semibold border-b inline py-2">
            VIN
          </h3>
          <div className="flex gap-2">
            {["Draft", "Rejected"].includes(context.statusCurrentDO) &&
              context.userInfo?.roleId == 1 && <UploadAndDownload type="vin" />}
            <VinItemForm />
          </div>
        </div>
        <DataTable data={context.vinItems} columns={CreateColumnsVin()} />
      </TabsContent>
    </Tabs>
  );
};

export default CargoDetailNonKontainer;