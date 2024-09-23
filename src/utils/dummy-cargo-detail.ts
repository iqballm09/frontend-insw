import { Vin } from "@/components/Column-Vin0";

export type Container = {
  Id?: string;
  containerNumber: string;
  sealNumber: string[];
  sizeAndType: string;
  grossWeight: string;
  unit: string;
  ownership: string;
  depoName?: string;
  depoNpwp?: string;
  noTelp?: string;
  alamat?: string;
  kotaDepo?: string;
  kodePos?: string;
};

export type Cargo = {
  Id?: string;
  descriptionOfGoods: string;
  packageQuantity: string;
  packageSatuan: string;
  grossQuantity: string;
  grossSatuan: string;
  measurementQuantity: string;
  measurementSatuan: string;
};

