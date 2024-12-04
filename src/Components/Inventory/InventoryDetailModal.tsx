import React, { useEffect, useState } from "react";
// import { Modal } from "../ModalComponent/Modal";
import editInput from "../../assets/settings/editInput.svg";
import { DropDown } from "../DropDownComponent/DropDown";
import TabComponent from "../TabComponent/TabComponent";
import InventoryDetails from "./InventoryDetails";
import InventoryStats from "./InventoryStats";
import InventoryHistory from "./InventoryHistory";
import { GoDotFill } from "react-icons/go";
import { generateRandomInventoryHistoryEntries } from "../TableComponent/sampleData";
// import LoadingSpinner from "../Loaders/LoadingSpinner";
// import { useApiCall, useGetRequest } from "../../utils/useApiCall";
import { Modal } from '@/Components/ModalComponent/ModalComponent/Modal';

const InventoryDetailModal = ({
  isOpen,
  setIsOpen,
  inventorytID,
  refreshTable,
  inventoryData,
}) => {
  // const { apiCall } = useApiCall();
  // const { data, isLoading, error, mutate } = useGetRequest(
  //   `/v1/inventory/single/${inventoryID}`,
  //   false
  // );

  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const [tabContent, setTabContent] = useState<string>("details");

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

  const tabNames = [
    { name: "Details", key: "details", count: null },
    { name: "Stats", key: "stats", count: null },
    { name: "History", key: "history", count: null },
  ];

  const tagStyle = (value: string) => {
    if (value.toLocaleLowerCase() === "regular") {
      return "bg-[#EAEEF2] text-textDarkGrey";
    } else if (value.toLocaleLowerCase() === "returned") {
      return "bg-[#FFEBEC] text-errorTwo";
    } else {
      return "bg-[#FEF5DA] text-textDarkBrown";
    }
  };

  useEffect(() => {
    console.log("Current tab content:", tabContent);
  }, [tabContent]);
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
        <span
          className={`${tagStyle(
            "regular"
          )} flex items-center justify-center gap-0.5 w-max px-2 h-[24px] text-xs uppercase rounded-full`}
        >
          <GoDotFill width={4} height={4} />
          {"regular"}
        </span>
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
      {/* {isLoading ? (
        <LoadingSpinner parentClass="absolute top-[50%] w-full" />
      ) : error ? (
        <div>Oops, an error occurred: {error}</div>
      ) : ( */}
      <div className="bg-white">
        <header className="flex items-center justify-between bg-paleGrayGradientLeft p-4 min-h-[64px] border-b-[0.6px] border-b-strokeGreyThree">
          <p className="flex items-center justify-center bg-[#F6F8FA] w-max px-2 py-1 h-[24px] text-textBlack text-xs border-[0.4px] border-strokeGreyTwo rounded-full">
            {"MONOCHROMATIC"}
          </p>
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
            <InventoryDetails
              {...inventoryData}
              tagStyle={tagStyle}
              displayInput={displayInput}
            />
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
      {/* )} */}
    </Modal>
  );
};

export default InventoryDetailModal;
