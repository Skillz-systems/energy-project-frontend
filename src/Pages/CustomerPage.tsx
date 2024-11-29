import { Routes, Route, useLocation } from "react-router-dom";
import { SideMenu } from "../Components/SideMenuComponent/SideMenu";
import LoadingSpinner from "../Components/Loaders/LoadingSpinner";
import { Suspense, useState } from "react";
import { TitlePill } from "../Components/TitlePillComponent/TitlePill";
import ActionButton from "../Components/ActionButtonComponent/ActionButton";
import circleAction from "../assets/settings/addCircle.svg";
import { DropDown } from "../Components/DropDownComponent/DropDown";
import customerBadge from "../assets/settings/settingsBadge.png";
import customer from "../assets/table/customer.svg";
import { Input } from "../Components/InputComponent/Input";
import ProceedButton from "../Components/ProceedButtonComponent/ProceedButtonComponent";
import { useApiCall, useGetRequest } from "../utils/useApiCall";
import { observer } from "mobx-react-lite";
import rootStore from "../stores/rootStore";
import PageLayout from "./PageLayout";
import { Modal } from "@/Components/ModalComponent/ModalComponent/Modal";
import Customers from "@/Components/Customers/All Customers";


const defaultFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

const CustomerPage = observer(() => {
  const { customerPageStore } = rootStore;
  const { apiCall } = useApiCall();
  const [formData, setFormData] = useState(defaultFormData);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const userLocation = useLocation();

  const navigationList = [
    {
      title: "All Customers",
      link: "/CustomerPage/all customer",
      count: customerPageStore.noOfCustomers,
    },
    {
      title: "New Customer",
      link: "/customers/new",
    },

  ];

  const dropDownList = {
    items: ["Add new customer", "Export List"],
    onClickLink: (index) => {
      if (index === 0) setIsOpen(true);
      if (index === 1) console.log("Export List clicked");
    },
    showCustomButton: true,
  };

  const {
    data: tiersList,
    isLoading: isLoading,
    error: allRolesError,
    mutate: refreshTable,
  } = useGetRequest("/v1/customers", true, 60000);

  const {
    data: customerData,
    isLoading: userLoading,
    mutate: allUsersRefresh,
  } = useGetRequest("/v1/customers", true, 60000);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiCall({
        endpoint: "/v1/customers/add",
        method: "post",
        data: formData,
        successMessage: "Customer created successfully!",
      });
      setFormData(defaultFormData);
      setIsOpen(false);
    } catch (error) {
      console.error("Customer creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const isFormFilled = Object.values(formData).some((value) => Boolean(value));

  return (
    <>
      <PageLayout pageName="Customers" badge={customerBadge}>
        {userLocation.pathname === "/customers/all" && (
          <section className="flex flex-col-reverse sm:flex-row items-center justify-between w-full bg-paleGrayGradient px-2 md:px-8 py-4 gap-2 min-h-[64px]">
            <TitlePill
              icon={customer}
              iconBgColor="bg-[#FDEEC2]"
              topText="All"
              bottomText="CUSTOMERS"
              value={customerPageStore.noOfCustomers || 0}
            />
            <div className="flex w-full items-center justify-between gap-2 min-w-max sm:w-max sm:justify-start">
              <ActionButton
                label="New Customer"
                icon={<img src={circleAction} alt="Add Customer" />}
                onClick={() => setIsOpen(true)}
              />
              <DropDown {...dropDownList} />
            </div>
          </section>
        )}
        <div className="flex flex-col w-full px-2 py-8 gap-4 lg:flex-row md:p-8">
          <SideMenu navigationList={navigationList} />
          <section className="relative flex items-start justify-center min-h-[415px] w-full overflow-hidden">
            <Suspense fallback={<LoadingSpinner parentClass="absolute top-[50%] w-full" />}>
              <Routes>
                <Route
                  index
                  element={
                    <Customers
                      tiersList={tiersList}
                      data={customerData}
                      isLoading={isLoading}
                      refreshTable={refreshTable}
                    />
                  }
                />
                <Route
                  path="all-customers"
                  element={
                    <Customers
                      tiersList={tiersList}
                      data={customerData}
                      isLoading={isLoading}
                      refreshTable={refreshTable}
                    />
                  }
                />
                <Route
                  path="new-customers"
                  element={
                    <div className="flex justify-center items-center h-full">
                      <p>New Customers Component Coming Soon</p>
                    </div>
                  }
                />
                <Route
                  path="defaulting-customers"
                  element={
                    <div className="flex justify-center items-center h-full">
                      <p>Defaulting Customers Component Coming Soon</p>
                    </div>
                  }
                />
                <Route
                  path="barred-customers"
                  element={
                    <div className="flex justify-center items-center h-full">
                      <p>Barred Customers Component Coming Soon</p>
                    </div>
                  }
                />
              </Routes>


            </Suspense>
          </section>
        </div>
      </PageLayout >
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        layout="right"
        bodyStyle="pb-[100px]"
      >
        <form
          className="flex flex-col items-center bg-white"
          onSubmit={handleSubmit}
        >
          <div
            className={`flex items-center justify-center px-4 w-full min-h-[64px] border-b-[0.6px] border-strokeGreyThree ${isFormFilled
              ? "bg-paleCreamGradientLeft"
              : "bg-paleGrayGradientLeft"
              }`}
          >
            <h2
              style={{ textShadow: "1px 1px grey" }}
              className="text-xl text-textBlack font-semibold font-secondary"
            >
              New Customer
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center w-full px-4 gap-4 py-8">
            <Input
              type="text"
              name="name"
              label="CUSTOMER NAME"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Customer Name"
              required
            />
            <Input
              type="email"
              name="email"
              label="EMAIL"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
            />
            <Input
              type="text"
              name="phone"
              label="PHONE NUMBER"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              required
            />
            <Input
              type="text"
              name="address"
              label="ADDRESS"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
              required
            />
          </div>
          <ProceedButton
            type="submit"
            loading={loading}
            variant={isFormFilled ? "gradient" : "gray"}
          />
        </form>
      </Modal>
    </>
  );
});

export default CustomerPage;
