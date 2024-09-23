import { FileEditIcon } from "lucide-react";
import { Button } from "./ui/button";

const UpdatePengajuanRequestDetail = () => {
  return (
    <Button className="flex gap-2 bg-green-500">
      <FileEditIcon /> Update Pengajuan
    </Button>
  );
};

export default UpdatePengajuanRequestDetail;
