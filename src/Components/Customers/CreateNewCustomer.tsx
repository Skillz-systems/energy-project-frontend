import React, { useState, useEffect } from "react";
import { useApiCall } from "@/utils/useApiCall";
import LoadingSpinner from "../Loaders/LoadingSpinner";
import { Input, } from "../InputComponent/Input";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";
import { Modal } from "../ModalComponent/Modal";


const defaultFormData = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  addressType: "", 
  location: "",
};

const CreateNewCustomerModal = ({
  isOpen,
  setIsOpen,
  allAddressTypesLoading,
  addressTypesList,
  allCustomersRefresh,
}) => {
  const { apiCall } = useApiCall();
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState<boolean>(false);



  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!formData) return;

    try {
      await apiCall({
        endpoint: "/v1/customers/create",
        method: "post",
        data: formData,
        successMessage: "Customer created successfully!",
      });
      setLoading(false);
      await allCustomersRefresh();
    } catch (error) {
      setLoading(false);
    }

    setIsOpen(false);
    setFormData(defaultFormData);
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
        {allAddressTypesLoading ? (
          <LoadingSpinner parentClass="absolute top-[50%] w-full" />
        ) : (
          <>
            <div className="flex flex-col items-center justify-center w-full px-4 gap-4 py-8">
              <Input
                type="text"
                name="firstname"
                label="FIRST NAME"
                value={formData.firstname}
                onChange={handleInputChange}
                placeholder="First Name"
                required={true}
                style={`${isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                  }`}
              />
              <Input
                type="text"
                name="lastname"
                label="LAST NAME"
                value={formData.lastname}
                onChange={handleInputChange}
                placeholder="Last Name"
                required={true}
                style={`${isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                  }`}
              />
              <Input
                type="email"
                name="email"
                label="EMAIL"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required={true}
                style={`${isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                  }`}
              />
              <Input
                type="text"
                name="phone"
                label="PHONE NUMBER"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                required={true}
                style={`${isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                  }`}
              />

              <Input
                type="text"
                name="addressType" 
                label="Address Type"
                value={formData.addressType}
                onChange={handleInputChange}
                placeholder="Address Type"
                required={true}
                style={`${isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"}`}
              />

              <Input
                type="text"
                name="location"
                label="LOCATION"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Location"
                required={true}
                style={`${isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                  }`}
              />
            </div>
            <ProceedButton
              type="submit"
              loading={loading}
              variant={isFormFilled ? "gradient" : "gray"}
            />
          </>
        )}
      </form>
    </Modal>
  );
};

export default CreateNewCustomerModal;
