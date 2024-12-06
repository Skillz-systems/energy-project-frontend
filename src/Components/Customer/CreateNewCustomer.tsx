import { useApiCall } from "@/utils/useApiCall";
import React, { useState } from "react";
import { KeyedMutator } from "swr";
import { Modal } from "../ModalComponent/Modal";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";
import { Input, SelectInput } from "../InputComponent/Input";

interface CreatNewCustomerProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allCustomerRefresh: KeyedMutator<any>;
}

const CreateNewCustomer = ({
  isOpen,
  setIsOpen,
  allCustomerRefresh,
}: CreatNewCustomerProps) => {
  const { apiCall } = useApiCall();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    addressType: "",
    location: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, values: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: values,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!formData) return;

    try {
      const newData = {
        ...formData,
        phone: formData.phone.replace(/\s+/g, ""),
      };
      await apiCall({
        endpoint: "/v1/customers/create",
        method: "post",
        data: newData,
        successMessage: "Customer created successfully!",
      });

      await allCustomerRefresh();
      setLoading(false);
      setIsOpen(false);
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        address: "",
        addressType: "",
        location: "",
      });
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isFormFilled = Object.values(formData).some((value) => Boolean(value));

  return (
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
        <div className="flex flex-col items-center justify-center w-full px-[2.5em] gap-4 py-8">
          <Input
            type="text"
            name="firstname"
            label="FIRST NAME"
            value={formData.firstname}
            onChange={handleInputChange}
            placeholder="First Name"
            required={true}
            style={`${isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"}`}
          />
          <Input
            type="text"
            name="lastname"
            label="LAST NAME"
            value={formData.lastname}
            onChange={handleInputChange}
            placeholder="Last Name"
            required={true}
            style={`${isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"}`}
          />
          <Input
            type="email"
            name="email"
            label="EMAIL"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required={true}
            style={`${isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"}`}
          />
          <Input
            type="text"
            name="phone"
            label="PHONE"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
            required={true}
            style={`${isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"}`}
          />
          <SelectInput
            label="Address Type"
            options={[
              { label: "Home", value: "HOME" },
              { label: "Work", value: "WORK" },
            ]}
            value={formData.addressType}
            onChange={(selectedValue) =>
              handleSelectChange("addressType", selectedValue)
            }
            required={false}
            placeholder="Choose Address Type"
            style={isFormFilled ? "border-strokeCream" : "border-strokeGrey"}
          />
          <Input
            type="text"
            name="location"
            label="Address"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Address"
            required={false}
            style={`${isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"}`}
          />
        </div>
        <ProceedButton
          type="submit"
          loading={loading}
          variant={isFormFilled ? "gradient" : "gray"}
        />
      </form>
    </Modal>
  );
};

export default CreateNewCustomer;
