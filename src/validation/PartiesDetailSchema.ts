import { z } from "zod";

const PartiesDetailSchema = z.object({
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
});

export type PartiesDetailForm = z.infer<typeof PartiesDetailSchema>;

export default PartiesDetailSchema;
