export type DepoDetail = {
  depoId?: string;
  depoName: string;
  depoNpwp: string;
  noTelp: string;
  alamat: string;
  kotaDepo: string;
  kodePos: string;
}

type CargoDetail = {
  containerNo: string;
  grossWeight: {
    amount: number;
    unit: string;
  };
  ownership: string;
  sealNo: string[];
  sizeType: {
    kodeSize: string;
  };
  depoDetail: DepoDetail;
};

export type RequestUpdateDoShippingLine = {
  request: {
    vesselName?: string;
    voyageNo?: string;
    callSign?: string;
    doReleaseNo?: string;
    doReleaseDate?: string;
    doExpiredDate?: string;
    terminalOp?: string;
    cargoDetail?: CargoDetail[];
    statusNote?: string;
  };
};
