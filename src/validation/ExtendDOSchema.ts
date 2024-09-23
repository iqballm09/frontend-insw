import { z } from "zod"
import { format } from "date-fns";

const ExtendDoSchema = z.object({
    doExtendDate: z
    .any()
    .refine((data) => data != undefined && !!data, "Required")
    .transform((data) => format(new Date(data), "yyyy-MM-dd")),
}) 

export default ExtendDoSchema;