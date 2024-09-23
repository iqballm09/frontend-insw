import { format } from "date-fns";
import { z } from "zod";

const MAX_FILE_SIZE = 10000000;
const ACCEPTED_TYPES = ["application/pdf"];

const SupportItemSchema = z
  .object({
    urlDocument: z.string(),
    documentType: z.string().max(255),
    documentName: z.string(),
    documentNumber: z.string().max(50),
    date: z
      .any()
      .refine((data) => data != undefined, "Required")
      .transform((data) => format(new Date(data), "yyyy-MM-dd")),
    document: z
      .any()
      .refine((files) => files?.name != undefined, "Required")
      .refine(
        (files) => ACCEPTED_TYPES.includes(files?.type),
        "Only pdf files are accepted."
      )
      .refine(
        (files) => files?.size <= MAX_FILE_SIZE,
        `Max file size is 10MB.`
      ),
  });

export default SupportItemSchema;
