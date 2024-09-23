import ButtonAddNewDOReq from "@/components/ButtonAddNewDOReq";
import ListDO from "@/components/ListDO";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;

  return (
    <>
      <div className="flex justify-between items-center text-4xl font-bold border-b pb-4 mb-4">
        <h1>Delivery Order</h1>
        <ButtonAddNewDOReq />
      </div>
      <ListDO token={token as string} />
    </>
  );
}
