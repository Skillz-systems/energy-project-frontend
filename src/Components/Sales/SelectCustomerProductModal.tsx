import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "../ModalComponent/Modal";
import { useGetRequest } from "@/utils/useApiCall";
import { observer } from "mobx-react-lite";
import { SaleStore } from "@/stores/SaleStore";
import { TabNamesType } from "../Inventory/InventoryDetailModal";
import { ListDataType } from "../Products/SelectInventoryModal";
import { DataStateWrapper } from "../Loaders/DataStateWrapper";
import { TableSearch } from "../TableSearchComponent/TableSearch";
import searchIcon from "../../assets/search.svg";
import ListPagination from "../PaginationComponent/ListPagination";
import TabComponent from "../TabComponent/TabComponent";

const SelectCustomerProductModal = observer(
  ({
    isModalOpen,
    setModalOpen,
    modalType,
  }: {
    isModalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    modalType: "customer" | "product";
  }) => {
    const [queryValue, setQueryValue] = useState<string>("");
    const [productCategoryId, setProductCategoryId] = useState<string>("");
    const [dynamicListData, setDynamicListData] = useState<any[]>([]);
    const [tabContent, setTabContent] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState<number>(12);
    const [_filterValue, setFilterValue] = useState<string>("");

    const fetchAllCustomers = useGetRequest("/v1/customers/all", false);
    const fetchAllProductCategories = useGetRequest(
      "/v1/products/categories/all",
      false
    );
    const fetchProductCategoryById = useGetRequest(
      `/v1/products?productCategoryId=${_filterValue}`
    );
    const fetchedData =
      modalType === "customer" ? fetchAllCustomers : fetchProductCategoryById;

    useEffect(() => {
      if (fetchAllProductCategories?.error) {
        SaleStore.setProductCategoryExist(false);
      } else {
        SaleStore.setProductCategoryExist(true);
      }
      if (fetchAllCustomers?.error) {
        SaleStore.setCustomersExist(false);
      } else {
        SaleStore.setProductCategoryExist(true);
      }
    }, [fetchAllProductCategories, fetchAllCustomers]);

    const tabNames: TabNamesType[] = useMemo(() => {
      return (
        fetchAllProductCategories.data?.map((data: { name: any; id: any }) => ({
          name: data.name,
          key: data.name,
          id: data.id,
        })) || []
      );
    }, [fetchAllProductCategories.data]);

    const fetchTabData = useCallback(
      async (categoryId: string) => {
        setFilterValue(categoryId);
        const data = await fetchProductCategoryById.data;
        if (data) {
          return generateListDataEntries(data);
        }
      },
      [fetchProductCategoryById.data]
    );

    const generateListDataEntries = (data: any): ListDataType[] => {
      return data?.products.map((product: any) => ({
        productId: product?.id,
        productImage: product?.image || "",
        productTag: product?.category,
        productName: product?.name,
        productPrice: product?.price || 0,
      }));
    };

    useEffect(() => {
      const fetchData = async () => {
        if (productCategoryId) {
          const tabData = await fetchTabData(productCategoryId);
          if (tabData) {
            setDynamicListData((prevListData) => [
              ...prevListData.filter((d) => d.name !== tabContent),
              { name: tabContent, data: tabData },
            ]);
          }
        }
      };
      fetchData();
    }, [fetchTabData, productCategoryId, tabContent]);

    const currentTabData = useMemo(() => {
      return (
        dynamicListData.find((item) => item.name === tabContent)?.data || []
      );
    }, [dynamicListData, tabContent]);

    const paginatedData = useMemo(() => {
      const startIndex = (currentPage - 1) * entriesPerPage;
      const endIndex = startIndex + entriesPerPage;
      const filteredProductData = currentTabData.filter((item: any) => {
        const queryWords = queryValue.toLowerCase().split(/\s+/); // Split queryValue into words
        const productName = item.productName.toLowerCase();

        return queryWords.some((word) => productName.includes(word)); // Check if any word matches
      });
      const filteredCustomerData = fetchedData?.data; // FIX LATER
      const filteredData =
        modalType === "customer" ? filteredCustomerData : filteredProductData;

      if (queryValue) {
        return filteredData?.slice(startIndex, endIndex);
      } else {
        return currentTabData?.slice(startIndex, endIndex);
      }
    }, [
      currentPage,
      entriesPerPage,
      currentTabData,
      fetchedData?.data,
      modalType,
      queryValue,
    ]);

    const getTabName =
      tabNames.find((tab) => tab.key === tabContent)?.name || "";

    const handlePageChange = (page: number) => setCurrentPage(page);

    const itemsSelected =
      modalType === "customer"
        ? SaleStore.customers.length
        : SaleStore.products.length;

    const handleTabSelect = useCallback(
      (key: string) => {
        setTabContent(key);
        const selectedTab = tabNames.find(
          (tab: { key: string }) => tab.key === key
        );
        setProductCategoryId(selectedTab?.id || "");
        setCurrentPage(1);
      },
      [tabNames]
    );

    return (
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
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
            Select {modalType === "customer" ? "Customer" : "Product"}
          </h2>
        }
        rightHeaderContainerClass="h-full items-start"
      >
        <DataStateWrapper
          isLoading={fetchedData?.isLoading}
          error={fetchedData?.error}
          errorStates={fetchedData?.errorStates}
          refreshData={fetchedData?.mutate}
          errorMessage={`Failed to fetch ${
            modalType === "customer" ? "customers" : "product categories"
          }`}
        >
          <div className="flex flex-col gap-2 px-4 py-8">
            {modalType === "product" ? (
              <TabComponent
                tabs={tabNames.map(({ name, key }) => ({
                  name,
                  key,
                  count: null,
                }))}
                onTabSelect={handleTabSelect}
              />
            ) : null}
            <div className="flex items-center justify-between w-full">
              <ListPagination
                totalItems={
                  queryValue
                    ? currentTabData.filter((item: any) =>
                        item.productName
                          .toLowerCase()
                          .includes(queryValue.toLowerCase())
                      ).length
                    : currentTabData.length
                } // FIX totalItems LATER
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
                  onClick={() => setModalOpen(false)}
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
                refreshTable={fetchedData.mutate}
                placeholder={`Search ${getTabName} here`}
                containerClass="w-full"
                inputContainerStyle="w-full"
                inputClass="w-full h-[32px] pl-3 bg-[#F9F9F9]"
                buttonContainerStyle="w-full h-[32px] pl-3 pr-2 bg-white shadow-innerCustom"
                icon={searchIcon}
              />
            </div>
            {/* CONDITIONALLY RENDER THE CUSTOMER AND PRODUCT DATA HERE */}
          </div>
        </DataStateWrapper>
      </Modal>
    );
  }
);

export default SelectCustomerProductModal;
