import { format } from "date-fns";
import { z } from "zod";

const MAX_FILE_SIZE = 10000000;
const ACCEPTED_TYPES = ["application/pdf"];

const PaymentItemSchema = z.object({
  invoiceNumber: z.string().max(255),
  invoiceDate: z
    .any()
    .refine((data) => data != undefined, "Required")
    .transform((data) => format(new Date(data), "yyyy-MM-dd")),
  currency: z.string().max(255),
  totalPayment: z.string().max(255),
  bank: z.string().max(255),
  bankName: z.string(),
  accountNumber: z.string().max(30),
  urlPayment: z.string(),
  paymentReceipt: z
    .any()
    .refine((files) => files?.name != undefined, "Required")
    .refine(
      (files) => ACCEPTED_TYPES.includes(files?.type),
      "Only pdf files are accepted."
    )
    .refine((files) => files?.size <= MAX_FILE_SIZE, `Max file size is 10MB.`),
});

export default PaymentItemSchema;
