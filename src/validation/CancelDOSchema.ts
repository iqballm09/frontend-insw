import { z } from "zod";

const CancelDOSchema = z.object({
  note: z.string().max(255),
});

export default CancelDOSchema;
