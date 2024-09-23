"use client";
import CargoDetail from "@/components/form/CargoDetail";
import DocumentDetail from "@/components/form/DocumentDetail";
import PartiesDetail from "@/components/form/PartiesDetail";
import RequestDetail from "@/components/form/RequestDetail";
import { createContext, useContext, useEffect, useState } from "react";
import { Cargo, Container } from "@/utils/dummy-cargo-detail";
import { Payment } from "@/components/Column-Payment";
import { RequestDetailForm } from "@/validation/RequestDetailSchema";
import { PartiesDetailForm } from "@/validation/PartiesDetailSchema";
import { SupportingDocument } from "@/components/Column-Supporting";
import ReviewForm from "@/components/form/ReviewForm";
import { UserProfileResponse } from "@/models/UserProfileResponse";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { CheckedRows } from "@/components/Column-Container";
import { Vin } from "@/components/Column-Vin0";

const forms = [
  <RequestDetail key={0} />,
  <PartiesDetail key={1} />,
  <CargoDetail key={2} />,
  <DocumentDetail key={3} />,
  <ReviewForm key={4} />,
];

interface RequestDOContainerContextProps {
  userInfo: UserProfileResponse | undefined;
  setUserInfo: React.Dispatch<
    React.SetStateAction<UserProfileResponse | undefined>
  >;
  forms: any;
  formIndex: number;
  containerItems: Container[] | [];
  setContainerItems: React.Dispatch<React.SetStateAction<Container[] | []>>;
  cargoItems: Cargo[] | [];
  setCargoItems: React.Dispatch<React.SetStateAction<Cargo[] | []>>;
  vinItems: Vin[] | [];
  setVinItems: React.Dispatch<React.SetStateAction<Vin[] | []>>;
  paymentItems: Payment[] | [];
  setPaymentItems: React.Dispatch<React.SetStateAction<Payment[] | []>>;
  requestDetailForm: RequestDetailForm | undefined;
  setRequestDetailForm: React.Dispatch<
    React.SetStateAction<RequestDetailForm | undefined>
  >;
  filterStatus: string;
  setFilterStatus: React.Dispatch<React.SetStateAction<string>>;
  partiesDetailForm: PartiesDetailForm | undefined;
  setPartiesDetailForm: React.Dispatch<
    React.SetStateAction<PartiesDetailForm | undefined>
  >;
  supportingDocument: SupportingDocument[] | [];
  setSupportingDocument: React.Dispatch<
    React.SetStateAction<SupportingDocument[] | []>
  >;
  isShippingLineProcessing: boolean;
  setIsShippingLineProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  listRequiredNotificationData: String[];
  setListRequiredNotificationData: React.Dispatch<React.SetStateAction<String[] | []>>;
  isCargoPage: boolean;
  setIsCargoPage: React.Dispatch<React.SetStateAction<boolean>>;
  statusCurrentDO: string;
  listIdContainerItems: CheckedRows;
  setListIdContainerItems: React.Dispatch<React.SetStateAction<CheckedRows | {}>>;
  listIdCargoItems: CheckedRows;
  setListIdCargoItems: React.Dispatch<React.SetStateAction<CheckedRows | {}>>;
  listIdVinItems: CheckedRows;
  setListIdVinItems: React.Dispatch<React.SetStateAction<CheckedRows | {}>>;
  deleteIdContainerItems: (id: string) => void;
  deleteIdCargoItems: (id: string) => void;
  deleteIdVinItems: (id: string) => void;
  selectAllStatus: boolean;
  setSelectAllStatus: React.Dispatch<React.SetStateAction<boolean>>;
  deleteAllStatus: boolean;
  setDeleteAllStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setStatusCurrentDO: React.Dispatch<React.SetStateAction<string>>
  containerIdActive: number;
  isContainer: boolean;
  isEditPage: boolean;
  isCreatePage: boolean;
  isSaved: boolean;
  setIsSave: React.Dispatch<React.SetStateAction<boolean>>;
  handleNextForm: () => void;
  handlePrevForm: () => void;
  handleResetForm: () => void;
  handleResetAllState: () => void;
  handleSpecificForm: (idx: number) => void;
}

export const AppStateContext = createContext<
  RequestDOContainerContextProps | undefined
>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserProfileResponse | undefined>();
  const [selectAllStatus, setSelectAllStatus] = useState(false)
  const [containerItems, setContainerItems] = useState<Container[]>([]);
  const [cargoItems, setCargoItems] = useState<Cargo[]>([]);
  const [vinItems, setVinItems] = useState<Vin[]>([]);
  const [paymentItems, setPaymentItems] = useState<Payment[]>([]);
  const [listIdContainerItems, setListIdContainerItems] = useState<CheckedRows>({});
  const [listIdCargoItems, setListIdCargoItems] = useState<CheckedRows>({});
  const [listIdVinItems, setListIdVinItems] = useState<CheckedRows>({});
  const [filterStatus, setFilterStatus] = useState<string>("All Status");
  const [supportingDocument, setSupportingDocument] = useState<
    SupportingDocument[]
  >([]);
  const [partiesDetailForm, setPartiesDetailForm] =
    useState<PartiesDetailForm>();
  const [requestDetailForm, setRequestDetailForm] =
    useState<RequestDetailForm>();
  const [isSaved, setIsSave] = useState<boolean>(false);
  const [isCargoPage, setIsCargoPage] = useState<boolean>(true);
  const [deleteAllStatus, setDeleteAllStatus] = useState<boolean>(false);
  const [formIndex, setFormIndex] = useState<number>(0);
  const [listRequiredNotificationData, setListRequiredNotificationData] = useState<String[]>([]);
  const [isShippingLineProcessing, setIsShippingLineProcessing] =
    useState<boolean>(false);
  const [statusCurrentDO, setStatusCurrentDO] = useState<string>("Draft");
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();

  const isContainer =
    searchParams.get("type") === "kontainer" || containerItems.length > 0;
  
  const containerIdActive = +params.id;
  
  const deleteIdContainerItems = (id: string) => {
    let updatedList = { ...listIdContainerItems };
    delete updatedList[id];
    setListIdContainerItems(updatedList);
  }

  const deleteIdCargoItems = (id: string) => {
    let updatedList = { ...listIdCargoItems };
    delete updatedList[id];
    setListIdCargoItems(updatedList);
  }

  const deleteIdVinItems = (id: string) => {
    let updatedList = { ...listIdVinItems };
    delete updatedList[id];
    setListIdVinItems(updatedList);
  }

  const isEditPage = usePathname().includes("/edit");
  const isCreatePage = usePathname().includes("/create");

  useEffect(() => {
    console.log({ isShippingLineProcessing });
  }, [isShippingLineProcessing]);

  const handleNextForm = () => {
    if (formIndex >= forms.length - 1) {
      return;
    }

    setFormIndex((prev) => prev + 1);
  };

  const handleSpecificForm = (idx: number) => {
    setFormIndex(idx);
  }

  const handlePrevForm = () => {
    if (formIndex <= 0) {
      return;
    }

    setFormIndex((prev) => prev - 1);
  };

  const handleResetForm = () => {
    setFormIndex(0);
  };

  const handleResetAllState = () => {
    handleResetForm();
    setRequestDetailForm(undefined);
    setPartiesDetailForm(undefined);
    setListIdContainerItems({});
    setListIdCargoItems({});
    setFilterStatus("All Status");
    setListIdVinItems({});
    setContainerItems([]);
    setPaymentItems([]);
    setSupportingDocument([]);
    setCargoItems([]);
    setVinItems([]);
    setIsCargoPage(true);
    setListRequiredNotificationData([]);
    setDeleteAllStatus(false);
  };

  return (
    <AppStateContext.Provider
      value={{
        statusCurrentDO,
        setStatusCurrentDO,
        isShippingLineProcessing,
        setIsShippingLineProcessing,
        isEditPage,
        isCreatePage,
        containerIdActive,
        handleResetAllState,
        isContainer,
        userInfo,
        setUserInfo,
        vinItems,
        isSaved,
        setIsSave,
        filterStatus,
        setFilterStatus,
        listRequiredNotificationData,
        setListRequiredNotificationData,
        setVinItems,
        selectAllStatus,
        isCargoPage,
        setIsCargoPage,
        setSelectAllStatus,
        deleteAllStatus,
        setDeleteAllStatus,
        listIdContainerItems,
        setListIdContainerItems,
        deleteIdContainerItems,
        listIdCargoItems,
        setListIdCargoItems,
        deleteIdCargoItems,
        listIdVinItems,
        setListIdVinItems,
        deleteIdVinItems,
        cargoItems,
        setCargoItems,
        supportingDocument,
        setSupportingDocument,
        partiesDetailForm,
        setPartiesDetailForm,
        requestDetailForm,
        setRequestDetailForm,
        paymentItems,
        setPaymentItems,
        containerItems,
        setContainerItems,
        formIndex,
        handleResetForm,
        handleNextForm,
        handlePrevForm,
        handleSpecificForm,
        forms,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used within the AppProvider");
  }
  return context;
}