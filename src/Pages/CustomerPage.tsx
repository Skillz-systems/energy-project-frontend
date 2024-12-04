import React, { useState, useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import { Table } from "@/Components/TableComponent/Table";
import {
  generateCustomerEntries,
  Entry,
} from "@/Components/TableComponent/sampleData";
import { SideMenu } from "@/Components/SideMenuComponent/SideMenu";
import { TitlePill } from "@/Components/TitlePillComponent/TitlePill";
import settings from "../assets/settings/settings.svg";
import moneyBag from "../assets/table/moneybag.svg";
import statusIcon from "../assets/table/status.svg";
import productsbadge from "../assets/products/productsbadge.png";
import ActionButton from "@/Components/ActionButtonComponent/ActionButton";
import circleAction from "../assets/settings/addCircle.svg";
import { DropDown } from "@/Components/DropDownComponent/DropDown";
import ProceedButton from "@/Components/ProceedButtonComponent/ProceedButtonComponent";
import { Modal } from "@/Components/LogoComponent/ModalComponent/Modal";
import { Input } from "@/Components/InputComponent/Input";
import LoadingSpinner from "@/Components/Loaders/LoadingSpinner";
import PageLayout from "./PageLayout";
import cancelled from "../assets/cancelled.svg";
import productgreen from "../assets/products/productgreen.svg";
import CustomerPagemodal from "./CustomerPagemodal";
import { useApiCall } from "../utils/useApiCall";

const CustomerPage = () => {
  const [tableData, setTableData] = useState<Entry[]>([]);
  const [queryLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [queryValue, setQueryValue] = useState("");
  const [isSearchQuery, setIsSearchQuery] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | any>(null);
  const [formState, setFormState] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    addressType: "HOME",
    location: "",
  });

  const [isFormFilled] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [allRolesLoading] = useState<boolean>(false);

  const { apiCall } = useApiCall();
  const handleViewCustomer = async (_: number) => {
    try {
      const response = await apiCall({
        endpoint: `v1/customers/single`,
        method: "get",
        showToast: false,
      });

      if (response?.data) {
        setSelectedCustomer(response.data);
        setIsCustomerModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch customer details:", error);
    }
  };

  const refreshTable = async () => {
    setIsLoading(true);
    try {
      const data = generateCustomerEntries(50);
      setTableData(data);
    } catch (error) {
      console.error("Failed to refresh table data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTableData = () => {
    if (isSearchQuery && queryValue) {
      return tableData.filter((entry) =>
        Object.values(entry).some((value: any) =>
          value.toString().toLowerCase().includes(queryValue.toLowerCase())
        )
      );
    }
    return tableData;
  };

  useEffect(() => {
    refreshTable();
  }, []);

  const filterList = [
    {
      name: "Location",
      items: ["All Status", "Recharge", "One-Time", "Installment"],
      onClickLink: (index: number) => {
        console.log("INDEX:", index);
      },
    },
    {
      name: "Product",
      items: ["Product Status", "Recharge", "One-Time", "Installment"],
      onClickLink: (index: number) => {
        console.log("INDEX:", index);
      },
    },
    {
      name: "Product Type",
      items: ["Type Status", "Recharge", "One-Time", "Installment"],
      onClickLink: (index: number) => {
        console.log("INDEX:", index);
      },
    },
    {
      name: "All Status",
      items: ["All Status", "Recharge", "One-Time", "Installment"],
      onClickLink: (index: number) => {
        console.log("INDEX:", index);
      },
    },
    {
      name: "Search",
      onSearch: (query: string) => {
        setQueryValue(query);
        setIsSearchQuery(true);
        console.log("Query:", query);
      },
      isSearch: true,
    },
    {
      onDateClick: (date: string) => {
        console.log("Date:", date);
      },
      isDate: true,
    },
  ];

  const columnList = [
    { title: "S/N", key: "no" },
    { title: "NAME", key: "name" },
    { title: "EMAIL", key: "email" },
    { title: "LOCATION", key: "location" },
    {
      title: "PRODUCT",
      key: "product",
      valueIsAComponent: true,
      customValue: (value: any) => (
        <span className="px-2 py-1 bg-[#F6F8FA] border-[0.4px] border-strokeGreyTwo rounded-full">
          {value}
        </span>
      ),
      rightIcon: <img src={moneyBag} alt="product icon" className="ml-auto" />,
    },
    {
      title: "STATUS",
      key: "status",
      valueIsAComponent: true,
      customValue: (value: any) => {
        let style = "";

        switch (true) {
          case value.includes("DUE"):
            style = "text-brightBlue";
            break;
          case value.includes("NONE"):
            style = "";
            break;
          case value.includes("DEFAULTED"):
            style = "text-errorTwo";
            break;
          case value.includes("COMPLETED"):
            style = "text-success";
            break;
          default:
            style = "";
        }

        return (
          <span
            className={`${style} flex items-center gap-0.5 w-max px-2 py-1 bg-[#F6F8FA] border-[0.4px] border-strokeGreyTwo rounded-full`}
          >
            <GoDotFill />
            {value}
          </span>
        );
      },
      rightIcon: <img src={statusIcon} alt="status icon" className="ml-auto" />,
    },
    {
      title: "ACTIONS",
      key: "actions",
      valueIsAComponent: true,
      customValue: (_: any, rowData: { id: number; }) => (
        <span
          onClick={() => handleViewCustomer(rowData.id)}
          className="px-2 py-1 text-[10px] text-textBlack font-medium bg-[#F6F8FA] border-[0.2px] border-strokeGreyTwo rounded-full shadow-innerCustom cursor-pointer"
        >
          View
        </span>
      ),
    },
  ];

  const navigationList = [
    { title: "All Customers", link: "/customers", count: "5,050,200" },
    { title: "New Customers", link: "/new-customers", count: 102 },
    {
      title: "Defaulting Customers",
      link: "/defaulting-customers",
      count: 120000,
    },
    { title: "Barred Customers", link: "/barred-customers", count: "42" },
  ];
  const dropDownList = {
    items: ["Add new user", "Export List"],
    onClickLink: (index: number) => {
      switch (index) {
        case 0:
          setIsOpen(true);
          break;
        case 1:
          console.log(index);
          break;
        default:
          break;
      }
    },
    showCustomButton: true,
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form submitted");
    try {
      await apiCall({
        endpoint: "/v1/customers/create",
        method: "post",
        data: formState,
        successMessage: "Customer created successfully!",
      });

      setFormState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        address: "",
        addressType: "",
        location: "",
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout pageName="Customers" badge={productsbadge}>
      <div className="flex w-full flex-col px-2 md:px-8 py-4 gap-2">
        <div className="flex justify-between items-center mb-4 bg-paleGrayGradient min-h-[64px] w-full px-2">
          <div className="flex gap-4 items-center">
            <TitlePill
              icon={productgreen}
              iconBgColor="bg-[#E3FAD6]"
              topText="All"
              bottomText="CUSTOMERS"
              value="2240"
              parentClass="w-full max-w-none sm:max-w-[250px]"
            />
            <TitlePill
              parentClass="w-full max-w-none sm:max-w-[250px]"
              icon={settings}
              iconBgColor="bg-[#FDEEC2]"
              topText="New"
              bottomText="CUSTOMERS"
              value="2240"
            />
            <TitlePill
              icon={cancelled}
              iconBgColor="bg-[#FFDBDE]"
              topText="Defaulting"
              bottomText="CUSTOMERS"
              value="2240"
              parentClass="w-full max-w-none sm:max-w-[250px]"
            />
            <TitlePill
              icon={cancelled}
              iconBgColor="bg-[#FDEEC2]"
              topText="BARRED"
              bottomText="CUSTOMERS"
              value="2240"
              parentClass="w-full max-w-none sm:max-w-[250px]"
            />
          </div>
          <div className="flex w-full items-center justify-between gap-2 sm:w-max sm:justify-start">
            <ActionButton
              label="New Customer"
              icon={<img src={circleAction} />}
              onClick={() => setIsOpen(true)}
            />
            <DropDown {...dropDownList} />
          </div>
        </div>
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
              className={`flex items-center justify-center px-4 w-full min-h-[64px] border-b-[0.6px] border-strokeGreyThree ${
                isFormFilled
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
            {allRolesLoading ? (
              <LoadingSpinner parentClass="absolute top-[50%] w-full" />
            ) : (
              <div className="flex flex-col items-center justify-center w-full px-4 gap-4 py-8">
                <Input
                  type="text"
                  name="firstname"
                  label="FIRST NAME"
                  value={formState.firstname}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  required={true}
                  style={`${
                    isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
                  }`}
                />
                <Input
                  type="text"
                  name="lastname"
                  label="LAST NAME"
                  value={formState.lastname}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  required={true}
                  style={`${
                    isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
                  }`}
                />
                <Input
                  type="email"
                  name="email"
                  label="EMAIL"
                  value={formState.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required={true}
                  style={`${
                    isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
                  }`}
                />
                <Input
                  type="text"
                  name="phone"
                  label="PHONE"
                  value={formState.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  required={true}
                  style={`${
                    isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
                  }`}
                />

                <Input
                  type="text"
                  name="address"
                  label="Address"
                  value={formState.address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  required={true}
                  style={`${
                    isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
                  }`}
                />
                {/* <Input
                  type="text"
                  name="addressType"
                  label="addressType"
                  value={formState.addressType}
                  onChange={handleInputChange}
                  placeholder="Address Type"
                  required={true}
                  style={`${isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"}`}
                /> */}
                <Input
                  type="text"
                  name="location"
                  label="location"
                  value={formState.location}
                  onChange={handleInputChange}
                  placeholder="location"
                  required={true}
                  style={`${
                    isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
                  }`}
                />
              </div>
            )}
            <ProceedButton
              type="submit"
              loading={loading}
              variant={isFormFilled ? "gradient" : "gray"}
            />
          </form>
        </Modal>

        <div className="flex flex-row w-full gap-4">
          <div className="flex-shrink-0">
            <SideMenu navigationList={navigationList} />
          </div>

          <div className="flex-grow">
            <Table
              tableTitle="ALL CUSTOMERS"
              filterList={filterList}
              columnList={columnList}
              loading={queryLoading || isLoading}
              tableData={getTableData()}
              refreshTable={async () => {
                await refreshTable();
                setQueryValue("");
                setIsSearchQuery(false);
              }}
              queryValue={isSearchQuery ? queryValue : ""}
            />
            <CustomerPagemodal
              isOpen={isCustomerModalOpen}
              setIsOpen={() => setIsCustomerModalOpen(false)}
              customerId={selectedCustomer}
              refreshTable={refreshTable}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CustomerPage;
