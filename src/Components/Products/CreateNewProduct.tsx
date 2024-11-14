import React, { useState } from "react";
import { Modal } from "../ModalComponent/Modal";
// import { useApiCall, useGetRequest } from "../../utils/useApiCall";
import { KeyedMutator } from "swr";
import {
  Input,
  SelectInput,
  SelectMultipleInput,
} from "../InputComponent/Input";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";

interface CreatNewProductProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allProductsRefresh?: KeyedMutator<any>;
}

const CreateNewProduct: React.FC<CreatNewProductProps> = ({
  isOpen,
  setIsOpen,
  // allProductsRefresh,
}) => {
  // const { apiCall } = useApiCall();
  const [formData, setFormData] = useState({
    category: "",
    productName: "",
    inventory: [],
    paymentModes: [],
    sellingPrice: undefined,
    productImage: "",
  });
  const [loading, setLoading] = useState(false);

  // const { data: inventoryData, isLoading: inventoryLoading } = useGetRequest(
  //   "/v1/inventory",
  //   true,
  //   60000
  // );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (name: string, values: string[]) => {
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
      console.log(formData);
      // await apiCall({
      //   endpoint: "/v1/auth/add-product",
      //   method: "post",
      //   data: formData,
      //   successMessage: "Product created successfully!",
      // });
      setLoading(false);
      // await allProductsRefresh();
    } catch (error) {
      console.error("Product creation failed:", error);
      setLoading(false);
    } finally {
      setLoading(false);
      setIsOpen(false);
      setFormData({
        category: "",
        productName: "",
        inventory: [],
        paymentModes: [],
        sellingPrice: undefined,
        productImage: "",
      });
    }
  };

  const {
    category,
    productName,
    inventory,
    paymentModes,
    sellingPrice,
    productImage,
  } = formData;

  const isFormFilled =
    category ||
    productName ||
    inventory.length >= 1 ||
    paymentModes.length >= 1 ||
    sellingPrice ||
    productImage;

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
            New Product
          </h2>
        </div>
        <>
          <div className="flex flex-col items-center justify-center w-full px-4 gap-4 py-8">
            <SelectInput
              label="Product Category"
              name="category"
              options={[
                { label: "SHS", value: "shs" },
                { label: "EAAS", value: "eaas" },
                { label: "Rooftop", value: "rooftop" },
              ]}
              value={category}
              onChange={handleInputChange}
              required={true}
              placeholder="Select Product Category"
              style={`${
                isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
              }`}
            />
            <Input
              type="text"
              name="productName"
              label="PRODUCT NAME"
              value={productName}
              onChange={handleInputChange}
              placeholder="Product Name"
              required={true}
              style={`${
                isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
              }`}
            />
            <SelectInput
              label="Inventory"
              name="inventory"
              options={[
                { label: "Instalmental", value: "instalmental" },
                { label: "Single Deposit", value: "singleDesposit" },
              ]}
              value={inventory}
              onChange={handleInputChange}
              required={true}
              placeholder="Select Inventory"
              style={`${
                isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
              }`}
            />

            <SelectMultipleInput
              label="Payment Modes"
              options={[
                { label: "Instalmental", value: "instalmental" },
                { label: "Single Deposit", value: "singleDesposit" },
              ]}
              value={paymentModes}
              onChange={(values) =>
                handleMultiSelectChange("paymentModes", values)
              }
              placeholder="Select skills"
              required={true}
              style={`${
                isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
              }`}
            />

            <Input
              type="number"
              name="sellingPrice"
              label="SELLING PRICE"
              value={sellingPrice}
              onChange={handleInputChange}
              placeholder="Selling Price"
              required={true}
              style={`${
                isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
              }`}
            />
            <Input
              type="file"
              name="productImage"
              label="PRODUCT IMAGE"
              value={productImage}
              onChange={handleInputChange}
              placeholder="Product Image"
              required={true}
              style={`${
                isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
              }`}
            />
          </div>
          <ProceedButton
            type="submit"
            loading={loading}
            variant={isFormFilled ? "gradient" : "gray"}
          />
        </>
      </form>
    </Modal>
  );
};

export default CreateNewProduct;
