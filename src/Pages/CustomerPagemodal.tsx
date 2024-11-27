import React, { useEffect, useState } from "react";
import { Modal } from "@/Components/ModalComponent/ModalComponent/Modal";
import LoadingSpinner from "@/Components/Loaders/LoadingSpinner";
import { DropDown } from "@/Components/DropDownComponent/DropDown";
import { useApiCall, useGetRequest } from "@/utils/useApiCall";
import customerIcon from "../assets/table/customer.svg";
import callIcon from "../assets/settings/call.svg";
import messageIcon from "../assets/settings/message.svg";
import editInputIcon from "../assets/settings/editInput.svg";
import userIcon from "../assets/settings/user.svg";
import { Icon } from "@/Components/Settings/UserModal";

const CustomerModal = ({ isOpen, setIsOpen, customerId, refreshTable }) => {
    const { apiCall } = useApiCall();
    const { data, isLoading, error } = useGetRequest(
        `/v1/customers`,
        false
    );

    const [activeNav, setActiveNav] = useState(0);
    const [editMode, setEditMode] = useState(false);

    const tabs = [
        "Customer Details",
        "Product Details",
        "Registration History",
        "Contracts",
        "Transactions",
        "Tickets",
    ];

    useEffect(() => {
        // Fetch or reset data when modal opens
    }, [customerId]);

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${data?.name}?`)) {
            try {
                await apiCall({
                    endpoint: `/v1/customers/{id}`,
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
        onClickLink: (index) => {
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
                            <img src={customerIcon} alt="Customer Icon" />
                            <span className="text-xs font-bold text-textDarkGrey capitalize">
                                {data?.name || "Customer Name"}
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
                                    className={`group flex items-center justify-center gap-3 px-2 py-1 min-h-[24px] rounded-full text-xs font-medium hover:cursor-pointer ${activeNav === index
                                            ? "bg-primaryGradient text-white"
                                            : "bg-white text-textGrey"
                                        }`}
                                    onClick={() => setActiveNav(index)}
                                >
                                    {tab}
                                    {index === 2 && (
                                        <span
                                            className={`flex items-center justify-center max-w-max px-1 border-[0.2px] text-xs rounded-full transition-all ${activeNav === index
                                                    ? "bg-[#FEF5DA] text-textDarkBrown border-textDarkBrown"
                                                    : "bg-[#EAEEF2] text-textDarkGrey border-strokeGrey group-hover:bg-[#FEF5DA] group-hover:text-textDarkBrown group-hover:border-textDarkBrown"
                                                }`}
                                        >
                                            0
                                        </span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-2.5 border-[0.6px] border-[#8396E7] rounded- mb-2 ">
                        <DetailComponent
                            label="User ID"
                            value={data?.id || "N/A"}
                            parentClass="mb-2 "
                        />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-2 p-2.5 border-[0.6px] border-[#8396E7] rounded-[20px]">
                        <p className="flex items-center gap-1 pb-2 w-max text-xs text-textLightGrey font-medium">
                            <img src={userIcon} alt="User" width="16px" />
                            PERSONAL DETAILS
                        </p>
                        {Object.entries(data || {}).map(([key, value]) => (
                            <DetailComponent
                                key={key}
                                label={key.replace(/_/g, " ")}
                                value={data.id || "N/A"}
                            />
                        ))}
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
    parentClass,
    valueClass,
}: {
    label: string;
    value: string | number;
    parentClass?: string;
    valueClass?: string;
}) => {
    return (
        <div
            className={`${parentClass} flex items-center justify-between bg-white w-full text-textDarkGrey text-xs rounded-full`}
        >
            <span className="flex items-center justify-center bg-[#F6F8FA] text-textBlack text-xs p-2 h-[24px] rounded-full">
                {label}
            </span>
            <span className={`${valueClass} text-xs font-bold text-textDarkGrey`}>
                {value}
            </span>
        </div>
    );
};