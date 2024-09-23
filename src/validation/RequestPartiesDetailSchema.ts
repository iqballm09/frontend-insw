import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { z } from "zod";

const MAX_FILE_SIZE = 25000000;
const ACCEPTED_TYPES = ["application/pdf"];

const fileValidator = () =>
  z
    .any()
    .refine((files) => files?.name != undefined, "Required")
    .refine(
      (files) => ACCEPTED_TYPES.includes(files?.type),
      "Only pdf files are accepted."
    )
    .refine((files) => files?.size <= MAX_FILE_SIZE, `Max file size is 25MB.`)
    .optional();

const RequestPartiesDetailSchema = z
  .object({
    requestorType: z.string().max(1).optional(),
    urlFileFF: fileValidator(),
    urlSuratKuasa: z.string().optional(),
    shippingType: z.string(),
    voyageNumber: z
      .string()
      .max(10, "Must contain at most 255 character(s)")
      .optional(),
    vesselName: z
      .string()
      .max(255, "Must contain at most 255 character(s)")
      .optional(),
    urlBlFile: z.string().optional(),
    ladingBillNumber: z
      .string()
      .max(50, "Must contain at most 50 character(s)"),
    ladingBillDate: z
      .any()
      .refine((data) => data != undefined, "Required")
      .transform((data) => format(new Date(data), "yyyy-MM-dd")),
    ladingBillType: z.string().max(1),
    ladingBillFile: z
      .any()
      .refine((files) => files?.name != undefined, "Required")
      .refine(
        (files) => ACCEPTED_TYPES.includes(files?.type),
        "Only pdf files are accepted."
      )
      .refine((files) => files?.size <= MAX_FILE_SIZE, `Max file size is 25MB.`)
      .optional(),
    BcNumber: z
      .string()
      .max(50, "Must contain at most 50 character(s)")
      .optional(),
    BcDate: z
      .any()
      .refine((data) => data != undefined, "Required")
      .transform((data) => format(new Date(data), "yyyy-MM-dd"))
      .optional(),
    posNumber: z.string().max(5, "Must contain at most 5 digit(s)").optional(),
    doExpired: z
      .any()
      .refine((data) => data != undefined, "Required")
      .transform((data) => format(new Date(data), "yyyy-MM-dd"))
      .optional(),
    paymentType: z.string().max(1).optional(),
    requestorName: z.string().optional(),
    requestorNpwp: z.string().optional(),
    requestorNib: z.string().optional(),
    requestorAlamat: z.string().optional(),
    callSign: z
      .string()
      .max(10, "Must contain at most 10 character(s)")
      .optional(),
    doReleaseNo: z
      .string()
      .max(50, "Must contain at most 50 character(s)")
      .optional(),
    doReleaseDate: z
      .any()
      .transform((data) => format(new Date(data), "yyyy-MM-dd"))
      .optional(),
    doExpiredDate: z
      .any()
      .transform((data) => format(new Date(data), "yyyy-MM-dd"))
      .optional(),
    terminalOperator: z.string().optional(),
    shipperName: z.string().max(255).optional(),
    consigneeName: z.string().max(255).optional(),
    consigneeNpwp: z
      .string()
      .min(15, "Must contain at least 15 digit(s)")
      .max(16, "Must contain at most 16 digit(s)")
      .optional(),
    notifyPartyName: z.string().max(255).optional(),
    notifyPartyNpwp: z
      .string()
      .min(15, "Must contain at least 15 digit(s)")
      .max(16, "Must contain at most 16 digit(s)")
      .optional(),
    placeOfLoading: z.string().optional(),
    portOfLoading: z.string().optional(),
    portOfLoadingCode: z.string().optional(),
    portOfDischarge: z.string().optional(),
    portOfDischargeCode: z.string().optional(),
    portOfDestination: z.string().optional(),
    portOfDestinationCode: z.string().optional(),
  })
  .refine(
    (input) => {
      // Allows urlBlFile to be optional only when ladingBillType is not equal to "1"
      if (
        input.ladingBillType.trim() === "1" &&
        input.urlBlFile === undefined &&
        input.ladingBillFile === undefined
      )
        return false;
      return true;
    },
    {
      message: "BL Document is required for BL Type 'original'",
      path: ["ladingBillFile"],
    }
  )
  .refine(
    (input) => {
      // allows urlFIleFF to be optional only when requestorType is '1'
      if (
        input.requestorType !== "1" &&
        input.urlFileFF === undefined &&
        input.urlSuratKuasa === undefined
      )
        return false;
      return true;
    },
    {
      message:
        "This field is required when Requestor Type is Freight Forwarder",
      path: ["urlFileFF"],
    }
  );

export type RequestPartiesDetailForm = z.infer<
  typeof RequestPartiesDetailSchema
>;

export default RequestPartiesDetailSchema;
