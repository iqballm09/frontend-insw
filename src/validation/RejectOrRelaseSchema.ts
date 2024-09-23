import { z } from "zod";

const RejectOrReleaseSchema = z.object({
  status: z.string(),
  note: z.string().optional(),
});

export default RejectOrReleaseSchema;
