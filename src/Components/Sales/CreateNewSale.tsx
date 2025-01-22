import React, { useState } from "react";
import { KeyedMutator } from "swr";
import { Modal } from "../ModalComponent/Modal";
import { z } from "zod";
import { useApiCall } from "@/utils/useApiCall";
import { ModalInput, SelectInput } from "../InputComponent/Input";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";
import { SaleStore } from "@/stores/SaleStore";
import { CardComponent } from "../CardComponents/CardComponent";
import SelectCustomerProductModal from "./SelectCustomerProductModal";

type CreateSalesType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allSalesRefresh: KeyedMutator<any>;
};

const formSchema = z.object({
  saleCategory: z.string().trim().min(3, "Sale Category is required"),
  customers: z.array(z.string()).min(3, "Please select at least one customer"),
  products: z.array(z.string()).min(3, "Please select at least one product"),
});

type FormData = z.infer<typeof formSchema>;

const defaultFormData = {
  saleCategory: "",
  customers: [""],
  products: [""],
};

const CreateNewSale = ({
  isOpen,
  setIsOpen,
  allSalesRefresh,
}: CreateSalesType) => {
  const { apiCall } = useApiCall();
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [isCustomerProductModalOpen, setIsCustomerProductModalOpen] =
    useState<boolean>(false);
  const [modalType, setModalType] = useState<"customer" | "product">(
    "customer"
  );
  const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const resetFormErrors = (name: string) => {
    // Clear the error for this field when the user starts typing
    setFormErrors((prev) => prev.filter((error) => error.path[0] !== name));
    setApiError(null);
  };

  const handleSelectChange = (name: string, values: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: values,
    }));
    resetFormErrors(name);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiCall({
        endpoint: "/v1/sale/create",
        method: "post",
        data: formData,
        successMessage: "Sale created successfully!",
      });
      await allSalesRefresh();
      setIsOpen(false);
      setFormData(defaultFormData);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        setFormErrors(error.issues);
      } else {
        const message =
          error?.response?.data?.message || "Internal Server Error";
        setApiError(`Sale creation failed: ${message}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedCustomers = SaleStore.customers;
  const selectedProducts = SaleStore.products;
  const isFormFilled = formSchema.safeParse(formData).success;

  const getFieldError = (fieldName: string) => {
    return formErrors.find((error) => error.path[0] === fieldName)?.message;
  };

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
          noValidate
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
              New Sale
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center w-full px-[2.5em] gap-4 py-8">
            <SelectInput
              label="Sale Category"
              options={[
                { label: "Inventory", value: "INVENTORY" },
                { label: "Product", value: "PRODUCT" },
              ]}
              value={formData.saleCategory}
              onChange={(selectedValue) =>
                handleSelectChange("saleCategory", selectedValue)
              }
              required={true}
              placeholder="Select Sale Category"
              errorMessage={getFieldError("saleCategory")}
            />
            <ModalInput
              type="button"
              name="customers"
              label="CUSTOMER"
              onClick={() => {
                setIsCustomerProductModalOpen(true);
                setModalType("customer");
              }}
              placeholder="Select Customer"
              required={true}
              isItemsSelected={selectedCustomers.length > 0}
              itemsSelected={
                <div className="flex flex-wrap items-center w-full gap-4">
                  {selectedCustomers?.map((data, index) => {
                    return (
                      // <CardComponent
                      //   key={`${data.customerId}-${index}`}
                      //   variant={"inventoryTwo"}
                      //   customerId={data.customerId}
                      //   customerName={data.customerName}
                      //   readOnly={true}
                      //   onRemoveCustomer={(customerId) =>
                      //     SaleStore.removeCustomer(customerId)
                      //   }
                      // />
                      <></>
                    );
                  })}
                </div>
              }
              errorMessage={
                !SaleStore.doesCustomersExist
                  ? "Failed to fetch customers"
                  : getFieldError("customers")
              }
            />
            <ModalInput
              type="button"
              name="products"
              label="PRODUCTS"
              onClick={() => {
                setIsCustomerProductModalOpen(true);
                setModalType("product");
              }}
              placeholder="Select Product"
              required={true}
              isItemsSelected={selectedProducts.length > 0}
              itemsSelected={
                <div className="flex flex-wrap items-center w-full gap-4">
                  {selectedProducts?.map((data, index) => {
                    return (
                      <CardComponent
                        key={`${data.productId}-${index}`}
                        variant={"inventoryOne"}
                        productId={data.productId}
                        productImage={data.productImage}
                        productTag={data.productTag}
                        productName={data.productName}
                        productPrice={data.productPrice}
                        productUnits={data.productUnits}
                        readOnly={true}
                        onRemoveProduct={(productId) =>
                          SaleStore.removeProduct(productId)
                        }
                      />
                    );
                  })}
                </div>
              }
              errorMessage={
                !SaleStore.doesProductCategoryExist
                  ? "Failed to fetch products"
                  : getFieldError("products")
              }
            />
            {apiError && (
              <div className="text-errorTwo text-sm mt-2 text-center font-medium w-full">
                {apiError}
              </div>
            )}
            <ProceedButton
              type="submit"
              loading={loading}
              variant={isFormFilled ? "gradient" : "gray"}
              disabled={!isFormFilled}
            />
          </div>
        </form>
      </Modal>
      <SelectCustomerProductModal
        isModalOpen={isCustomerProductModalOpen}
        setModalOpen={setIsCustomerProductModalOpen}
        modalType={modalType}
      />
    </>
  );
};

export default CreateNewSale;
