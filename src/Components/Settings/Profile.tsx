import { useState } from "react";
import lightCheckeredBg from "../../assets/lightCheckeredBg.png";
import role from "../../assets/table/role.svg";
import addButton from "../../assets/settings/addbutton.svg";
import editButton from "../../assets/settings/editbutton.svg";
import { MdCancel } from "react-icons/md";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";
import { useApiCall } from "../../utils/useApiCall";
import useTokens from "../../hooks/useTokens";
import Cookies from "js-cookie";

const Profile = () => {
  const userData = useTokens();
  const { apiCall } = useApiCall();
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    firstname: userData.firstname || "",
    lastname: userData.lastname || "",
    email: userData.email || "",
    phone: userData.phone || "",
    location: userData.location || "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    if (userData[name] !== value) {
      setUnsavedChanges(true);
    } else {
      setUnsavedChanges(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!formData) return;
    try {
      await apiCall({
        endpoint: "/v1/users",
        method: "patch",
        data: formData,
        successMessage: "User updated successfully!",
      });

      // Update the cookies with the new user data
      const updatedUserData = {
        ...userData,
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
      };

      Cookies.set("userData", JSON.stringify(updatedUserData));
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
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        email: userData.email || "",
        phone: userData.phone || "",
        location: userData.location || "",
      });
    }
  };

  const isFormFilled = unsavedChanges;

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

  return (
    <form
      className="relative flex flex-col justify-end bg-white p-2 md:p-4 w-full max-w-[700px] min-h-[414px] rounded-[20px]"
      onSubmit={handleSubmit}
    >
      <img
        src={lightCheckeredBg}
        alt="Light Checkered Background"
        className="absolute top-0 left-0 w-full"
      />
      <div className="z-10 flex justify-end">
        {!displayInput ? (
          <img
            src={editButton}
            alt="Edit Button"
            className="w-[24px] h-[24px] hover:cursor-pointer hover:opacity-80"
            onClick={() => setDisplayInput(true)}
          />
        ) : (
          <button
            type="button"
            onClick={handleCancelClick}
            className="flex items-center justify-center w-[24px] h-[24px] bg-white border border-errorTwo rounded-full hover:opacity-80"
          >
            <MdCancel className="text-errorTwo" />
          </button>
        )}
      </div>
      <div className="z-10 flex flex-col gap-4 mt-[60px] md:mt-[80px]">
        {errorMessage && (
          <div className="z-10 text-errorTwo text-sm mb-4">{errorMessage}</div>
        )}
        <DetailComponent
          label="User ID"
          value={userData.id}
          parentClass="h-[44px] p-2.5 border-[0.6px] border-strokeGreyThree"
        />
        <div className="flex flex-col gap-2 p-2.5 w-full border-[0.6px] border-strokeGreyThree rounded-[20px]">
          <p className="flex gap-1 w-max text-xs text-textLightGrey font-medium pb-2">
            <img src={role} alt="Role Icon" width="16px" />
            YOUR DETAILS
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
                  {fieldValue || (
                    <img
                      src={addButton}
                      alt="Add Button"
                      width="24px"
                      className="cursor-pointer"
                      onClick={() => setDisplayInput(true)}
                    />
                  )}
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
        <DetailComponent
          label="Designation"
          value={userData.role.role}
          parentClass="z-10 p-2.5 h-[44px] border-[0.6px] border-strokeGreyThree"
          valueClass="flex items-center justify-center bg-paleLightBlue text-textBlack font-semibold p-2 h-[24px] rounded-full capitalize"
        />
        <div className="flex items-center justify-center w-full pt-10 pb-5">
          <ProceedButton
            type="submit"
            loading={loading}
            variant={isFormFilled ? "gradient" : "gray"}
          />
        </div>
      </div>
    </form>
  );
};

export default Profile;
