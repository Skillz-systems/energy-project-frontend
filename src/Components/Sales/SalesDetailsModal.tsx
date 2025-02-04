import React, { useState } from "react";
import { KeyedMutator } from "swr";
import { Modal } from "../ModalComponent/Modal";
import { ProductTag, SimpleTag } from "../CardComponents/CardComponent";
import { DropDown } from "../DropDownComponent/DropDown";
import TabComponent from "../TabComponent/TabComponent";
import { TabNamesType } from "../Inventory/InventoryDetailModal";
import { DataStateWrapper } from "../Loaders/DataStateWrapper";
import SaleDetails from "./SaleDetails";
import SaleHistory from "./SaleHistory";
import SaleTransactions from "./SaleTransactions";
import { toast } from "react-toastify";
import { useApiCall, useGetRequest } from "@/utils/useApiCall";

export type SaleDetailsType = {
  daysToNextInstallment: string;
  status: string;
  productCategory: string;
  paymentMode: string;
  saleId: string;
  productName: string;
  salePrice: number;
  customer: string;
  address: string;
  datetime: string;
  agent: string;
};

export type SaleTransactionsType = {
  transactionId: string;
  paymentStatus: string;
  datetime: string;
  productCategory: string;
  paymentMode: string;
  amount: number;
};

const SalesDetailsModal = ({
  isOpen,
  setIsOpen,
  salesID,
  refreshTable,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  salesID: string;
  refreshTable: KeyedMutator<any>;
}) => {
  const { apiCall } = useApiCall();
  const [tabContent, setTabContent] = useState<string>("details");

  const fetchSingleSale = useGetRequest(`/v1/sales/${salesID}`, false);

  const generateSaleEntries = (): SaleDetailsType => {
    const data = fetchSingleSale?.data;
    const customerKey = data?.sale?.customer;
    const customerName = `${customerKey?.firstname} ${customerKey?.lastname}`;
    return {
      daysToNextInstallment: "29 DAYS",
      status: data?.sale?.status,
      productCategory: data?.product?.categoryName || "N/A",
      paymentMode: data?.paymentMode,
      saleId: data?.id,
      productName: data?.product?.name,
      salePrice: 290000,
      customer: customerName,
      address: customerKey?.location,
      datetime: data?.createdAt,
      agent: data?.agent || "N/A",
    };
  };

  const data = generateSaleEntries();

  const generateSaleTransactionEntries = (): SaleTransactionsType[] => {
    return [
      {
        transactionId: "362328hsdda",
        paymentStatus: "Successful",
        datetime: "2024-12-23T12:34:56",
        productCategory: "EAAS",
        paymentMode: "RECHARGE",
        amount: 60500,
      },
      {
        transactionId: "562328hsdda",
        paymentStatus: "Failed",
        datetime: "2024-12-23T12:34:56",
        productCategory: "SHS",
        paymentMode: "RECHARGE",
        amount: 50500,
      },
    ];
  };

  const cancelSale = async () => {
    const confirmation = prompt(
      `Are you sure you want to cancel sale with ID "${data?.saleId}"? This action is irreversible! Enter "Yes" or "No".`,
      "No"
    );

    if (confirmation?.trim()?.toLowerCase() === "yes") {
      toast.info(`Cancelling sale ${data?.saleId}`);
      apiCall({
        endpoint: "/v1/sales/cancel",
        method: "post",
        data: { id: salesID },
        successMessage: "Sale cancelled successfully!",
      })
        .then(async () => {
          await refreshTable();
        })
        .catch((error: any) => console.error(error));
    }
  };

  const dropDownList = {
    items: ["View Product", "View Agent", "View Customer", "Cancel Sale"],
    onClickLink: (index: number) => {
      switch (index) {
        case 0:
          console.log("View Product");
          break;
        case 1:
          console.log("View Agent");
          break;
        case 2:
          console.log("View Customer");
          break;
        case 3:
          cancelSale();
          break;
        default:
          break;
      }
    },
    defaultStyle: true,
    showCustomButton: true,
  };

  const tabNames: TabNamesType[] = [
    { name: "Sale Details", key: "details", count: null },
    { name: "Sale History", key: "history", count: null },
    { name: "Sale Transactions", key: "transactions", count: 2 },
  ];

  return (
    <Modal
      layout="right"
      bodyStyle="pb-44 overflow-auto"
      size="large"
      isOpen={isOpen}
      onClose={() => {
        setTabContent("details");
        setIsOpen(false);
      }}
      leftHeaderComponents={
        data?.status ? (
          <div className="flex items-center gap-3">
            {[data?.daysToNextInstallment, data?.status].map((item, index) => (
              <SimpleTag
                key={index}
                text={item}
                dotColour="#9BA4BA"
                containerClass="bg-[#F6F8FA] font-light text-textDarkGrey px-2 py-1 border-[0.4px] border-strokeGreyThree rounded-full"
              />
            ))}
          </div>
        ) : null
      }
      leftHeaderContainerClass="pl-2"
    >
      <div className="bg-white">
        <header
          className={`flex items-center ${data?.saleId ? "justify-between" : "justify-end"
            } bg-paleGrayGradientLeft p-4 min-h-[64px] border-b-[0.6px] border-b-strokeGreyThree`}
        >
          {!data?.saleId ? null : (
            <div className="flex items-center gap-1 pl-1 pr-2 py-1 w-max bg-[#F6F8FA] border-[0.4px] border-strokeGreyTwo rounded-full">
              <ProductTag productTag={data?.productCategory} />
              <p className="text-textBlack text-xs">{data?.paymentMode}</p>
            </div>
          )}
          <DropDown {...dropDownList} />
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
          <DataStateWrapper
            isLoading={fetchSingleSale?.isLoading}
            error={fetchSingleSale?.error}
            errorStates={fetchSingleSale?.errorStates}
            refreshData={fetchSingleSale?.mutate}
            errorMessage="Failed to fetch sale details"
          >
            {tabContent === "details" ? (
              <SaleDetails data={data} />
            ) : tabContent === "history" ? (
              <SaleHistory />
            ) : (
              <SaleTransactions data={generateSaleTransactionEntries()} />
            )}
          </DataStateWrapper>
        </div>
      </div>
    </Modal>
  );
};

export default SalesDetailsModal;
