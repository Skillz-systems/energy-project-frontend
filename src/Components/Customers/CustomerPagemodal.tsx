import React, { useEffect, useState } from "react";
import { Modal } from "@/Components/ModalComponent/Modal";
import LoadingSpinner from "@/Components/Loaders/LoadingSpinner";
import { DropDown } from "@/Components/DropDownComponent/DropDown";
import { useApiCall } from "@/utils/useApiCall";
import userIcon from "../../assets/settings/user.svg";
import callIcon from "../../assets/settings/call.svg";
import messageIcon from "../../assets/settings/message.svg";
import editInputIcon from "../../assets/settings/editInput.svg";
import { Icon } from "@/Components/Settings/UserModal";

interface CustomerData {
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  addresstype: string;
  location: string;
  customerId?: string;
}

const CustomerModal = ({ isOpen, setIsOpen, customerId, refreshTable }: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  customerId: string;
  refreshTable: () => void;
}) => {
  const { apiCall } = useApiCall();
  const [activeNav, setActiveNav] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState<CustomerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    "Customer Details",
    "Product Details",
    "Registration History",
    "Contracts",
    "Transactions",
    "Tickets",
  ];

  useEffect(() => {
    if (customerId) {
      const fetchCustomer = async () => {
        try {
          setIsLoading(true);
          const response = await apiCall({
            endpoint: `/v1/customers/single/${customerId}`,
            method: "get",
          });
          const customer = response.data || {};

          setData({
            firstname: customer.firstname || "N/A",
            lastname: customer.lastname || "N/A",
            email: customer.email || "N/A",
            phonenumber: customer.phone || "N/A",
            addresstype: customer.addressType || "N/A",
            location: customer.location || "N/A",
            customerId: customer.id || "N/A",
          });
        } catch (error) {
          console.error("Error fetching customer:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCustomer();
    }
  }, [customerId, apiCall]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${data?.firstname}?`)) {
      try {
        await apiCall({
          endpoint: `/v1/customers/${customerId}`,
          method: "delete",
          successMessage: "Customer deleted successfully!",
        });
        setIsOpen(false);
        refreshTable();
      } catch (error) {
        console.error("Customer deletion failed:", error);
      }
    }
  };

  const dropDownList = {
    items: ["Edit Customer Details", "Delete Customer"],
    onClickLink: (index: number) => {
      if (index === 0) setEditMode(true);
      if (index === 1) handleDelete();
    },
    defaultStyle: true,
    showCustomButton: true,
  };

  return (
    <Modal
      layout="right"
      bodyStyle="pb-44"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      rightHeaderComponents={
        editMode ? (
          <p
            className="text-xs text-textDarkGrey font-semibold cursor-pointer"
            onClick={() => setEditMode(false)}
          >
            Cancel Edit
          </p>
        ) : (
          <button className="flex items-center justify-center w-[24px] h-[24px] bg-white border border-strokeGreyTwo rounded-full hover:bg-slate-100">
            <img
              src={editInputIcon}
              alt="Edit Button"
              width="15px"
              onClick={() => setEditMode(true)}
            />
          </button>
        )
      }
    >
      {isLoading ? (
        <LoadingSpinner parentClass="absolute top-[50%] w-full" />
      ) : (
        <div>
          {/* Header */}
          <header className="flex items-center justify-between bg-paleGrayGradientLeft p-4 border-b">
            <div className="flex items-center gap-1">
              <img src={userIcon} alt="Customer Icon" />
              <span className="text-xs font-bold text-textDarkGrey capitalize">
                {data?.firstname || "Customer Name"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon={callIcon} iconText="Call" />
              <Icon icon={messageIcon} iconText="Message" />
              <DropDown {...dropDownList} />
            </div>
          </header>

          {/* Tab Navigation */}
          <div className="w-full px-4 py-2">
            <div className="flex items-center p-0.5 w-max border-[0.6px] border-strokeGreyThree rounded-full">
              {tabs.map((tab, index) => (
                <span
                  key={index}
                  className={`group flex items-center justify-center gap-3 px-2 py-1 min-h-[24px] rounded-full text-xs font-medium hover:cursor-pointer ${
                    activeNav === index
                      ? "bg-primaryGradient text-white"
                      : "bg-white text-textGrey"
                  }`}
                  onClick={() => setActiveNav(index)}
                >
                  {tab}
                </span>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-2 p-2.5 border-[0.6px] border-[#8396E7] rounded-[20px]">
            <p className="flex items-center gap-1 pb-2 w-max text-xs text-textLightGrey font-medium">
              <img src={userIcon} alt="User" width="16px" /> PERSONAL DETAILS
            </p>
            <DetailComponent label="First Name" value={data?.firstname || "N/A"} />
            <DetailComponent label="Last Name" value={data?.lastname || "N/A"} />
            <DetailComponent label="Email" value={data?.email || "N/A"} />
            <DetailComponent label="Phone Number" value={data?.phonenumber || "N/A"} />
            <DetailComponent label="Address Type" value={data?.addresstype || "N/A"} />
            <DetailComponent label="Location" value={data?.location || "N/A"} />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CustomerModal;

const DetailComponent = ({
  label,
  value,
  parentClass = "",
  valueClass = "",
}: {
  label: string;
  value: string | number;
  parentClass?: string;
  valueClass?: string;
}) => {
  return (
    <div className={`flex justify-between ${parentClass}`}>
      <span className="text-xs font-medium text-textGrey">{label}</span>
      <span className={`text-xs font-semibold text-textDarkGrey ${valueClass}`}>{value}</span>
    </div>
  );
};
