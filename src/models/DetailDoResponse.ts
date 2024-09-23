interface RequestDetailForm {
  requestorName: string;
  requestorNpwp: string;
  requestorNib: string;
  requestorAlamat: string;
  requestorType: number;
  requestorFile: string | null;
  shippingLine: string;
  vesselName: string;
  voyageNumber: string;
  blNumber: string;
  blDate: string;
  blType: number;
  blFile: string | null;
  bc11Date: string | null;
  bc11Number: string;
  posNumber: string;
  reqdoExp: string;
  metodeBayar: number;
  callSign?: string;
  doReleaseDate?: string;
  doReleaseNumber?: string;
  doExp?: string;
  terminalOp?: string;
}

interface PartiesDetailForm {
  shipperName: string;
  consigneeName: string;
  consigneeNpwp: string;
  notifyPartyName: string;
  notifyPartyNpwp: string;
  placeLoading: string;
  portLoading: string;
  placeDischarge: string;
  placeDestination: string;
}

interface depoForm {
  Id: string;
  nama: string;
  npwp: string;
  alamat: string;
  noTelp: string;
  kota: string;
  kodePos: string;
}

interface ContainerDetailForm {
  Id?: number;
  containerNumber: string;
  containerSeal: string[];
  sizeType: string;
  grossWeightAmount: number;
  grossWeightUnit: string;
  ownership: number;
  depoForm: depoForm;
}

interface PaymentDetailForm {
  invoiceNumber: string;
  invoiceDate: string;
  currency: string;
  totalPayment: number;
  bank: number;
  accountNumber: string;
  urlFile: string;
}

interface SupportingDocumentForm {
  documentType: number;
  documentNumber: string;
  documentDate: string;
  urlFile: string;
}

interface NonContainerDetail {
  Id?: number;
  goodsDescription: string;
  packageQuantityAmount: number;
  packageQuantityUnit: string;
  grossWeightAmount: number;
  grossWeightUnit: string;
  measurementVolume: number;
  measurementUnit: string;
}

export interface VinDetail {
  ladingBillNumber?: string;
  vinData: {
    Id: string;
    vinNumber: string;
  }[];
}

interface StatusReqDo {
  name: string;
  datetime: string;
}

export interface DetailDoResponse {
  requestDetailForm: RequestDetailForm;
  partiesDetailForm: PartiesDetailForm;
  containerDetailForm: ContainerDetailForm[];
  nonContainerDetailForm: NonContainerDetail[];
  vinDetailForm: VinDetail;
  paymentDetailForm: PaymentDetailForm[];
  supportingDocumentForm: SupportingDocumentForm[];
  statusReqdo: StatusReqDo;
}
