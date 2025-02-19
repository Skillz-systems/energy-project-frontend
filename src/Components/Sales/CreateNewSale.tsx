import React, { useCallback, useEffect, useState } from "react";
import { KeyedMutator } from "swr";
import { Modal } from "../ModalComponent/Modal";
import { z } from "zod";
import { useApiCall } from "@/utils/useApiCall";
import { Input, ModalInput, SelectInput } from "../InputComponent/Input";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";
import { SaleStore } from "@/stores/SaleStore";
import SelectCustomerProductModal from "./SelectCustomerProductModal";
import roletwo from "../../assets/table/roletwo.svg";
import { observer } from "mobx-react-lite";
import ProductSaleDisplay from "./ProductSaleDisplay";
import SetExtraInfoModal from "./SetExtraInfoModal";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { formSchema, defaultSaleFormData } from "./salesSchema";
import { capitalizeFirstLetter } from "@/utils/helpers";

type CreateSalesType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allSalesRefresh: KeyedMutator<any>;
};

type FormData = z.infer<typeof formSchema>;

export type ExtraInfoType =
  | "parameters"
  | "miscellaneous"
  | "devices"
  | "recipient"
  | "identification"
  | "nextOfKin"
  | "guarantor"
  | "";

const CreateNewSale = observer(
  ({ isOpen, setIsOpen, allSalesRefresh }: CreateSalesType) => {
    const { apiCall } = useApiCall();
    const [formData, setFormData] = useState<FormData>(defaultSaleFormData);
    const [loading, setLoading] = useState(false);
    const [isCustomerProductModalOpen, setIsCustomerProductModalOpen] =
      useState<boolean>(false);
    const [modalType, setModalType] = useState<"customer" | "product">(
      "customer"
    );
    const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);
    const [apiError, setApiError] = useState<string | Record<string, string[]>>(
      ""
    );
    const [extraInfoModal, setExtraInfoModal] = useState<ExtraInfoType>("");
    const [currentProductId, setCurrentProductId] = useState<string>("");

    const selectedCustomer = SaleStore.customer;
    const selectedProducts = SaleStore.products;

    const resetFormErrors = (name: string) => {
      setFormErrors((prev) => prev.filter((error) => error.path[0] !== name));
      setApiError("");
    };

    const handleSelectChange = (name: string, values: string | string[]) => {
      setFormData((prev) => ({
        ...prev,
        [name]: values,
      }));
      resetFormErrors(name);
    };

    const getPayload = useCallback(() => {
      const payload = {
        category: SaleStore.category,
        customerId: SaleStore.customer?.customerId,
        saleItems: SaleStore.getTransformedSaleItems(),
        bvn: formData.bvn,
      };
      return payload;
    }, [formData]);

    const handleInputChange = (name: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      resetFormErrors(name);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
        const validatedData = formSchema.parse(getPayload());
        const response = await apiCall({
          endpoint: "/v1/sales/create",
          method: "post",
          data: validatedData,
          successMessage: "Sale created successfully!",
        });
        await allSalesRefresh();
        const redirectLink = response?.data?.link;
        if (redirectLink) window.open(redirectLink, "_blank");
        setIsOpen(false);
        SaleStore.purgeStore();
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          setFormErrors(error.issues);
        } else {
          const message =
            error?.response?.data?.error ||
            "Sale Creation Failed: Internal Server Error";
          setApiError(message);
        }
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (loading && apiError) setApiError("");
    }, [getPayload, apiError, loading]);

    const getIsFormFilled = () => {
      return formSchema.safeParse(getPayload()).success;
    };

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
          size="large"
        >
          <form
            className="flex flex-col items-center bg-white"
            onSubmit={handleSubmit}
            noValidate
          >
            <div
              className={`flex items-center justify-center px-4 w-full min-h-[64px] border-b-[0.6px] border-strokeGreyThree ${
                getIsFormFilled()
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
                options={[{ label: "Product", value: "PRODUCT" }]}
                value={formData.category}
                onChange={(selectedValue) => {
                  handleSelectChange("category", selectedValue);
                  SaleStore.addUpdateCategory(selectedValue as "PRODUCT");
                }}
                required={true}
                placeholder="Select Sale Category"
                errorMessage={getFieldError("category")}
              />
              <ModalInput
                type="button"
                name="customerId"
                label="CUSTOMER"
                onClick={() => {
                  setIsCustomerProductModalOpen(true);
                  setModalType("customer");
                }}
                placeholder="Select Customer"
                required={true}
                isItemsSelected={Boolean(selectedCustomer?.customerId)}
                itemsSelected={
                  <div className="w-full">
                    {selectedCustomer?.customerId && (
                      <div className="relative flex items-center gap-1 w-max">
                        <img src={roletwo} alt="Icon" width="30px" />
                        <span className="bg-[#EFF2FF] px-3 py-1.5 rounded-full text-xs font-bold text-textDarkGrey capitalize">
                          {selectedCustomer?.customerName}
                        </span>
                        <span
                          className="flex items-center justify-center w-7 h-7 bg-white cursor-pointer border-[0.6px] border-strokeGreyTwo rounded-full transition-all hover:opacity-50"
                          title="Remove Customer"
                          onClick={SaleStore.removeCustomer}
                        >
                          <RiDeleteBin5Fill color="#FC4C5D" />
                        </span>
                      </div>
                    )}
                  </div>
                }
                errorMessage={
                  !SaleStore.doesCustomerExist
                    ? "Failed to fetch customers"
                    : getFieldError("customerId")
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
                        <ProductSaleDisplay
                          key={index}
                          productData={data}
                          onRemoveProduct={(productId) =>
                            SaleStore.removeProduct(productId)
                          }
                          setExtraInfoModal={(value) => {
                            setCurrentProductId(data.productId);
                            setExtraInfoModal(value);
                          }}
                          getIsFormFilled={getIsFormFilled}
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
              {SaleStore.doesSaleItemHaveInstallment() && (
                <Input
                  type="text"
                  name="bvn"
                  label="BANK VERIFICATION NUUMBER"
                  value={formData.bvn as string}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                    if (numericValue.length <= 11) {
                      handleInputChange(e.target.name, numericValue);
                    }
                  }}
                  placeholder="Enter 11 digit BVN"
                  required={false}
                  errorMessage={getFieldError("bvn")}
                  maxLength={11}
                />
              )}

              {apiError !== "" && typeof apiError === "string" ? (
                <div className="p-3 mt-4 border border-red-500 rounded-md bg-red-50">
                  <p className="text-sm text-red-600">{apiError}</p>
                </div>
              ) : (
                Object.keys(apiError).length > 0 && (
                  <div className="p-3 mt-4 border border-red-500 rounded-md bg-red-50">
                    {Object.entries(apiError).map(([key, errors]) => (
                      <p key={key} className="text-sm text-red-600">
                        <strong>{capitalizeFirstLetter(key)}:</strong>{" "}
                        {errors.join(", ")}
                      </p>
                    ))}
                  </div>
                )
              )}

              <ProceedButton
                type="submit"
                loading={loading}
                variant={getIsFormFilled() ? "gradient" : "gray"}
                disabled={!getIsFormFilled()}
              />
            </div>
          </form>
        </Modal>
        <SelectCustomerProductModal
          isModalOpen={isCustomerProductModalOpen}
          setModalOpen={setIsCustomerProductModalOpen}
          modalType={modalType}
        />
        {extraInfoModal === "" ? null : (
          <SetExtraInfoModal
            extraInfoModal={extraInfoModal}
            setExtraInfoModal={setExtraInfoModal}
            currentProductId={currentProductId}
          />
        )}
      </>
    );
  }
);

export default CreateNewSale;
