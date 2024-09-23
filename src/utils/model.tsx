import { Vin } from "@/components/Column-Vin0";
import { VinDetail } from "@/models/DetailDoResponse";
import { DepoDetail } from "@/models/RequestUpdateDoShippingLine";

interface Requestor {
  requestorType?: string;
  urlFile?: string;
  npwp?: string;
  nib?: string;
  requestorName?: string;
  requestorAddress?: string;
}

interface ShippingLine {
  shippingType?: string;
  doExpired?: string;
  vesselName?: string;
  voyageNumber?: string;
}

interface GrossWeight {
  amount?: number;
  unit?: string;
}

export interface ContainerForm {
  Id: string;
  containerNo?: string;
  sealNo?: string[];
  sizeType: SizeType;
  grossWeight?: GrossWeight;
  ownership?: string;
  depoDetail?: DepoDetail;
}

export interface PaymentSupportingDetail {
  paymentDetail?: {
    invoice?: Invoice[];
  };
  supportingDocument?: {
    documentType?: DocumentType[];
  };
}

interface SizeType {
  size?: number;
  type?: string;
  kodeSize?: string;
}

interface LocationType {
  location?: string;
  countryCode?: string;
  portCode?: string;
  portDetail?: string;
}

export interface Invoice {
  invoiceNo?: string;
  invoiceDate?: string;
  totalAmount?: number;
  bankId?: string;
  currency?: string;
  accountNo?: string;
  urlFile?: string;
}

export interface DocumentType {
  document?: string;
  documentNo?: string;
  documentDate?: string;
  urlFile?: string;
}

export interface RequestPartiesDetail {
  requestDetail?: RequestDetail;
  parties: Parties;
  location: {
    locationType: LocationType[]
  };
}

export interface RequestDetail {
  requestType?: number;
  requestor: Requestor;
  shippingLine: ShippingLine;
  payment?: string;
  document?: {
    ladingBillNumber?: string;
    ladingBillDate?: string;
    ladingBillType?: string;
    urlFile?: string | any;
    bc11Number?: string;
    bc11Date?: string;
    posNumber?: string;
  };

}

export interface Parties {
  shipper: {
    npwp?: string;
    name?: string;
  };
  consignee: {
    npwp?: string;
    name?: string;
  };
  notifyParty: {
    npwp?: string;
    name?: string;
  };
}

export interface CargoDetail {
  container: ContainerForm[];
  nonContainer: NonContainer[];
}

export interface NonContainerVinDetail {
  nonContainer?: NonContainer[];
  vinDetail?: VinDetail;
}

export interface NonContainer {
  Id: string;
  goodsDescription: string;
  packageQuantity: GrossWeight;
  grossWeight: GrossWeight;
  measurementVolume: GrossWeight;
}

export interface Location {
  locationType: LocationType[];
}

export interface PaymentDetail {
  invoice: Invoice[];
}

export interface SupportingDocument {
  documentType: DocumentType[];
}

export interface RequestDOContainerPayload {
  request: {
    requestType?: number;
    requestDetail: RequestDetail;
    parties?: Parties;
    cargoDetail?: CargoDetail;
    vinDetail?: VinDetail;
    location?: Location;
    paymentDetail?: PaymentDetail;
    supportingDocument?: SupportingDocument;
  };
}
