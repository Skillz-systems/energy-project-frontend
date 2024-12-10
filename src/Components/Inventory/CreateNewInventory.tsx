import React, { useState } from "react";
// import { useApiCall, useGetRequest } from "../../utils/useApiCall";
import { KeyedMutator } from "swr";
import { FileInput, Input, SelectInput } from "../InputComponent/Input";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";
import { Modal } from "../ModalComponent/Modal";
import { useApiCall, useGetRequest } from "@/utils/useApiCall";
import { Category } from "../Products/CreateNewProduct";

export type InventoryFormType =
  | "newInventory"
  | "newCategory"
  | "newSubCategory";

interface CreatNewInventoryProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allInventoryRefresh: KeyedMutator<any>;
  formType: InventoryFormType;
}

interface InventoryFormData {
  className: string;
  category: string;
  subCategory: string;
  itemName: string;
  manufacturerName: string;
  dateOfManufacture: string;
  sku: string;
  numberOfStock: string;
  costPrice: string;
  salePrice: string;
  itemPicture: File | null;
}
const defaultInventoryFormData: InventoryFormData = {
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
  itemPicture: null,
};

const CreateNewInventory: React.FC<CreatNewInventoryProps> = ({
  isOpen,
  setIsOpen,
  allInventoryRefresh,
  formType,
}) => {
  const { apiCall } = useApiCall();
  const [formData, setFormData] = useState(defaultInventoryFormData);
  const [loading, setLoading] = useState(false);
  const [otherFormData, setOtherFormData] = useState({
    newCategory: "",
    parentId: "",
    newSubCategory: "",
  });

  const fetchInventoryCategories = useGetRequest(
    "/v1/inventory/categories",
    false
  );

  const handleInputChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "itemPicture" && files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        itemPicture: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (name: string, values: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: values,
      ...(name === "category" && { subCategory: "" }), // Clear subCategory if category changes
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formType === "newInventory") {
        if (!formData) return;

        // Create FormData instance for multipart/form-data
        const formSubmissionData = new FormData();

        // Append fields to FormData
        formSubmissionData.append("class", formData.className);
        formSubmissionData.append("inventoryCategoryId", formData.category);
        formSubmissionData.append(
          "inventorySubCategoryId",
          formData.subCategory
        );
        formSubmissionData.append("name", formData.itemName);
        formSubmissionData.append(
          "manufacturerName",
          formData.manufacturerName
        );
        formSubmissionData.append(
          "dateOfManufacture",
          formData.dateOfManufacture
        );
        formSubmissionData.append("sku", formData.sku);
        formSubmissionData.append("numberOfStock", formData.numberOfStock);
        formSubmissionData.append("costOfItem", formData.costPrice);
        formSubmissionData.append("price", formData.salePrice);

        if (formData.itemPicture instanceof File) {
          formSubmissionData.append("inventoryImage", formData.itemPicture);
        } else {
          alert("No Image Selected");
          return;
        }
        // Log the FormData entries to debug
        for (const pair of formSubmissionData.entries()) {
          console.log(pair[0], pair[1]);
        }

        await apiCall({
          endpoint: "/v1/inventory/create",
          method: "post",
          data: formSubmissionData,
          headers: { "Content-Type": "multipart/form-data" },
          successMessage: "Inventory created successfully!",
        });
      } else {
        const { newCategory, newSubCategory, parentId } = otherFormData;
        if (
          (formType === "newCategory" && !newCategory) ||
          (formType !== "newCategory" && (!parentId || !newSubCategory))
        ) {
          return;
        }

        const createCategoryData = (
          newCategory: string,
          newSubCategory?: string
        ) => ({
          categories: [
            {
              name: newCategory,
              ...(newSubCategory && {
                subCategories: [
                  {
                    name: newSubCategory,
                  },
                ],
              }),
            },
          ],
        });

        const createSubCategoryData = (
          newSubCategory: string,
          parentId: string
        ) => ({
          categories: [
            {
              name: newSubCategory,
              parentId: parentId,
            },
          ],
        });

        await apiCall({
          endpoint: "/v1/inventory/category/create",
          method: "post",
          data:
            formType === "newCategory"
              ? createCategoryData(newCategory, newSubCategory)
              : createSubCategoryData(newSubCategory, parentId),
          headers: { "Content-Type": "application/json" },
          successMessage: `Inventory ${
            formType === "newSubCategory" ? "Sub-" : ""
          }Category created successfully!`,
        });
      }
      setLoading(false);
      await allInventoryRefresh();
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
          parentId: "",
          newSubCategory: "",
        });
      }
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
            New{" "}
            {formType === "newInventory"
              ? "Inventory"
              : formType === "newCategory"
              ? "Category"
              : "Sub-Category"}
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center w-full px-[2.5em] gap-4 py-8">
          {formType === "newInventory" ? (
            <>
              <SelectInput
                label="Class"
                options={[
                  { label: "Regular", value: "REGULAR" },
                  { label: "Returned", value: "RETURNED" },
                  { label: "Refurbished", value: "REFURBISHED" },
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
                options={
                  fetchInventoryCategories.data?.map((category: Category) => ({
                    label: category.name,
                    value: category.id,
                  })) || [{ label: "", value: "" }]
                }
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

              <div
                style={{
                  width: "100%",
                  display: formData.category ? "block" : "none",
                  maxHeight: formData.category ? "300px" : "0",
                  transition: "max-height 0.3s ease-in-out",
                  visibility: formData.category ? "visible" : "hidden",
                  opacity: formData.category ? 1 : 0,
                  transitionProperty: "max-height, visibility, opacity",
                }}
              >
                <SelectInput
                  label="Sub-Category"
                  options={
                    fetchInventoryCategories.data
                      ?.find(
                        (category: Category) =>
                          category.id === formData.category
                      )
                      ?.children?.map((child: { name: any; id: any }) => ({
                        label: child.name,
                        value: child.id,
                      })) || []
                  }
                  value={formData.subCategory}
                  onChange={(selectedValue) =>
                    handleSelectChange("subCategory", selectedValue)
                  }
                  required={!!formData.category} // Required only if a category is selected
                  placeholder="Choose Item Sub-Category"
                  style={
                    isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                  }
                />
              </div>

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
                required={true}
                placeholder="Item Picture"
                style={
                  isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                }
              />
            </>
          ) : (
            <>
              {formType === "newCategory" ? (
                <Input
                  type="text"
                  name="newCategory"
                  label="Category"
                  value={otherFormData.newCategory}
                  onChange={(e) =>
                    setOtherFormData((prev) => ({
                      ...prev,
                      ["newCategory"]: e.target.value,
                    }))
                  }
                  placeholder="Enter a New Category"
                  required={true}
                  style={
                    otherFormData.newCategory || otherFormData.newSubCategory
                      ? "border-strokeCream"
                      : "border-strokeGrey"
                  }
                />
              ) : (
                <>
                  <SelectInput
                    label="Category"
                    options={
                      fetchInventoryCategories.data?.map(
                        (category: Category) => ({
                          label: category.name,
                          value: category.id,
                        })
                      ) || [{ label: "", value: "" }]
                    }
                    value={otherFormData.parentId}
                    onChange={(selectedValue) =>
                      setOtherFormData((prev) => ({
                        ...prev,
                        parentId: selectedValue,
                      }))
                    }
                    required={true}
                    placeholder="Choose Item Category"
                    style={
                      otherFormData.parentId || otherFormData.newSubCategory
                        ? "border-strokeCream"
                        : "border-strokeGrey"
                    }
                  />
                </>
              )}

              <Input
                type="text"
                name="newSubCategory"
                label="Sub-Category"
                value={otherFormData.newSubCategory}
                onChange={(e) =>
                  setOtherFormData((prev) => ({
                    ...prev,
                    ["newSubCategory"]: e.target.value,
                  }))
                }
                placeholder="Enter a New Sub-Category"
                required={formType === "newCategory" ? false : true}
                style={
                  otherFormData.newSubCategory ||
                  otherFormData.newCategory ||
                  otherFormData.parentId
                    ? "border-strokeCream"
                    : "border-strokeGrey"
                }
              />
            </>
          )}
        </div>
        <ProceedButton
          type="submit"
          loading={loading}
          variant={isFormFilled ? "gradient" : "gray"}
          disabled={formType === "newInventory" ? !isFormFilled : false}
        />
      </form>
    </Modal>
  );
};

export default CreateNewInventory;
