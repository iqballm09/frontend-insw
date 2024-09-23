import { z } from "zod";

const SignUpSchema = z
  .object({
    username: z.string().optional(),
    password: z.string().min(6),
    rePassword: z.string(),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export default SignUpSchema;
