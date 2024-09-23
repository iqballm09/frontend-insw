import { z } from "zod";

const CargoDetailSchema = z.object({
  Id: z.string().optional(),
  descriptionOfGoods: z.string(),
  packageQuantity: z.string(),
  packageSatuan: z.string(),
  grossQuantity: z.string(),
  grossSatuan: z.string(),
  measurementQuantity: z.string(),
  measurementSatuan: z.string(),
});

export default CargoDetailSchema;
