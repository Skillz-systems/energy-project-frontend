import React, { useState } from "react";
// import { Modal } from "../ModalComponent/Modal";
import { useApiCall, useGetRequest } from "../../utils/useApiCall";
import { KeyedMutator } from "swr";
import {
  FileInput,
  Input,
  ModalInput,
  SelectInput,
  SelectMultipleInput,
} from "../InputComponent/Input";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";
import SelectInventoryModal from "./SelectInventoryModal";
import { observer } from "mobx-react-lite";
import rootStore from "../../stores/rootStore";
import { CardComponent } from "../CardComponents/CardComponent";
import { Modal } from "@/Components/ModalComponent/Modal";

export type ProductFormType = "newProduct" | "newCategory";

interface CreatNewProductProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refreshTable?: KeyedMutator<any>;
  formType?: ProductFormType;
}

export type Category = {
  id: string;
  name: string;
  parent: string | null;
  parentId: string | null;
  type: "INVENTORY" | "PRODUCT";
  createdAt: string;
  updatedAt: string;
  children: Category[];
};

interface OtherSubmissonData {
  name: string;
  parentId?: string;
  type: string;
}

interface FormData {
  category: string;
  productName: string;
  inventory: string[];
  paymentModes: string[];
  sellingPrice: string;
  productImage: File | null;
}

const defaultFormData: FormData = {
  category: "",
  productName: "",
  inventory: [],
  paymentModes: [],
  sellingPrice: "",
  productImage: null,
};

const CreateNewProduct: React.FC<CreatNewProductProps> = observer(
  ({ isOpen, setIsOpen, refreshTable, formType }) => {
    const { apiCall } = useApiCall();
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [loading, setLoading] = useState(false);
    const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
    const [otherFormData, setOtherFormData] = useState({
      categoryName: "",
    });

    const fetchAllProductCategories = useGetRequest(
      "/v1/products/categories/all",
      true,
      60000
    );

    // const { data: inventoryData, isLoading: inventoryLoading } = useGetRequest(
    //   "/v1/inventory",
    //   true,
    //   60000
    // );

    const handleInputChange = (e: {
      target: { name: any; value: any; files: any };
    }) => {
      const { name, value, files } = e.target;
      if (name === "productImage" && files && files.length > 0) {
        setFormData((prev) => ({
          ...prev,
          [name]: files[0],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    };

    const handleSelectChange = (name: string, values: string | string[]) => {
      setFormData((prev) => ({
        ...prev,
        [name]: values,
      }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      try {
        if (formType === "newProduct") {
          if (!formData) return;

          // Create FormData instance for multipart/form-data
          const formSubmissionData = new FormData();

          // Append fields to FormData
          formSubmissionData.append("name", formData.productName);
          formSubmissionData.append("price", formData.sellingPrice);
          formSubmissionData.append(
            "paymentModes",
            formData.paymentModes.join(",")
          );
          formSubmissionData.append("categoryId", formData.category);
          rootStore.productStore.products.forEach((product) => {
            formSubmissionData.append("inventoryBatchId", product.productId);
          });

          if (formData.productImage instanceof File) {
            formSubmissionData.append("productImage", formData.productImage);
          } else {
            alert("No Image");
            return;
          }

          // Make the API call
          await apiCall({
            endpoint: "/v1/products",
            method: "post",
            data: formSubmissionData,
            headers: { "Content-Type": "multipart/form-data" },
            successMessage: "Product created successfully!",
          });
        } else {
          if (!otherFormData.categoryName) return;

          const submissionData: OtherSubmissonData = {
            name: otherFormData.categoryName,
            type: "PRODUCT",
          };

          await apiCall({
            endpoint: "/v1/products/create-category",
            method: "post",
            data: submissionData,
            successMessage: "Product category created successfully!",
          });
        }

        setLoading(false);
        await refreshTable!();
      } catch (error) {
        console.error("Product creation failed:", error);
      } finally {
        setLoading(false);
        setIsOpen(false);

        if (formType === "newProduct") {
          setFormData(defaultFormData);
          rootStore.productStore.emptyProducts();
        } else {
          setOtherFormData({
            categoryName: "",
          });
        }
      }
    };

    const selectedProducts = rootStore.productStore.products;
    const { category, productName, paymentModes, sellingPrice } = formData;
    const isFormFilled =
      Object.values(formData).some((value) =>
        Array.isArray(value) ? value.length > 0 : Boolean(value)
      ) || selectedProducts.length > 0;

    return (
      <>
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
                New Product {formType === "newCategory" && "Category"}
              </h2>
            </div>
            <div className="flex flex-col items-center justify-center w-full px-[2.5em] gap-4 py-8">
              {formType === "newProduct" ? (
                <>
                  <SelectInput
                    label="Product Category"
                    options={
                      fetchAllProductCategories.data?.map(
                        (category: Category) => ({
                          label: category.name,
                          value: category.id,
                        })
                      ) || [{ label: "", value: "" }]
                    }
                    value={category}
                    onChange={(selectedValue) =>
                      handleSelectChange("category", selectedValue)
                    }
                    required={true}
                    placeholder="Select Product Category"
                    style={
                      isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                    }
                  />

                  <Input
                    type="text"
                    name="productName"
                    label="PRODUCT NAME"
                    value={productName}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                    required={true}
                    style={
                      isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                    }
                  />

                  <ModalInput
                    type="button"
                    name="inventory"
                    label="INVENTORY"
                    onClick={() => setIsInventoryOpen(true)}
                    placeholder="Select Inventory"
                    required={true}
                    style={
                      isFormFilled || selectedProducts.length > 0
                        ? "border-strokeCream"
                        : "border-strokeGrey"
                    }
                    isItemsSelected={selectedProducts.length > 0}
                    itemsSelected={
                      <div className="flex flex-wrap items-center w-full gap-4">
                        {selectedProducts?.map((data, index) => {
                          return (
                            <CardComponent
                              key={`${data.productId}-${index}`}
                              variant={"inventoryTwo"}
                              productId={data.productId}
                              productImage={data.productImage}
                              productTag={data.productTag}
                              productName={data.productName}
                              productPrice={data.productPrice}
                              productUnits={data.productUnits}
                              readOnly={true}
                              onRemoveProduct={(productId) =>
                                rootStore.productStore.removeProduct(productId)
                              }
                            />
                          );
                        })}
                      </div>
                    }
                  />

                  <SelectMultipleInput
                    label="Payment Modes"
                    options={[
                      { label: "Single Deposit", value: "Single Deposit" },
                      { label: "Instalmental", value: "Instalmental" },
                    ]}
                    value={paymentModes}
                    onChange={(values) =>
                      handleSelectChange("paymentModes", values)
                    }
                    placeholder="Select Payment Modes"
                    required={true}
                    style={
                      isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                    }
                  />

                  <Input
                    type="number"
                    name="sellingPrice"
                    label="SELLING PRICE"
                    value={sellingPrice}
                    onChange={handleInputChange}
                    placeholder="Selling Price"
                    required={true}
                    style={
                      isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                    }
                  />

                  <FileInput
                    name="productImage"
                    label="PRODUCT IMAGE"
                    onChange={handleInputChange}
                    required={false}
                    placeholder="Upload Product Image"
                    style={
                      isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                    }
                  />
                </>
              ) : (
                <Input
                  type="text"
                  name="categoryName"
                  label="Product Category Name"
                  value={otherFormData.categoryName}
                  onChange={(e) =>
                    setOtherFormData({ categoryName: e.target.value })
                  }
                  placeholder="Product Category Name"
                  required={true}
                  style={
                    otherFormData.categoryName
                      ? "border-strokeCream"
                      : "border-strokeGrey"
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
        <SelectInventoryModal
          isInventoryOpen={isInventoryOpen}
          setIsInventoryOpen={setIsInventoryOpen}
        />
      </>
    );
  }
);

export default CreateNewProduct;
