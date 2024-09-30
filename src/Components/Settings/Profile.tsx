import React, { useState } from "react";
import lightCheckeredBg from "../../assets/lightCheckeredBg.png";
import role from "../../assets/table/role.svg";
import addButton from "../../assets/settings/addbutton.svg";
import editButton from "../../assets/settings/editbutton.svg";
import sampleButton from "../../assets/settings/samplebutton.svg";
import { MdCancel } from "react-icons/md";

const Profile = () => {
  const [displayInput, setDisplayInput] = useState<boolean>(false);

  const DetailComponent = ({
    label,
    name,
    value,
    required,
    readOnly,
    parentClass,
    valueClass,
  }: {
    label: string;
    name: string;
    value: string | number;
    required: boolean;
    readOnly: boolean;
    parentClass?: string;
    valueClass?: string;
  }) => (
    <div
      className={`${parentClass} flex items-center justify-between bg-white w-full text-textDarkGrey text-xs rounded-full`}
    >
      <span className="flex items-center justify-center bg-[#F6F8FA] text-textBlack text-xs p-2 h-[24px] rounded-full">
        {label}
      </span>
      {displayInput ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={() => {}}
          placeholder={`Enter your ${name}`}
          required={required}
          readOnly={readOnly}
          className="px-2 py-1 w-full max-w-[160px] border-[0.6px] border-strokeGreyThree rounded-full"
        />
      ) : value ? (
        <span className={`${valueClass} text-xs font-bold text-textDarkGrey`}>
          {value}
        </span>
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

  return (
    <form
      className="relative flex flex-col justify-end bg-white p-2 md:p-4 w-full max-w-[700px] min-h-[414px] rounded-[20px]"
      // onSubmit={}
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
      <div className="z-10 flex flex-col gap-4 mt-[60px] md:mt-[160px]">
        <DetailComponent
          label="User ID"
          name="userId"
          value={14020209}
          required={true}
          readOnly={true}
          parentClass="h-[44px] p-2.5 border-[0.6px] border-strokeGreyThree"
        />
        <div className="flex flex-col gap-2 p-2.5 w-full border-[0.6px] border-strokeGreyThree rounded-[20px]">
          <p className="flex gap-1 w-max text-xs text-textLightGrey font-medium pb-2">
            <img src={role} alt="Role Icon" width="16px" />
            YOUR DETAILS
          </p>
          <DetailComponent
            label="First Name"
            name="firstName"
            value={"John"}
            required={true}
            readOnly={false}
          />
          <DetailComponent
            label="Last Name"
            name="lastName"
            value={"Okor"}
            required={true}
            readOnly={false}
          />
          <DetailComponent
            label="Email"
            name="email"
            value={"JohnOkor@gmail.com"}
            required={true}
            readOnly={false}
          />
          <DetailComponent
            label="Phone Number"
            name="phoneNumber"
            value={"082636323"}
            required={true}
            readOnly={false}
          />
          <DetailComponent
            label="Address"
            name="address"
            value={""}
            required={false}
            readOnly={false}
          />
        </div>
        <DetailComponent
          label="Designation"
          name="designation"
          value={"Super Admin"}
          required={false}
          readOnly={false}
          parentClass="z-10 p-2.5 h-[44px] border-[0.6px] border-strokeGreyThree"
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
