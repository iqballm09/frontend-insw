import axios from "axios";
import { toast } from "sonner";
import {
  ContainerForm,
  NonContainerVinDetail,
  PaymentSupportingDetail,
  RequestDOContainerPayload,
  RequestDetail,
  RequestPartiesDetail,
} from "./model";
import { cookies } from "next/headers";
import { DetailDoResponse } from "@/models/DetailDoResponse";
import { RequestUpdateDoShippingLine } from "@/models/RequestUpdateDoShippingLine";
import process from "process";
import autoprefixer from "autoprefixer";
import moment from "moment";

const BASE_URL = process.env.NEXT_PUBLIC_API_URI;

function getToken() {
  return localStorage.getItem("access_token");
}

export function setToken(token: string) {
  localStorage.setItem("access_token", token);
}

export const authConfig = (token?: string) => ({
  headers: {
    Authorization: `Bearer ${token ?? getToken()}`,
  },
});

export async function validateToken(token: string) {
  try {
    const { data } = await axios.get(`http://api:5000/auth`, authConfig(token));
    return data;
  } catch (error) {
    console.log({ error });
    return false;
  }
}

export async function getListDo() {
  try {
    const { data } = await axios.get(`${BASE_URL}/do`, authConfig());
    return data;
  } catch (error) {
    console.log({ error });
  }
}

export async function slUpdateDo(payload: {
  id: number;
  status: "Released" | "Rejected";
  do: RequestUpdateDoShippingLine;
}) {
  try {
    const { data } = await axios.put(
      `${BASE_URL}/do/shipping-line/${payload.id}?status=${payload.status}`,
      payload.do,
      authConfig()
    );
    return data;
  } catch (error) {
    console.log({ error });
  }
}
export async function slProcessDo(id: number) {
  try {
    const { data } = await axios.put(
      `${BASE_URL}/do/shipping-line/status/${id}`,
      {},
      authConfig()
    );
    return data;
  } catch (error) {
    console.log({ error });
  }
}

export async function getShippingLine(keyword: string) {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/shippingline/search?keyword=${keyword}`,
      authConfig()
    );
    return data.data;
  } catch (error) {
    console.log({ error });
  }
}

export async function getShippingLineAll() {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/shippingline/search/all`,
      authConfig()
    );
    return data.data;
  } catch (error) {
    console.log({ error });
  }
}

export async function getKabKota() {
  try {
    const { data } = await axios.get(`${BASE_URL}/kabkota`, authConfig());
    return data;
  } catch (error) {
    console.log({ error });
  }
}
export async function getBlType() {
  try {
    const { data } = await axios.get(`${BASE_URL}/flag/jenis-bl`, authConfig());
    return data.data;
  } catch (error) {
    console.log({ error });
  }
}
export async function getSizeAndType() {
  try {
    const { data } = await axios.get(`${BASE_URL}/size-typecode`, authConfig());
    return data.data;
  } catch (error) {
    console.log({ error });
  }
}
export async function getGrossWeightUnit() {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/flag/gross-weight`,
      authConfig()
    );
    return data.data;
  } catch (error) {
    console.log({ error });
  }
}
export async function getMeasurementUnit() {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/flag/measurement`,
      authConfig()
    );
    return data.data;
  } catch (error) {
    console.log({ error });
  }
}
export async function getOwnership() {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/flag/ownership`,
      authConfig()
    );
    return data.data;
  } catch (error) {
    console.log({ error });
  }
}
export async function getTermOfPayment() {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/flag/metode-bayar`,
      authConfig()
    );
    return data.data;
  } catch (error) {
    console.log({ error });
  }
}
export async function getTerminalOperator() {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/terminal-operator`,
      authConfig()
    );
    return data.data;
  } catch (error) {
    console.log({ error });
  }
}

export async function getCurrency() {
  try {
    const { data } = await axios.get(`${BASE_URL}/kurs`, authConfig());
    return data.data;
  } catch (error) {
    console.log({ error });
  }
}

export async function getBank() {
  try {
    const { data } = await axios.get(`${BASE_URL}/bank`, authConfig());
    return data.data;
  } catch (error) {
    console.log({ error });
  }
}
export async function getDocumentType() {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/supporting-document`,
      authConfig()
    );
    return data.data;
  } catch (error) {
    console.log({ error });
  }
}

export async function getCountry() {
  try {
    const { data } = await axios.get(`${BASE_URL}/negara`, authConfig());
    return data.data;
  } catch (error) {
    console.log({ error });
  }
}
export async function getPort({
  kodeNegara,
  keyword = "",
}: {
  kodeNegara: string;
  keyword: string;
}) {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/pelabuhan?kodeNegara=${kodeNegara}&keyword=${keyword}`,
      authConfig()
    );
    return data.data;
  } catch (error) {
    console.log({ error });
  }
}
export async function getPackageUnit() {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/flag/package-unit`,
      authConfig()
    );
    return data.data;
  } catch (error) {
    console.log({ error });
  }
}

export async function getDetailDO(id: number) {
  try {
    const { data } = await axios.get(`${BASE_URL}/do/${id}`, authConfig());
    return data as DetailDoResponse;
  } catch (error) {
    console.log({ error });
  }
}
export async function getStatuDo(id: number) {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/do/status-reqdo/${id}`,
      authConfig()
    );
    return data.data.sort((a: any, b: any) =>
      moment(a.datetime, "DD-MM-YYYY HH:mm:ss").diff(
        moment(b.datetime, "DD-MM-YYYY HH:mm:ss")
      )
    );
  } catch (error) {
    console.log({ error });
  }
}

export async function deleteDo(id: number) {
  try {
    const { data } = await axios.delete(`${BASE_URL}/do/${id}`, authConfig());
    return data;
  } catch (error) {
    console.log({ error });
  }
}

export async function createDoKontainer({
  payload,
  status,
}: {
  payload: RequestDOContainerPayload;
  status: string;
}) {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/do/kontainer?status=${status}`,
      payload,
      authConfig()
    );
    return data.data;
  } catch (error) {
    console.log({ error });
  }
}

export async function updateDoKontainer({
  id,
  payload,
  status,
}: {
  id: number;
  payload: RequestDOContainerPayload;
  status: string;
}) {
  try {
    const { data } = await axios.put(
      `${BASE_URL}/do/kontainer/${id}?status=${status}`,
      payload,
      authConfig()
    );
    return data.data;
  } catch (error) {
    console.log({ error });
  }
}

export async function updateDoNonKontainer({
  id,
  payload,
  status,
}: {
  id: number;
  payload: RequestDOContainerPayload;
  status: string;
}) {
  try {
    const { data } = await axios.put(
      `${BASE_URL}/do/non-kontainer/${id}?status=${status}`,
      payload,
      authConfig()
    );
    return data.data;
  } catch (error) {
    console.log({ error });
  }
}

export async function printDo(id: number) {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/do/print/${id}`,
      authConfig()
    );
    return data.urlFile;
  } catch (error) {
    console.log({ error });
  }
}

export async function createDoNonKontainer({
  payload,
  status,
}: {
  payload: RequestDOContainerPayload;
  status: string;
}) {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/do/non-kontainer?status=${status}`,
      payload,
      authConfig()
    );
    return data.data;
  } catch (error) {
    console.log({ error });
  }
}

export type FileType =
  | "billing"
  | "requestor"
  | "document"
  | "payment"
  | "container"
  | "cargo"
  | "vin";

export async function uploadFile(file: File, type: FileType) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const { data } = await axios.post(
      `${BASE_URL}/files/upload?type=${type}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return data;
  } catch (error) {
    console.log({ error });
  }
}

export async function discardFile(
  name: string,
  type: "billing" | "requestor" | "document" | "payment"
) {
  try {
    const { data } = await axios.delete(
      `${BASE_URL}/files/${name}?type=${type}`,
      authConfig()
    );

    return data;
  } catch (error) {
    console.log({ error });
  }
}

export async function signUp({
  username,
  password,
  token,
}: {
  username: string;
  password: string;
  token: string;
}) {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/auth/signup?token=${token}`,
      {
        name: username,
        hash: password,
      }
    );

    return data;
  } catch (error) {
    console.log({ error });
  }
}

export async function createRequestDetail({
  payload,
}: {
  payload: RequestDetail;
}) {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/do/forms/request-detail`,
      payload,
      authConfig()
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getRequestDetail(id: number) {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/do/forms/request-detail/${id}`,
      authConfig()
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function updateRequestDetail({
  id,
  payload,
  status,
}: {
  id: number;
  payload: RequestDetail;
  status: string;
}) {
  try {
    const { data } = await axios.put(
      `${BASE_URL}/do/forms/request-detail/${id}?status=${status}`,
      payload,
      authConfig()
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function createRequestPartiesDetail({
  id,
  payload,
}: {
  id: number;
  payload: RequestPartiesDetail;
}) {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/do/forms/parties-detail/${id}`,
      payload,
      authConfig()
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getRequestPartiesDetail(id: number) {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/do/forms/parties-detail/${id}`,
      authConfig()
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function createContainerDetail({
  id,
  payload,
  status,
}: {
  id: number;
  payload: ContainerForm[];
  status: string;
}) {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/do/forms/kontainer-detail/${id}?status=${status}`,
      payload,
      authConfig()
    );
    return data.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getContainerDetail(id: number) {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/do/forms/kontainer-detail/${id}`,
      authConfig()
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteContainerDetail(id: number) {
  try {
    const { data } = await axios.delete(
      `${BASE_URL}/do/forms/kontainer-detail/${id}`,
      authConfig()
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function createPaymentDocumentDetail({
  id,
  payload,
}: {
  id: number;
  payload: PaymentSupportingDetail;
}) {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/do/forms/payment-document/${id}`,
      payload,
      authConfig()
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getPaymentDocumentDetail(id: number) {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/do/forms/payment-document/${id}`,
      authConfig()
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function createCargoVinDetail({
  id,
  payload,
}: {
  id: number;
  payload: NonContainerVinDetail;
}) {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/do/forms/cargovin-detail/${id}`,
      payload,
      authConfig()
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getCargoVinDetail(id: number) {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/do/forms/cargovin-detail/${id}`,
      authConfig()
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function cancelDO({ id, note }: { id: number; note: string }) {
  const payload = {
    note: note,
  };
  try {
    const { data } = await axios.post(
      `${BASE_URL}/do/cancel/${id}`,
      payload,
      authConfig()
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function extendDO({
  id,
  doExtendDate,
}: {
  id: number;
  doExtendDate: string;
}) {
  const payload = {
    doExpiredDate: doExtendDate,
  };
  try {
    const { data } = await axios.post(
      `${BASE_URL}/do/extend/${id}`,
      payload,
      authConfig()
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}
