import React, { useState } from "react";
import { Modal } from "../ModalComponent/Modal";
// import { useApiCall, useGetRequest } from "../../utils/useApiCall";
import { KeyedMutator } from "swr";
import { FileInput, Input, SelectInput } from "../InputComponent/Input";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";

export type InventoryFormType =
  | "newInventory"
  | "newCategory"
  | "newSubCategory"
  | "newLocation";

interface CreatNewInventoryProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allInventoryRefresh?: KeyedMutator<any>;
  formType: InventoryFormType;
}

const defaultInventoryFormData = {
  className: "",
  category: "",
  subCategory: "",
  itemName: "",
  manufacturerName: "",
  dateOfManufacture: "",
  sku: "",
  numberOfStock: "",
  costPrice: "",
  salePrice: "",
  itemPicture: "",
};

const CreateNewInventory: React.FC<CreatNewInventoryProps> = ({
  isOpen,
  setIsOpen,
  // allInventoryRefresh,
  formType,
}) => {
  // const { apiCall } = useApiCall();
  const [formData, setFormData] = useState(defaultInventoryFormData);
  const [loading, setLoading] = useState(false);
  const [otherFormData, setOtherFormData] = useState({
    newCategory: "",
    newSubCategory: "",
    newLocation: "",
  });

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

  const handleSelectChange = (name: string, values: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: values,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (formType === "newInventory") {
      if (!formData) return;
    } else {
      if (!isOtherFormFilled) return;
    }
    try {
      if (formType === "newInventory") {
        console.log(formData);
      } else {
        console.log(isOtherFormFilled());
      }
      // await apiCall({
      //   endpoint: "/v1/auth/add-inventory",
      //   method: "post",
      //   data: formData,
      //   successMessage: "Product created successfully!",
      // });
      setLoading(false);
      // await allInventoryRefresh();
    } catch (error) {
      console.error("Product creation failed:", error);
      setLoading(false);
    } finally {
      setLoading(false);
      setIsOpen(false);
      if (formType === "newInventory") {
        setFormData(defaultInventoryFormData);
      } else {
        setOtherFormData({
          newCategory: "",
          newSubCategory: "",
          newLocation: "",
        });
      }
    }
  };

  const isFormFilled = Object.values(formData).some((value) => Boolean(value));
  const isOtherFormFilled = () => {
    switch (formType) {
      case "newCategory":
        return otherFormData.newCategory;
      case "newSubCategory":
        return otherFormData.newSubCategory;
      case "newLocation":
        return otherFormData.newLocation;
      default:
        break;
    }
  };

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
            New{" "}
            {formType === "newInventory"
              ? "Inventory"
              : formType === "newCategory"
              ? "Category"
              : formType === "newSubCategory"
              ? "Sub-Category"
              : "Location"}
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center w-full px-[2.5em] gap-4 py-8">
          {formType === "newInventory" ? (
            <>
              <SelectInput
                label="Class"
                options={[
                  { label: "Regular", value: "regular" },
                  { label: "Returned", value: "returned" },
                  { label: "Refurbished", value: "refurbished" },
                ]}
                value={formData.className}
                onChange={(selectedValue) =>
                  handleSelectChange("className", selectedValue)
                }
                required={true}
                placeholder="Choose Inventory Class"
                style={
                  isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                }
              />

              <SelectInput
                label="Category"
                options={[
                  { label: "Solar Panels", value: "solarPanels" },
                  { label: "Inverters", value: "inverters" },
                  { label: "Batteries", value: "batteries" },
                  { label: "Charge Controllers", value: "chargeControllers" },
                  { label: "Accessories", value: "accessories" },
                ]}
                value={formData.category}
                onChange={(selectedValue) =>
                  handleSelectChange("category", selectedValue)
                }
                required={true}
                placeholder="Choose Item Category"
                style={
                  isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                }
              />

              <SelectInput
                label="Sub-Category"
                options={[
                  { label: "Dry Cell", value: "dry-cell" },
                  { label: "Switch", value: "switch" },
                  { label: "Socket", value: "socket" },
                ]}
                value={formData.subCategory}
                onChange={(selectedValue) =>
                  handleSelectChange("subCategory", selectedValue)
                }
                required={true}
                placeholder="Choose Item Sub-Category"
                style={
                  isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                }
              />

              <Input
                type="text"
                name="itemName"
                label="Name"
                value={formData.itemName}
                onChange={handleInputChange}
                placeholder="Item Name"
                required={true}
                style={
                  isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                }
              />

              <Input
                type="text"
                name="manufacturerName"
                label="Manufacturer"
                value={formData.manufacturerName}
                onChange={handleInputChange}
                placeholder="Manufacturer Name"
                required={true}
                style={
                  isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                }
              />

              <Input
                type="date"
                name="dateOfManufacture"
                label="Date Of Manufacture"
                value={formData.dateOfManufacture}
                onChange={handleInputChange}
                placeholder="Date Of Manufacture"
                required={false}
                style={
                  isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                }
              />

              <Input
                type="text"
                name="sku"
                label="SKU"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="SKU"
                required={false}
                style={
                  isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                }
              />

              <Input
                type="number"
                name="numberOfStock"
                label="Number of Stock"
                value={formData.numberOfStock}
                onChange={handleInputChange}
                placeholder="Number of Stock"
                required={true}
                style={
                  isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                }
              />

              <Input
                type="number"
                name="costPrice"
                label="Cost Price"
                value={formData.costPrice}
                onChange={handleInputChange}
                placeholder="Cost of Item"
                required={true}
                style={
                  isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                }
              />

              <Input
                type="number"
                name="salePrice"
                label="Sale Price"
                value={formData.salePrice}
                onChange={handleInputChange}
                placeholder="Price of Item"
                required={true}
                style={
                  isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                }
              />

              <FileInput
                name="itemPicture"
                label="Item Picture"
                onChange={handleInputChange}
                required={false}
                placeholder="Item Picture"
                style={
                  isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                }
              />
            </>
          ) : (
            <Input
              type="text"
              name={
                formType === "newCategory"
                  ? "newCategory"
                  : formType === "newSubCategory"
                  ? "newSubCategory"
                  : "newLocation"
              }
              label={
                formType === "newCategory"
                  ? "Category"
                  : formType === "newSubCategory"
                  ? "Sub-Category"
                  : "Location"
              }
              value={isOtherFormFilled()}
              onChange={(e) =>
                setOtherFormData((prev) => ({
                  ...prev,
                  [formType === "newCategory"
                    ? "newCategory"
                    : formType === "newSubCategory"
                    ? "newSubCategory"
                    : "newLocation"]: e.target.value,
                }))
              }
              placeholder={`Enter a New ${
                formType === "newCategory"
                  ? "Category"
                  : formType === "newSubCategory"
                  ? "Sub-Category"
                  : "Location"
              }`}
              required={true}
              style={
                isOtherFormFilled() ? "border-strokeCream" : "border-strokeGrey"
              }
            />
          )}
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

export default CreateNewInventory;
