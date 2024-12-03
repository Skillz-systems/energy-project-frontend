import LoadingSpinner from "../Loaders/LoadingSpinner";
import { useApiCall, useGetRequest } from "../../utils/useApiCall";
import roletwo from "../../assets/table/roletwo.svg";
import call from "../../assets/settings/call.svg";
import message from "../../assets/settings/message.svg";
import user from "../../assets/settings/user.svg";
import editInput from "../../assets/settings/editInput.svg";
import { useEffect, useState } from "react";
import { formatNumberWithSuffix } from "../../hooks/useFormatNumberWithSuffix";
import { GoDotFill } from "react-icons/go";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";
import { DropDown } from "../DropDownComponent/DropDown";
import { Modal } from "../LogoComponent/ModalComponent/Modal";

const UserModal = ({ isOpen, setIsOpen, userID, refreshTable, rolesList }) => {
  const { apiCall } = useApiCall();
  const { data, isLoading, error, mutate } = useGetRequest(
    `/v1/users/single/${userID}`,
    false
  );
  const [activeNav, setActiveNav] = useState<number>(0);
  const [formData, setFormData] = useState({
    firstname: data?.firstname || "",
    lastname: data?.lastname || "",
    email: data?.email || "",
    phone: data?.phone || "",
    location: data?.location || "",
  });
  const [designation, setDesignation] = useState<string>("");
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (data) {
      setFormData({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        location: data.location,
      });
    }
  }, [data]);

  const fieldLabels: { [key: string]: string } = {
    firstname: "First Name",
    lastname: "Last Name",
    email: "Email",
    phone: "Phone Number",
    location: "Location",
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Check for unsaved changes by comparing the form data with the initial userData
    if (data[name] !== value) {
      setUnsavedChanges(true);
    } else {
      setUnsavedChanges(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Remove all spaces from each field in formData
    if (formData) {
      Object.keys(formData).forEach((key) => {
        if (typeof formData[key] === "string") {
          formData[key] = formData[key].replace(/\s+/g, "");
        }
      });
    }

    if (designation) {
      try {
        await apiCall({
          endpoint: `/v1/roles/${data?.id}/assign`,
          method: "post",
          data: {
            roleId: designation,
          },
          successMessage: "",
        });
      } catch (error) {
        console.error(error);
      }
    }

    if (!formData) return;
    try {
      await apiCall({
        endpoint: `/v1/users/${data?.id}`,
        method: "patch",
        data: formData,
        successMessage: "User updated successfully!",
      });
      mutate();
      refreshTable();
      setUnsavedChanges(false);
      setErrorMessage("");
    } catch (error) {
      console.error("User update failed:", error);
    } finally {
      setLoading(false);
      setDisplayInput(false);
    }
  };

  const handleCancelClick = () => {
    if (unsavedChanges) {
      setErrorMessage(
        "You have unsaved changes. Please submit your changes before exiting edit mode."
      );
    } else {
      setDisplayInput(false);
      setErrorMessage("");

      setFormData({
        firstname: data?.firstname || "",
        lastname: data?.lastname || "",
        email: data?.email || "",
        phone: data?.phone || "",
        location: data?.location || "",
      });
      setDesignation(data?.role?.id || "");
    }
  };

  const handleCallClick = () => {
    const callURL = `tel:${data?.phone}`;
    window.open(callURL, "_self");
  };

  const handleWhatsAppClick = () => {
    const whatsappURL = `https://wa.me/${data?.phone}`;
    window.open(whatsappURL, "_blank");
  };

  const designationChanged = designation !== data?.role?.role;
  const isFormFilled = unsavedChanges || designationChanged;

  const deleteUserById = async () => {
    const confirmation = prompt(
      `Are you sure you want to delete ${data?.firstname} ${data?.lastname}. Enter "Yes" or "No".`,
      "No"
    );

    if (confirmation?.trim()?.toLowerCase() === "yes") {
      try {
        await apiCall({
          endpoint: `/v1/users/${data?.id}`,
          method: "delete",
          successMessage: "User deleted successfully!",
        });
        setIsOpen(false);
        refreshTable();
      } catch (error) {
        console.error("User deletion failed:", error);
      }
    } else {
      setIsOpen(false);
    }
  };

  const dropDownList = {
    items: ["Edit Staff Details", "Block Staff", "Delete Staff"],
    onClickLink: (index: number) => {
      switch (index) {
        case 0:
          setDisplayInput(true);
          break;
        case 1:
          console.log(index);
          break;
        case 2:
          deleteUserById();
          break;
        default:
          break;
      }
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
      leftHeaderComponents={
        isLoading ? null : (
          <>
            <p className="flex items-center justify-center gap-1 bg-[#F6F8FA] w-max px-2 py-1 text-xs text-[#007AFF] border-[0.4px] border-strokeGreyTwo rounded-full uppercase">
              <GoDotFill />
              {data?.role?.role}
            </p>
            <p
              className={`flex items-center justify-center gap-1 bg-[#F6F8FA] w-max px-2 py-1 text-xs ${
                data?.status.toLowerCase() === "active"
                  ? "text-success"
                  : "text-errorTwo"
              } border-[0.4px] border-strokeGreyTwo rounded-full uppercase`}
            >
              <GoDotFill />
              {data?.status}
            </p>
          </>
        )
      }
      rightHeaderComponents={
        displayInput ? (
          <p
            className="text-xs text-textDarkGrey font-semibold cursor-pointer"
            onClick={handleCancelClick}
            title="Cancel editing user details"
          >
            Cancel Edit
          </p>
        ) : (
          <button className="flex items-center justify-center w-[24px] h-[24px] bg-white border border-strokeGreyTwo rounded-full hover:bg-slate-100">
            <img
              src={editInput}
              alt="Edit Button"
              width="15px"
              onClick={() => setDisplayInput(true)}
            />
          </button>
        )
      }
    >
      {isLoading ? (
        <LoadingSpinner parentClass="absolute top-[50%] w-full" />
      ) : error ? (
        <div>Oops an error occured.</div>
      ) : (
        <div className="bg-white">
          <header className="flex items-center justify-between bg-paleGrayGradientLeft p-4 min-h-[64px] border-b-[0.6px] border-b-strokeGreyThree">
            <div className="flex items-center gap-1">
              <img src={roletwo} alt="Icon" />
              <span className="bg-[#EFF2FF] px-2 py-1 rounded-full text-xs font-bold text-textDarkGrey capitalize">
                {data.firstname} {data.lastname}
              </span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Icon icon={call} iconText="Call" handleClick={handleCallClick} />
              <Icon
                icon={message}
                iconText="Message"
                handleClick={handleWhatsAppClick}
              />
              <DropDown {...dropDownList} />
            </div>
          </header>
          <div className="w-full px-4 py-2">
            <div className="flex items-center p-0.5 w-max border-[0.6px] border-strokeGreyThree rounded-full">
              {["Staff Details", "Activity History", "Messages"].map(
                (item, index) => (
                  <span
                    key={index}
                    className={`group flex items-center justify-center gap-3 px-2 py-1 min-h-[24px] rounded-full text-xs font-medium hover:cursor-pointer ${
                      activeNav === index
                        ? "bg-primaryGradient text-white"
                        : "bg-white text-textGrey"
                    }`}
                    onClick={() => setActiveNav(index)}
                  >
                    {item}
                    {index === 2 ? (
                      <span
                        className={`flex items-center justify-center max-w-max px-1 border-[0.2px] text-xs rounded-full transition-all
                          ${
                            activeNav === index
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
          <div className="flex flex-col w-full px-4 py-4 gap-4">
            {activeNav === 0 ? (
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {errorMessage && (
                  <p className="text-errorTwo text-xs font-medium">
                    {errorMessage}
                  </p>
                )}
                <div className="p-2.5 border-[0.6px] border-[#8396E7] rounded-[20px]">
                  <p className="flex items-center gap-1 pb-2 w-max text-xs text-textLightGrey font-medium">
                    <img src={user} alt="User" width="16px" />
                    STAFF ID
                  </p>
                  <DetailComponent
                    label="User ID"
                    value={data.id}
                    parentClass="mb-2"
                  />
                  <div className="flex items-center justify-between bg-white w-full text-textDarkGrey text-xs rounded-full z-10 p-2.5 h-[44px] border-[0.6px] border-strokeGreyThree">
                    <span className="flex items-center justify-center bg-[#F6F8FA] text-textBlack text-xs p-2 h-[24px] rounded-full">
                      Designation
                    </span>
                    {!displayInput ? (
                      <span className="flex items-center justify-center bg-paleLightBlue text-textBlack font-semibold p-2 h-[24px] rounded-full capitalize text-xs">
                        {data.role.role}
                      </span>
                    ) : (
                      <select
                        name="role"
                        value={designation || data.role.id}
                        onChange={(e) => {
                          setDesignation(e.target.value);
                        }}
                        required={false}
                        className="px-2 py-1 w-full max-w-[160px] border-[0.6px] border-strokeGreyThree rounded-full"
                      >
                        {rolesList.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            className="capitalize"
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-2.5 border-[0.6px] border-[#8396E7] rounded-[20px]">
                  <p className="flex items-center gap-1 pb-2 w-max text-xs text-textLightGrey font-medium">
                    <img src={user} alt="User" width="16px" />
                    STAFF ID
                  </p>
                  {Object.entries(formData).map(([fieldName, fieldValue]) => (
                    <div
                      key={fieldName}
                      className="flex items-center justify-between bg-white w-full text-textDarkGrey text-xs rounded-full"
                    >
                      <span className="flex items-center justify-center bg-[#F6F8FA] text-textBlack text-xs p-2 h-[24px] rounded-full">
                        {fieldLabels[fieldName]}
                      </span>
                      {!displayInput ? (
                        <span className="text-xs font-bold text-textDarkGrey">
                          {fieldValue || "N/A"}
                        </span>
                      ) : (
                        <input
                          type="text"
                          name={fieldName}
                          value={fieldValue}
                          onChange={handleInputChange}
                          required={true}
                          placeholder={`Enter your ${fieldLabels[fieldName]}`}
                          className="px-2 py-1 w-full max-w-[160px] border-[0.6px] border-strokeGreyThree rounded-full"
                        />
                      )}
                    </div>
                  ))}
                </div>
                {displayInput ? (
                  <div className="flex items-center justify-center w-full pt-5 pb-5">
                    <ProceedButton
                      type="submit"
                      loading={loading}
                      variant={isFormFilled ? "gradient" : "gray"}
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between p-2 border-[0.6px] border-strokeGreyThree rounded-full">
                      <p className="bg-[#EFF2FF] px-2 py-1 text-xs text-[#3951B6] rounded-full">
                        Status
                      </p>
                      <p
                        className={`flex items-center justify-center gap-1 bg-[#F6F8FA] w-max px-2 py-1 text-xs border-[0.4px] border-strokeGreyTwo rounded-full uppercase ${
                          data?.status?.toLowerCase() === "active"
                            ? "text-success"
                            : "text-errorTwo"
                        }`}
                      >
                        <GoDotFill />
                        {data.status}
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-2 border-[0.6px] border-strokeGreyThree rounded-full">
                      <p className="bg-[#F6F8FA] px-2 py-1 text-xs text-textBlack rounded-full">
                        Last Login
                      </p>
                      <p className="text-textDarkGrey text-xs font-bold">
                        {data.lastLogin || "N/A"}
                      </p>
                    </div>
                  </>
                )}
              </form>
            ) : activeNav === 1 ? (
              <p className="text-textDarkGrey text-xs font-bold">
                No active history.
              </p>
            ) : (
              <p className="text-textDarkGrey text-xs font-bold">
                No messages available.
              </p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};


export default UserModal;

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

export const Icon = ({
  handleClick,
  icon,
  iconText,
}: {
  handleClick?: () => void;
  icon: string;
  iconText?: string;
}) => {
  return (
    <button
      className="flex items-center justify-center gap-1 w-max px-2 h-[32px] bg-white border-[0.2px] border-strokeGreyTwo rounded-full shadow-innerCustom transition-all hover:bg-gold"
      onClick={handleClick}
    >
      <img src={icon} alt={iconText} className="w-[16px] cursor-pointer" />
      {iconText ? (
        <p className="text-[10px] text-textBlack font-medium">{iconText}</p>
      ) : null}
    </button>
  );
};
