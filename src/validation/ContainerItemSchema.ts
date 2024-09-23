import { z } from "zod";

const ContainerItemSchema = z.object({
  Id: z.string().optional(),
  containerNumber: z.string().max(20),
  sealNumber: z.array(z.string().max(255)),
  sizeAndType: z.string(),
  grossWeight: z.string().max(255),
  unit: z.string().max(255),
  ownership: z.string().max(255),
  depoName: z.string().max(255).optional(),
  depoNpwp: z.string().optional(),
  noTelp: z.string().max(20).optional(),
  alamat: z.string().max(255).optional(),
  kotaDepo: z.string().max(255).optional(),
  kodePos: z.string().max(5).optional(),
});

export const ContainerItemSchemaForSl = z.object({
  Id: z.string().optional(),
  containerNumber: z.string().max(20),
  sealNumber: z.array(z.string().max(255)),
  sizeAndType: z.string(),
  grossWeight: z.string().max(255),
  unit: z.string().max(255),
  ownership: z.string().max(255),
  depoName: z.string().max(255),
  depoNpwp: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) =>
        val === null ||
        val === undefined ||
        val === "" ||
        (val.length >= 15 && val.length <= 16),
      {
        message: "NPWP must be between 15 and 16 digits",
      }
    ),
  noTelp: z.string().max(20),
  alamat: z.string().max(255).optional(),
  kotaDepo: z.string().max(255).optional(),
  kodePos: z.string().max(5).optional(),
});

export default ContainerItemSchema;
