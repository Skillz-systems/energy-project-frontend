import customer from "../assets/table/customer.svg";
import call from "../assets/settings/call.svg";
import message from "../assets/settings/message.svg";
import editInput from "../assets/settings/editInput.svg"
import userAvatar from "../../assets/settings/userAvatar.svg";
import { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import user from "../assets/settings/user.svg";
import { useApiCall, useGetRequest } from "@/utils/useApiCall";
import { Modal } from "@/Components/ModalComponent/ModalComponent/Modal";
import LoadingSpinner from "@/Components/Loaders/LoadingSpinner";
import ProceedButton from "@/Components/ProceedButtonComponent/ProceedButtonComponent";
import { Icon } from "@/Components/Settings/UserModal";
import { DropDown } from "@/Components/DropDownComponent/DropDown";
import { formatNumberWithSuffix } from "@/hooks/useFormatNumberWithSuffix";

const CustomerModal = ({
    isOpen,
    setIsOpen,
    customerId,
    refreshTable,
}) => {
    const { apiCall } = useApiCall();
    const { data, isLoading, error, mutate } = useGetRequest(
        `/v1/customers/single/${customerId}`,
        false
    );


    const [status, setStatus] = useState(data?.status || "Inactive");
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [activeNav, setActiveNav] = useState<number>(0);

    const [formData, setFormData] = useState({
        firstname: data?.firstname || "",
        lastname: data?.lastname || "",
        email: data?.email || "",
        phoneNumber: data?.phone || "",
        address: data?.address || "",
        addressType: data?.addressType || "",
    });
     
    const fieldLabels: { [key: string]: string } = {
        firstname: "First Name",
        lastname: "Last Name",
        email: "Email",
        phoneNumber: "Phone Number",   
        address: "Address",
        addressType: "Address Type"
      };



    useEffect(() => {

    }, []);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUnsavedChanges(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await apiCall({
                endpoint: `/v1/customers/${data?.id}`,
                method: "patch",

                successMessage: "Customer updated successfully!",
            });
            mutate();
            refreshTable();
            setUnsavedChanges(false);
        } catch (error) {
            console.error("Customer update failed:", error);
        } finally {
            setLoading(false);
            setEditMode(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${data?.name}?`)) {
            try {
                await apiCall({
                    endpoint: `/v1/customers/${data?.id}`,
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
                            src={editInput}
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
                // ) : error ? (
                //  <div>Oops, an error occurred.</div>
            ) : (
                <div>
                    <header className="flex items-center justify-between bg-paleGrayGradientLeft p-4 border-b">
                        <div className="flex items-center gap-1 ">
                            <img src={customer} alt="Customer Icon" />
                            <span className="text-xs font-bold text-textDarkGrey capitalize">
                                {data?.name || "Highpriest"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon icon={call} iconText="Call" />
                            <Icon icon={message} iconText="Message" />
                            <DropDown {...dropDownList} />
                        </div>
                    </header>
                    <div className="w-full px-4 py-2">
                        <div className="flex items-center p-0.5 w-max border-[0.6px] border-strokeGreyThree rounded-full">
                            {["Customer Details", "Product Details", "Registration History", "Contracts", "Transactions", "Tickets"].map(
                                (item, index) => (
                                    <span
                                        key={index}
                                        className={`group flex items-center justify-center gap-3 px-2 py-1 min-h-[24px] rounded-full text-xs font-medium hover:cursor-pointer ${activeNav === index
                                            ? "bg-primaryGradient text-white"
                                            : "bg-white text-textGrey"
                                            }`}
                                        onClick={() => setActiveNav(index)}
                                    >
                                        {item}
                                        {index === 2 ? (
                                            <span
                                                className={`flex items-center justify-center max-w-max px-1 border-[0.2px] text-xs rounded-full transition-all
                          ${activeNav === index
                                                        ? "bg-[#FEF5DA] text-textDarkBrown border-textDarkBrown"
                                                        : "bg-[#EAEEF2] text-textDarkGrey border-strokeGrey group-hover:bg-[#FEF5DA] group-hover:text-textDarkBrown group-hover:border-textDarkBrown"
                                                    }`}
                                            >
                                                {formatNumberWithSuffix(0)}
                                            </span>
                                        ) : null}
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                    <div className="p-2.5 border-[0.6px] border-[#8396E7] rounded-[20px] mb-2">
                        <p className="flex items-center gap-1 pb-2 w-max text-xs text-textLightGrey font-medium">
                            <img src={user} alt="User" width="16px" />
                            USER ID
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 p-2.5 border-[0.6px] border-[#8396E7] rounded-[20px]">
                        <p className="flex items-center gap-1 pb-2 w-max text-xs text-textLightGrey font-medium">
                            <img src={user} alt="User" width="16px" />
                            Personal Details
                        </p>
                        {Object.entries(formData).map(([fieldName,]) => (
                            <div
                                key={fieldName}
                                className="flex items-center justify-between bg-white w-full text-textDarkGrey text-xs rounded-full"
                            >
                                <span className="flex items-center justify-center bg-[#F6F8FA] text-textBlack text-xs p-2 h-[24px] rounded-full">
                                    {fieldLabels[fieldName]}
                                </span>
                                
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default CustomerModal;

