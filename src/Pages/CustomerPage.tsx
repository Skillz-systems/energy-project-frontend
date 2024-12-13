import React, { useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import { Table } from "@/Components/TableComponent/Table";
import {
  generateCustomerEntries,
  Entry,
} from "@/Components/TableComponent/sampleData";

import moneyBag from "../assets/table/moneybag.svg";
import statusIcon from "../assets/table/status.svg";
import productsbadge from "../assets/products/productsbadge.png";
import { Routes, Route, useLocation } from "react-router-dom";
import useGlobalErrorBoundary from "@/hooks/useGlobalErrorBoundary";
import { SideMenu } from "../Components/SideMenuComponent/SideMenu";
import LoadingSpinner from "../Components/Loaders/LoadingSpinner";
import { Suspense, lazy, useState } from "react";
import customer from "../assets/table/customer.svg";
import addCircle from "../assets/settings/addCircle.svg";
import { DropDown } from "../Components/DropDownComponent/DropDown";
import settingsBadge from "../assets/settings/settingsbadge.png";
import { useGetRequest } from "../utils/useApiCall";
import { observer } from "mobx-react-lite";
import rootStore from "../stores/rootStore";
import PageLayout from "./PageLayout";
import CreateCustomerModal from "@/Components/Customers/CreateNewCustomer";
import ActionButton from "@/Components/ActionButtonComponent/ActionButton";
import { TitlePill } from "@/Components/TitlePillComponent/TitlePill";

const AllCustomers = lazy(() => import("@/Components/Customers/AllCustomers"));

const CustomerPage = observer(() => {
  const { customerPageStore } = rootStore;
  const { handleErrorBoundary } = useGlobalErrorBoundary();
  const [isOpen, setIsOpen] = useState(false);

  const customerLocation = useLocation();
  const navigationList = [
    { title: "All Customers", link: "/customers/all-customers" },
    { title: "New Customer", link: "/customers/new-customers" },
    { title: "Defaulting Customers", link: "/customers/defaulting-customers" },
    { title: "Barred Customers", link: "/customers/barred-customers" },
  ];

  const dropDownList = {
    items: ["Add new customer", "Export List"],
    onClickLink: (index) => {
      switch (index) {
        case 0:
          setIsOpen(true);
          break;
        case 1:
          console.log("Export List clicked");
          break;
        default:
          break;
      }
    },
    showCustomButton: true,
  };

  const fetchAllCustomers = useGetRequest("/v1/customers",true, 6000);
  console.log(fetchAllCustomers)
  const refreshTable = fetchAllCustomers?.mutate; 
  const isLoading = fetchAllCustomers?.isLoading;
  const customerData = fetchAllCustomers?.data
  const customerList = fetchAllCustomers?.data?.customers?.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  if (fetchAllCustomers?.error) {
    handleErrorBoundary(
      fetchAllCustomers?.error,
      fetchAllCustomers?.isNetworkError
    );
  }
  return (
    <>
      <PageLayout pageName="Customers" badge={settingsBadge}>
        {customerLocation.pathname === "/customers/all-customers" ? (
          <section className="flex flex-col-reverse sm:flex-row items-center justify-between w-full bg-paleGrayGradient px-2 md:px-8 py-4 gap-2 min-h-[64px]">
            <TitlePill
              icon={customer}
              iconBgColor="bg-[#C2FDEE]"
              topText="All"
              bottomText="CUSTOMERS"
              value={customerPageStore.noOfCustomers || 0}
            />
            <div className="flex w-full items-center justify-between gap-2 min-w-max sm:w-max sm:justify-start">
              <ActionButton
                label="New Customer"
                icon={<img src={addCircle} />}
                onClick={() => setIsOpen(true)}
              />
              <DropDown {...dropDownList} />
            </div>
          </section>
        ) : null}
        <div className="flex flex-col w-full px-2 py-8 gap-4 lg:flex-row md:p-8">
          <SideMenu navigationList={navigationList} />
          <section className="relative items-start justify-center flex min-h-[415px] w-full overflow-hidden">
            <Suspense
              fallback={
                <LoadingSpinner parentClass="absolute top-[50%] w-full" />
              }
            >
              <Routes>
                <Route
                  index
                  element={
                    <AllCustomers
                      customerList={customerList}
                      refreshTable={refreshTable}
                      data={customerData}
                      isLoading={isLoading}
                    />
                  }
                />
                <Route path="all-customers"
                  element={
                    <AllCustomers
                      customerList={customerList}
                      refreshTable={refreshTable}
                      data={customerData}
                      isLoading={isLoading}
                    />
                    } />
                <Route path="new" element={<div>Coming soon</div>} />
                <Route path="defaulting" element={<div>Coming soon</div>} />
                <Route path="barred" element={<div>Coming soon</div>} />
              </Routes>

            </Suspense>
          </section>
        </div>
      </PageLayout>
      <CreateCustomerModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        allAddressTypesLoading={false}
        addressTypesList={[]}
        allCustomersRefresh={() => { }}
      />
    </>
  );
});

export default CustomerPage;
