import React, { useMemo, useState } from "react";

import TabComponent from "../TabComponent/TabComponent";
import ListPagination from "../PaginationComponent/ListPagination";
import { CardComponent } from "../CardComponents/CardComponent";
// import LoadingSpinner from "../Loaders/LoadingSpinner";
// import { useApiCall, useGetRequest } from "../../utils/useApiCall";
import rootStore from "../../stores/rootStore";
import { observer } from "mobx-react-lite";
import { TableSearch } from "../TableSearchComponent/TableSearch";
import searchIcon from "../../assets/search.svg";
import { Modal } from "../ModalComponent/ModalComponent/Modal";

type ListDataType = {
  productId: string | number;
  productImage: string;
  productTag: string;
  productName: string;
  productPrice: number;
  productUnits: number;
};

type ProductInventoryType = {
  name: string;
  data: ListDataType[];
};

type InventoryModalProps = {
  isInventoryOpen: boolean;
  setIsInventoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  listData: ProductInventoryType[];
};

const SelectInventoryModal = observer(
  ({ isInventoryOpen, setIsInventoryOpen, listData }: InventoryModalProps) => {
    // const { apiCall } = useApiCall();
    // const { data, isLoading, error, mutate } = useGetRequest(
    //   `/v1/product/single/${productID}`,
    //   false
    // );
    const [tabContent, setTabContent] = useState<string>("solarPanels");
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState<number>(12);
    const tabNames = [
      { name: "Solar Panels", key: "solarPanels" },
      { name: "Inverters", key: "inverters" },
      { name: "Batteries", key: "batteries" },
      { name: "Charge Controllers", key: "chargeControllers" },
      { name: "Accessories", key: "accessories" },
    ];

    const currentTabData = useMemo(() => {
      return listData.find((item) => item.name === tabContent)?.data || [];
    }, [listData, tabContent]);

    const paginatedData = useMemo(() => {
      const startIndex = (currentPage - 1) * entriesPerPage;
      const endIndex = startIndex + entriesPerPage;
      return currentTabData.slice(startIndex, endIndex);
    }, [currentPage, entriesPerPage, currentTabData]);

    const getTabName =
      tabNames.find((tab) => tab.key === tabContent)?.name || "";
    const handlePageChange = (page: number) => setCurrentPage(page);

    const dropDownList = {
      items: [],
      onClickLink: (index: number) => {
        console.log(index);
      },
      defaultStyle: true,
      showCustomButton: true,
    };

    const itemsSelected = rootStore.productStore.products.length;

    return (
      <Modal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        layout="right"
        size="large"
        bodyStyle="pb-[100px]"
        headerClass="h-[65px]"
        leftHeaderContainerClass="h-full items-start pl-1"
        leftHeaderComponents={
          <h2
            style={{ textShadow: "0.5px 1px grey" }}
            className="text-textBlack text-xl font-semibold font-secondary"
          >
            Select Inventory
          </h2>
        }
        rightHeaderContainerClass="h-full items-start"
      >
        {/* {isLoading ? (
        <LoadingSpinner parentClass="absolute top-[50%] w-full" />
      ) : error ? (
        <div>Oops, an error occurred: {error}</div>
      ) : ( */}
        <div className="flex flex-col gap-2 px-4 py-8">
          <TabComponent
            tabs={tabNames.map(({ name, key }) => ({
              name,
              key,
              count: null,
            }))}
            onTabSelect={(key) => {
              setTabContent(key);
              setCurrentPage(1);
            }}
          />
          <div className="flex items-center justify-between w-full">
            <ListPagination
              totalItems={currentTabData.length}
              itemsPerPage={entriesPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              label={getTabName}
            />
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center bg-[#F9F9F9] px-2 text-textDarkGrey w-max gap-1 h-[24px] border-[0.6px] border-strokeGreyThree rounded-full">
                <p className="flex items-center justify-center text-xs">
                  Items Selected
                </p>
                <span className="flex items-center justify-center w-max h-4 px-1 bg-[#EAEEF2] text-xs border-[0.2px] border-strokeGrey rounded-full">
                  {itemsSelected}
                </span>
              </div>
              <button
                disabled={itemsSelected === 0}
                onClick={() => setIsInventoryOpen(false)}
                className={`text-sm  ${
                  itemsSelected > 0
                    ? "bg-primaryGradient text-white"
                    : "bg-[#F6F8FA] text-textDarkGrey cursor-not-allowed"
                } h-[24px] px-4 border-[0.6px] border-strokeGreyTwo rounded-full`}
              >
                Done
              </button>
            </div>
          </div>
          <div className="w-full">
            <TableSearch
              name={"Search"}
              onSearch={(query: string) => {
                console.log(query);
              }}
              queryValue={""}
              refreshTable={() => Promise.resolve()}
              placeholder={`Search ${getTabName} here`}
              containerClass="w-full"
              inputContainerStyle="w-full"
              inputClass="w-full h-[32px] pl-3 bg-[#F9F9F9]"
              buttonContainerStyle="w-full h-[32px] pl-3 pr-2 bg-white shadow-innerCustom"
              icon={searchIcon}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {paginatedData?.length > 0 ? (
              paginatedData?.map((data, index) => {
                return (
                  <CardComponent
                    key={`${data.productId}-${index}`}
                    variant={"inventoryTwo"}
                    dropDownList={dropDownList}
                    productId={data.productId}
                    productImage={data.productImage}
                    productTag={data.productTag}
                    productName={data.productName}
                    productPrice={data.productPrice}
                    productUnits={data.productUnits}
                    onSelectProduct={(productInfo) => {
                      rootStore.productStore.addProduct(productInfo);
                    }}
                    onRemoveProduct={(productId) =>
                      rootStore.productStore.removeProduct(productId)
                    }
                    isProductSelected={rootStore.productStore.products.some(
                      (p) => p.productId === data.productId
                    )}
                  />
                );
              })
            ) : (
              <p className="text-sm text-textBlack font-medium">
                No Data {getTabName} Available
              </p>
            )}
          </div>
        </div>
        {/* )} */}
      </Modal>
    );
  }
);

export default SelectInventoryModal;
