import React, { useCallback, useEffect, useMemo, useState } from "react";
import TabComponent from "../TabComponent/TabComponent";
import ListPagination from "../PaginationComponent/ListPagination";
import { CardComponent } from "../CardComponents/CardComponent";
import rootStore from "../../stores/rootStore";
import { observer } from "mobx-react-lite";
import { TableSearch } from "../TableSearchComponent/TableSearch";
import searchIcon from "../../assets/search.svg";
import wrong from "../../assets/table/wrong.png";
import { useGetRequest } from "@/utils/useApiCall";
import { Modal } from "@/Components/ModalComponent/Modal";
import { TabNamesType } from "../Inventory/InventoryDetailModal";
import { DataStateWrapper } from "../Loaders/DataStateWrapper";
import { ProductStore } from "@/stores/ProductStore";

type ListDataType = {
  productId: string;
  productImage: string;
  productTag: string;
  productName: string;
  productPrice: number;
};

type ProductInventoryType = {
  name: string;
  data: ListDataType[];
};

type InventoryModalProps = {
  isInventoryOpen: boolean;
  setIsInventoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type InventoryCategoryType = {
  id: string;
  name: string;
  parentId: string | null;
  type: "INVENTORY" | "PRODUCT";
  createdAt: string;
  updatedAt: string;
};

export type BatchType = {
  id: string;
  name: string;
  dateOfManufacture: string | null;
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
};

type AllInventoryType = {
  id: string;
  name: string;
  manufacturerName: string;
  inventoryCategoryId: string;
  inventorySubCategoryId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  batches: BatchType[];
  inventoryCategory: InventoryCategoryType;
  inventorySubCategory: InventoryCategoryType;
};

const SelectInventoryModal = observer(
  ({ isInventoryOpen, setIsInventoryOpen }: InventoryModalProps) => {
    const [queryValue, setQueryValue] = useState<string>("");
    const [inventoryCategoryId, setInventoryCategoryId] = useState<string>("");
    const [dynamicListData, setDynamicListData] = useState<
      ProductInventoryType[]
    >([]);
    const [tabContent, setTabContent] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState<number>(12);
    const [_categoryId, setCategoryId] = useState<string>("");

    const fetchAllInventoryCategories = useGetRequest(
      "/v1/inventory/categories",
      false
    );

    useEffect(() => {
      if (fetchAllInventoryCategories?.error) {
        ProductStore.setProductCategoriesExist(false);
      } else {
        ProductStore.setProductCategoriesExist(true);
      }
    }, [fetchAllInventoryCategories]);

    const tabNames: TabNamesType[] = useMemo(() => {
      return (
        fetchAllInventoryCategories.data?.map(
          (data: { name: any; id: any }) => ({
            name: data.name,
            key: data.name,
            id: data.id,
          })
        ) || []
      );
    }, [fetchAllInventoryCategories.data]);

    const fetchInventoryCategoryById = useGetRequest(
      `/v1/inventory?inventoryCategoryId=${_categoryId}`
    );

    const fetchTabData = useCallback(
      async (categoryId: string) => {
        setCategoryId(categoryId);
        const data = await fetchInventoryCategoryById.data;
        if (data) {
          return generateListDataEntries(data);
        }
      },
      [fetchInventoryCategoryById.data]
    );

    const generateListDataEntries = (data: any): ListDataType[] => {
      return data?.inventories.map((inventory: AllInventoryType) => ({
        productId: inventory.batches[0]?.id,
        productImage: inventory.batches[0]?.image || "",
        productTag: inventory.inventoryCategory?.name,
        productName: inventory.name,
        productPrice: inventory.batches[0]?.price || 0,
      }));
    };

    useEffect(() => {
      if (tabNames.length > 0) {
        setTabContent(tabNames[0]?.key || "");
        setInventoryCategoryId(tabNames[0]?.id || "");
      }
    }, [tabNames]);

    useEffect(() => {
      const fetchData = async () => {
        if (inventoryCategoryId) {
          const tabData = await fetchTabData(inventoryCategoryId);
          if (tabData) {
            setDynamicListData((prevListData) => [
              ...prevListData.filter((d) => d.name !== tabContent),
              { name: tabContent, data: tabData },
            ]);
          }
        }
      };
      fetchData();
    }, [fetchTabData, inventoryCategoryId, tabContent]);

    const currentTabData = useMemo(() => {
      return (
        dynamicListData.find((item) => item.name === tabContent)?.data || []
      );
    }, [dynamicListData, tabContent]);

    const paginatedData = useMemo(() => {
      const startIndex = (currentPage - 1) * entriesPerPage;
      const endIndex = startIndex + entriesPerPage;
      const filteredData = currentTabData.filter((item) => {
        const queryWords = queryValue.toLowerCase().split(/\s+/); // Split queryValue into words
        const productName = item.productName.toLowerCase();

        return queryWords.some((word) => productName.includes(word)); // Check if any word matches
      });

      if (queryValue) {
        return filteredData?.slice(startIndex, endIndex);
      } else {
        return currentTabData?.slice(startIndex, endIndex);
      }
    }, [currentPage, entriesPerPage, currentTabData, queryValue]);

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

    const handleTabSelect = useCallback(
      (key: string) => {
        setTabContent(key);
        const selectedTab = tabNames.find(
          (tab: { key: string }) => tab.key === key
        );
        setInventoryCategoryId(selectedTab?.id || "");
        setCurrentPage(1);
      },
      [tabNames]
    );

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
        <DataStateWrapper
          isLoading={fetchAllInventoryCategories?.isLoading}
          error={fetchAllInventoryCategories?.error}
          errorStates={fetchAllInventoryCategories?.errorStates}
          refreshData={fetchAllInventoryCategories?.mutate}
          errorMessage="Failed to fetch inventory categories"
        >
          <div className="flex flex-col gap-2 px-4 py-8">
            <TabComponent
              tabs={tabNames.map(({ name, key }) => ({
                name,
                key,
                count: null,
              }))}
              onTabSelect={handleTabSelect}
            />
            <div className="flex items-center justify-between w-full">
              <ListPagination
                totalItems={
                  queryValue
                    ? currentTabData.filter((item) =>
                        item.productName
                          .toLowerCase()
                          .includes(queryValue.toLowerCase())
                      ).length
                    : currentTabData.length
                }
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
                  setQueryValue(query);
                  setCurrentPage(1);
                }}
                queryValue={queryValue}
                setQueryValue={setQueryValue}
                refreshTable={fetchInventoryCategoryById.mutate}
                placeholder={`Search ${getTabName} here`}
                containerClass="w-full"
                inputContainerStyle="w-full"
                inputClass="w-full h-[32px] pl-3 bg-[#F9F9F9]"
                buttonContainerStyle="w-full h-[32px] pl-3 pr-2 bg-white shadow-innerCustom"
                icon={searchIcon}
              />
            </div>
            <DataStateWrapper
              isLoading={fetchInventoryCategoryById?.isLoading}
              error={fetchInventoryCategoryById?.error}
              errorStates={fetchInventoryCategoryById?.errorStates}
              refreshData={fetchInventoryCategoryById?.mutate}
              errorMessage={`Failed to fetch inventory list for "${getTabName}".`}
            >
              <div
                className={`flex flex-wrap ${
                  fetchInventoryCategoryById?.error
                    ? "justify-center"
                    : "justify-start"
                } items-center h-full gap-4`}
              >
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
                        onSelectProduct={(productInfo) => {
                          if (productInfo)
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
                  <div className="flex flex-col items-center justify-center w-full h-full pt-16">
                    <img
                      src={wrong}
                      alt="No data available"
                      className="w-[100px]"
                    />
                    <p className="text-textBlack font-medium">
                      No data available
                    </p>
                  </div>
                )}
              </div>
            </DataStateWrapper>
          </div>
        </DataStateWrapper>
      </Modal>
    );
  }
);

export default SelectInventoryModal;
