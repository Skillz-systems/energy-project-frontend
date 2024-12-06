import React, { useState } from "react";
import { KeyedMutator } from "swr";
import { Modal } from "@/Components/ModalComponent/Modal";
import editInput from "../../assets/settings/editInput.svg";
import { DropDown } from "../DropDownComponent/DropDown";
import { useGetRequest } from "@/utils/useApiCall";
import { CustomerType } from "./CustomerTable";
import TabComponent from "../TabComponent/TabComponent";
import { Icon } from "../Settings/UserModal";
import call from "../../assets/settings/call.svg";
import message from "../../assets/settings/message.svg";
import LoadingSpinner from "../Loaders/LoadingSpinner";
import CustomerDetails, { DetailsType } from "./CustomerDetails";

type DataStateWrapperProps = {
  isLoading: boolean;
  error: string | null;
  children: React.ReactNode;
};

const CustomerModal = ({
  isOpen,
  setIsOpen,
  customerID,
  refreshTable,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  customerID: string;
  refreshTable: KeyedMutator<any>;
}) => {
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const [tabContent, setTabContent] = useState<string>("customerDetails");

  const fetchSingleCustomer = useGetRequest(
    `/v1/customers/single/${customerID}`,
    false
  );

  const generateCustomerEntries = (data: CustomerType): DetailsType => {
    return {
      customerId: data?.id,
      firstName: data?.firstname,
      lastName: data?.lastname,
      email: data?.email,
      phoneNumber: data?.phone,
      addressType: data?.addressType ?? "",
      location: data?.location,
    };
  };

  const handleCancelClick = () => setDisplayInput(false);

  const dropDownList = {
    items: ["Call Customer", "Message Customer", "Delete Customer"],
    onClickLink: (index: number) => {
      switch (index) {
        case 0:
          console.log("Call Customer");
          break;
        case 1:
          console.log("Message Customer");
          break;
        case 2:
          console.log("Delete Customer");
          break;
        default:
          break;
      }
    },
    defaultStyle: true,
    showCustomButton: true,
  };

  const tabNames = [
    { name: "Customer Details", key: "customerDetails", count: null },
    { name: "Product Details", key: "stats", count: null },
    { name: "Registration History", key: "registrationHistory", count: null },
    { name: "Contracts", key: "contracts", count: null },
    { name: "Transactions", key: "transactions", count: 0 },
    { name: "Tickets", key: "tickets", count: 0 },
  ];

  const handleCallClick = () => {
    const callURL = `tel:${fetchSingleCustomer?.data?.phone}`;
    window.open(callURL, "_self");
  };

  const handleWhatsAppClick = () => {
    const whatsappURL = `https://wa.me/${fetchSingleCustomer?.data?.phone}`;
    window.open(whatsappURL, "_blank");
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
            fetchSingleCustomer?.data?.firstname
              ? "justify-between"
              : "justify-end"
          } bg-paleGrayGradientLeft p-4 min-h-[64px] border-b-[0.6px] border-b-strokeGreyThree`}
        >
          {fetchSingleCustomer?.data?.firstname && (
            <p className="flex items-center justify-center bg-paleLightBlue w-max p-2 h-[24px] text-textBlack text-xs font-semibold rounded-full">
              {fetchSingleCustomer?.data?.firstname}{" "}
              {fetchSingleCustomer?.data?.lastname}
            </p>
          )}
          <div className="flex items-center justify-end gap-2">
            <Icon icon={call} iconText="Call" handleClick={handleCallClick} />
            <Icon
              icon={message}
              iconText="Message"
              handleClick={handleWhatsAppClick}
            />
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
            tabsContainerClass="p-2 rounded-[20px]"
          />
          {tabContent === "customerDetails" ? (
            <DataStateWrapper
              isLoading={fetchSingleCustomer.isLoading}
              error={fetchSingleCustomer.error}
            >
              <CustomerDetails
                {...generateCustomerEntries(fetchSingleCustomer?.data)}
                refreshTable={refreshTable}
                displayInput={displayInput}
              />
            </DataStateWrapper>
          ) : (
            <div>
              {tabNames?.find((item) => item.key === tabContent)?.name} Coming
              Soon
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CustomerModal;
