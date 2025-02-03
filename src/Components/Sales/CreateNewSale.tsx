import React, { useState } from "react";
import { KeyedMutator } from "swr";
import { Modal } from "../ModalComponent/Modal";
import { z } from "zod";
import { useApiCall } from "@/utils/useApiCall";
import { ModalInput, SelectInput } from "../InputComponent/Input";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";
import { SaleStore } from "@/stores/SaleStore";
import SelectCustomerProductModal from "./SelectCustomerProductModal";
import roletwo from "../../assets/table/roletwo.svg";
import { observer } from "mobx-react-lite";
import ProductSaleDisplay from "./ProductSaleDisplay";
import SetExtraInfoModal from "./SetExtraInfoModal";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { toJS } from "mobx";

type CreateSalesType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allSalesRefresh: KeyedMutator<any>;
};

const formSchema = z.object({
  saleCategory: z.string().trim().min(3, "Sale Category is required"),
  customers: z.string().min(1, "Please select at least one customer"),
  products: z.array(z.string()).min(3, "Please select at least one product"),
});

type FormData = z.infer<typeof formSchema>;

const defaultFormData = {
  saleCategory: "",
  customers: "",
  products: [""],
};

const testProducts = [
  {
    productId: "P001",
    productCategory: "SHS",
    productName: "Wireless Mouse",
    productUnits: 50,
    productPrice: 2999.99,
    productImage: "https://example.com/images/wireless-mouse.jpg",
    productTag: "electronics",
  },
  {
    productId: "P002",
    productCategory: "EAAS",
    productName: "Running Shoes",
    productUnits: 120,
    productPrice: 6999.5,
    productImage: "https://example.com/images/running-shoes.jpg",
    productTag: "footwear",
  },
  {
    productId: "P003",
    productCategory: "SHS",
    productName: "Gaming Chair",
    productUnits: 30,
    productPrice: 24999.0,
    productImage: "https://example.com/images/gaming-chair.jpg",
    productTag: "furniture",
  },
];

export type ExtraInfoType = "parameters" | "miscellaneous" | "devices" | "";

type SaleItem = {
  productId: string;
  quantity: number;
  paymentMode: "INSTALLMENT" | "FULL_PAYMENT";
  discount: number;
  installmentDuration?: number;
  installmentStartingPrice?: number;
  devices: string[];
  miscellaneousPrices?: {
    [key: string]: number;
  };
  saleRecipient: {
    firstname: string;
    lastname: string;
    address: string;
    phone: string;
    email: string;
  };
};

type NextOfKinDetails = {
  fullName: string;
  relationship: string;
  phoneNumber: string;
  email: string;
  homeAddress: string;
  dateOfBirth: string;
  nationality: string;
};

type IdentificationDetails = {
  idType: string;
  idNumber: string;
  issuingCountry: string;
  issueDate: string;
  expirationDate: string;
  fullNameAsOnID: string;
  addressAsOnID: string;
};

type GuarantorDetails = {
  fullName: string;
  phoneNumber: string;
  email: string;
  homeAddress: string;
  identificationDetails: IdentificationDetails;
  dateOfBirth: string;
  nationality: string;
};

type SalePayload = {
  category: "PRODUCT" | "INVENTORY";
  customerId: string;
  bvn: string;
  saleItems: SaleItem[];
  nextOfKinDetails: NextOfKinDetails;
  identificationDetails: IdentificationDetails;
  guarantorDetails: GuarantorDetails;
};

const getSampleSalePayload = (): SalePayload => ({
  category: "PRODUCT",
  customerId: "605c72ef153207001f6480d",
  bvn: "1234567890",
  saleItems: [
    {
      productId: "507f191e810c19729de860ea",
      quantity: 1,
      paymentMode: "INSTALLMENT",
      discount: 5,
      installmentDuration: 6,
      installmentStartingPrice: 200,
      devices: ["device1", "device2"],
      miscellaneousPrices: {
        delivery: 20.5,
      },
      saleRecipient: {
        firstname: "John",
        lastname: "Doe",
        address: "123 Street, City, Country",
        phone: "+123456789",
        email: "john.doe@example.com",
      },
    },
  ],
  nextOfKinDetails: {
    fullName: "Jane Doe",
    relationship: "Mother",
    phoneNumber: "+2341234567890",
    email: "jane.doe@example.com",
    homeAddress: "123 Main Street, Lagos, Nigeria",
    dateOfBirth: "1990-01-01T00:00:00.000Z",
    nationality: "Nigeria",
  },
  identificationDetails: {
    idType: "Nin",
    idNumber: "123456789",
    issuingCountry: "Nigeria",
    issueDate: "1990-01-01T00:00:00.000Z",
    expirationDate: "2030-01-01T00:00:00.000Z",
    fullNameAsOnID: "John Doe",
    addressAsOnID: "456 Elm Street, Abuja, Nigeria",
  },
  guarantorDetails: {
    fullName: "John Smith",
    phoneNumber: "+2349876543210",
    email: "john.smith@example.com",
    homeAddress: "789 Oak Avenue, Abuja, Nigeria",
    identificationDetails: {
      idType: "Nin",
      idNumber: "987654321",
      issuingCountry: "Nigeria",
      issueDate: "1995-01-01T00:00:00.000Z",
      expirationDate: "2035-01-01T00:00:00.000Z",
      fullNameAsOnID: "John Smith",
      addressAsOnID: "789 Oak Avenue, Abuja, Nigeria",
    },
    dateOfBirth: "1985-05-15T00:00:00.000Z",
    nationality: "Nigeria",
  },
});

const CreateNewSale = observer(
  ({ isOpen, setIsOpen, allSalesRefresh }: CreateSalesType) => {
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
    const [extraInfoModal, setExtraInfoModal] = useState<ExtraInfoType>("");
    const [currentProductId, setCurrentProductId] = useState<string>("");

    const selectedCustomer = SaleStore.customer;
    const selectedProducts = SaleStore.products;

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

    const requestPayload = {
      category: formData.saleCategory,
      customerId: selectedCustomer?.customerId,
      bvn: "",
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

    const isFormFilled = formSchema.safeParse(formData).success;

    const getFieldError = (fieldName: string) => {
      return formErrors.find((error) => error.path[0] === fieldName)?.message;
    };

    console.log(
      "EXTRAINFO:",
      toJS(SaleStore.parameters),
      toJS(SaleStore.miscellaneousPrices),
      toJS(SaleStore.devices)
    );

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
                // isItemsSelected={selectedProducts.length > 0}
                isItemsSelected={testProducts.length > 0}
                itemsSelected={
                  <div className="flex flex-wrap items-center w-full gap-4">
                    {/* {selectedProducts?.map((data, index) => { */}
                    {testProducts?.map((data, index) => {
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
