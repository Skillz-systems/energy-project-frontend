import React, { useMemo, useState } from "react";
import { Modal } from "../ModalComponent/Modal";
import editInput from "../../assets/settings/editInput.svg";
import { DropDown } from "../DropDownComponent/DropDown";
import TabComponent from "../TabComponent/TabComponent";
import InventoryDetails from "./InventoryDetails";
import InventoryStats from "./InventoryStats";
import InventoryHistory from "./InventoryHistory";
import { GoDotFill } from "react-icons/go";
import { generateRandomInventoryHistoryEntries } from "../TableComponent/sampleData";
import LoadingSpinner from "../Loaders/LoadingSpinner";
import { useGetRequest } from "../../utils/useApiCall";
import { KeyedMutator } from "swr";

type InventoryData = {
  id: string;
  name: string;
  dateOfManufacture: string;
  sku: string;
  image: string;
  batchNumber: number;
  costOfItem: number;
  price: number;
  numberOfStock: number;
  remainingQuantity: number;
  status: string;
  class: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  inventoryId: string;
  inventory: {
    id: string;
    name: string;
    manufacturerName: string;
    inventoryCategoryId: string;
    inventorySubCategoryId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
};

type DataStateWrapperProps = {
  isLoading: boolean;
  error: string | null;
  children: React.ReactNode;
};

export type TabNamesType = {
  name: string;
  key: string;
  count: null;
  id?: any;
};

const InventoryDetailModal = ({
  isOpen,
  setIsOpen,
  inventoryID,
  refreshTable,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  inventoryID: string;
  refreshTable: KeyedMutator<any>;
}) => {
  const fetchSingleBatchInventory = useGetRequest(
    inventoryID ? `/v1/inventory/batch/${inventoryID}` : "/v1",
    false
  );
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const [tabContent, setTabContent] = useState<string>("details");

  const getInventoryData = (data: InventoryData) => {
    const entries = {
      inventoryId: data?.id,
      inventoryImage: data?.image,
      inventoryName: data?.name,
      inventoryClass: data?.class,
      inventoryCategory: "",
      sku: data?.sku,
      manufacturerName: data?.inventory?.manufacturerName,
      dateOfManufacture: data?.dateOfManufacture,
      numberOfStock: data?.numberOfStock,
      costPrice: data?.costOfItem,
      salePrice: data?.price,
    };
    return entries;
  };
  const inventoryData = useMemo(() => {
    return getInventoryData(fetchSingleBatchInventory?.data);
  }, [fetchSingleBatchInventory]);

  const handleCancelClick = () => setDisplayInput(false);

  const dropDownList = {
    items: [
      "Request Restock",
      "Change Stock Status",
      "Transfer Stock Details",
      "Reset Stock Levels",
      "Delete Stock",
    ],
    onClickLink: (index: number) => {
      switch (index) {
        case 0:
          console.log("Request Restock");
          break;
        case 1:
          console.log("Change Stock Status");
          break;
        case 2:
          console.log("Transfer Stock Details");
          break;
        case 3:
          console.log("Reset Stock Levels");
          break;
        case 4:
          console.log("Delete Stock");
          break;
        default:
          break;
      }
    },
    defaultStyle: true,
    showCustomButton: true,
  };

  const tabNames: TabNamesType[] = [
    { name: "Details", key: "details", count: null },
    { name: "Stats", key: "stats", count: null },
    { name: "History", key: "history", count: null },
  ];

  const tagStyle = (value: string) => {
    if (value === "REGULAR") {
      return "bg-[#EAEEF2] text-textDarkGrey";
    } else if (value === "RETURNED") {
      return "bg-[#FFEBEC] text-errorTwo";
    } else {
      return "bg-[#FEF5DA] text-textDarkBrown";
    }
  };

  const DataStateWrapper: React.FC<DataStateWrapperProps> = ({
    isLoading,
    error,
    children,
  }) => {
    if (isLoading)
      return <LoadingSpinner parentClass="absolute top-[50%] w-full" />;
    if (error) return <div>Oops, an error occurred: {error}</div>;
    return <>{children}</>;
  };

  return (
    <Modal
      layout="right"
      bodyStyle="pb-44 overflow-auto"
      isOpen={isOpen}
      onClose={() => {
        setTabContent("details");
        setIsOpen(false);
      }}
      leftHeaderContainerClass="pl-2"
      leftHeaderComponents={
        inventoryData.inventoryClass && (
          <span
            className={`${tagStyle(
              inventoryData.inventoryClass
            )} flex items-center justify-center gap-0.5 w-max px-2 h-[24px] text-xs uppercase rounded-full`}
          >
            <GoDotFill width={4} height={4} />
            {inventoryData.inventoryClass}
          </span>
        )
      }
      rightHeaderComponents={
        displayInput ? (
          <p
            className="text-xs text-textDarkGrey font-semibold cursor-pointer over"
            onClick={handleCancelClick}
            title="Cancel editing user details"
          >
            Cancel Edit
          </p>
        ) : (
          <button
            className="flex items-center justify-center w-[24px] h-[24px] bg-white border border-strokeGreyTwo rounded-full hover:bg-slate-100"
            onClick={() => setDisplayInput(true)}
          >
            <img src={editInput} alt="Edit Button" width="15px" />
          </button>
        )
      }
    >
      <div className="bg-white">
        <header
          className={`flex items-center ${
            inventoryData.inventoryName ? "justify-between" : "justify-end"
          } bg-paleGrayGradientLeft p-4 min-h-[64px] border-b-[0.6px] border-b-strokeGreyThree`}
        >
          {inventoryData.inventoryName && (
            <p className="flex items-center justify-center bg-[#F6F8FA] w-max px-2 py-1 h-[24px] text-textBlack text-xs border-[0.4px] border-strokeGreyTwo rounded-full">
              {inventoryData.inventoryName}
            </p>
          )}
          <div className="flex items-center justify-end gap-2">
            <DropDown {...dropDownList} />
          </div>
        </header>
        <div className="flex flex-col w-full gap-4 px-4 py-2">
          <TabComponent
            tabs={tabNames.map(({ name, key, count }) => ({
              name,
              key,
              count,
            }))}
            onTabSelect={(key) => setTabContent(key)}
          />
          {tabContent === "details" ? (
            <DataStateWrapper
              isLoading={fetchSingleBatchInventory.isLoading}
              error={fetchSingleBatchInventory.error}
            >
              <InventoryDetails
                {...inventoryData}
                tagStyle={tagStyle}
                displayInput={displayInput}
                refreshTable={refreshTable}
              />
            </DataStateWrapper>
          ) : tabContent === "stats" ? (
            <InventoryStats
            // stats={statsData}
            />
          ) : tabContent === "history" ? (
            <InventoryHistory
              historyData={generateRandomInventoryHistoryEntries(50)}
            />
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

export default InventoryDetailModal;