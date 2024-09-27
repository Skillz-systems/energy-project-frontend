import React, { useEffect, useState } from "react";
import { z } from "zod";
import lightCheckeredBg from "../../assets/lightCheckeredBg.png";
import role from "../../assets/table/role.svg";
import addButton from "../../assets/settings/addbutton.svg";
import editButton from "../../assets/settings/editbutton.svg";
import sampleButton from "../../assets/settings/samplebutton.svg";
import { useApiCall, useGetRequest } from "../../utils/useApiCall";
import { MdCancel } from "react-icons/md";
import { toast } from "react-toastify";

// Define validation schema using Zod
const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.string().optional(),
});

const Profile = () => {
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    designation: "",
  });

  const { apiCall } = useApiCall();

  // Fetch user details from the API
  const { data, error, isLoading } = useGetRequest("/user/details");

  useEffect(() => {
    if (data) {
      setFormData({
        userId: data.userId || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        designation: data.designation || "",
      });
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form data
    try {
      schema.parse(formData);
      await apiCall({
        endpoint: "/user/update",
        method: "post",
        data: formData,
        successMessage: "Profile updated successfully!",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => toast.error(err.message));
      } else {
        toast.error("An error occurred while updating your profile.");
      }
    }
  };

  const DetailComponent = ({
    label,
    name,
    value,
    required,
    readOnly,
  }: {
    label: string;
    name: string;
    value: string | number;
    required: boolean;
    readOnly: boolean;
  }) => (
    <div className="flex items-center justify-between bg-white w-full h-[44px] text-textDarkGrey text-xs p-2.5 border-[0.6px] border-strokeGreyThree rounded-full">
      <span className="flex items-center justify-center bg-[#F6F8FA] text-textBlack text-xs p-2 h-[24px] rounded-full">
        {label}
      </span>
      {displayInput ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleInputChange}
          placeholder={`Enter your ${name}`}
          required={required}
          readOnly={readOnly}
          className="px-2 py-1 w-full max-w-[160px] border-[0.6px] border-strokeGreyThree rounded-full"
        />
      ) : value ? (
        <span className="text-xs font-bold text-textDarkGrey">{value}</span>
      ) : (
        <img
          src={addButton}
          alt="Add Button"
          width="24px"
          className="cursor-pointer"
          onClick={() => setDisplayInput(true)}
        />
      )}
    </div>
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching user details</div>;

  return (
    <form
      className="relative flex flex-col justify-end bg-white p-4 w-full max-w-[700px] min-h-[414px] border-[0.6px] border-strokeGreyThree rounded-[20px]"
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
            className="w-[24px] h-[24px] hover:cursor-pointer"
            onClick={() => setDisplayInput(!displayInput)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setDisplayInput(!displayInput)}
            className="flex items-center justify-center w-[24px] h-[24px] bg-white border border-errorTwo rounded-full"
          >
            <MdCancel className="text-errorTwo" />
          </button>
        )}
      </div>
      <div className="z-10 flex flex-col gap-4 mt-[160px]">
        <DetailComponent
          label="User ID"
          name="userId"
          value={14020209}
          required={true}
          readOnly={true}
        />
        <div className="flex flex-col gap-2 p-2.5 w-full border-[0.6px] border-strokeGreyThree rounded-[20px]">
          <p className="flex gap-1 w-max text-xs text-textLightGrey font-medium pb-2">
            <img src={role} alt="Role Icon" width="16px" />
            YOUR DETAILS
          </p>
          <DetailComponent
            label="First Name"
            name="firstName"
            value={formData.firstName}
            required={true}
            readOnly={false}
          />
          <DetailComponent
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            required={true}
            readOnly={false}
          />
          <DetailComponent
            label="Email"
            name="email"
            value={formData.email}
            required={true}
            readOnly={false}
          />
          <DetailComponent
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            required={true}
            readOnly={false}
          />
          <DetailComponent
            label="Address"
            name="address"
            value={formData.address}
            required={false}
            readOnly={false}
          />
        </div>
        <DetailComponent
          label="Designation"
          name="designation"
          value="Super Admin"
          required={false}
          readOnly={false}
          parentClass="z-10"
          valueClass="flex items-center justify-center bg-paleLightBlue text-textBlack font-semibold p-2 h-[24px] rounded-full"
        />
        <div className="flex items-center justify-center w-full pt-10 pb-5">
          <button type="submit" className="cursor-pointer">
            <img src={sampleButton} alt="Submit" width="54px" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default Profile;
