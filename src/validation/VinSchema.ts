import { z } from "zod";

const VinSchema = z.object({
  Id: z.string().optional(),
  vinNumber: z.string().max(50),
});

export default VinSchema;
