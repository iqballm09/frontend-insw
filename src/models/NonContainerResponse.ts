type GrossWeight = {
  amount: number;
  unit: string;
};

type MeasurementVolume = {
  amount: number;
  unit: string;
};

type PackageQuantity = {
  amount: number;
  unit: string;
};

export type NonContainerDataTemplateResponse = {
  grossWeight: GrossWeight;
  measurementVolume: MeasurementVolume;
  packageQuantity: PackageQuantity;
  goodsDescription: string;
};
