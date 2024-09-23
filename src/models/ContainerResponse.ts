type GrossWeight = {
  amount: number;
  unit: string;
};

type SizeType = {
  kodeSize: string;
};

export type ContainerDataTemplateResponse = {
  Id?: number;
  containerNo: string;
  grossWeight: GrossWeight;
  sealNo: string[];
  ownership: string;
  sizeType: SizeType;
};
