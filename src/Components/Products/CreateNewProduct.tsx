import React, { useState } from "react";
import { Modal } from "../ModalComponent/Modal";
// import { useApiCall, useGetRequest } from "../../utils/useApiCall";
import { KeyedMutator } from "swr";
import {
  FileInput,
  Input,
  ModalInput,
  SelectInput,
  SelectMultipleInput,
} from "../InputComponent/Input";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";
import { LuImagePlus } from "react-icons/lu";
import SelectInventoryModal from "./SelectInventoryModal";
import { generateRandomProductInventoryEntries } from "../TableComponent/sampleData";
import { observer } from "mobx-react-lite";
import rootStore from "../../stores/rootStore";
import { CardComponent } from "../CardComponents/CardComponent";

interface CreatNewProductProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allProductsRefresh?: KeyedMutator<any>;
}

const CreateNewProduct: React.FC<CreatNewProductProps> = observer(
  ({
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
    const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);

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
        // Get the selected product IDs from the MobX store
        const selectedProductIds = rootStore.productStore.products.map(
          (product) => product.productId
        );

        // Create a new object with the form data and selected product IDs
        const submissionData = {
          ...formData,
          inventory: selectedProductIds,
        };
        console.log(submissionData);
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
        rootStore.productStore.emptyProducts();
      }
    };

    const selectedProducts = rootStore.productStore.products;

    const { category, productName, paymentModes, sellingPrice, productImage } =
      formData;

    const isFormFilled =
      category ||
      productName ||
      selectedProducts.length > 0 ||
      paymentModes.length >= 1 ||
      sellingPrice ||
      productImage;

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
                New Product
              </h2>
            </div>
            <>
              <div className="flex flex-col items-center justify-center w-full px-[2.5em] gap-4 py-8">
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
                    { label: "Instalmental", value: "instalmental" },
                    { label: "Single Deposit", value: "singleDesposit" },
                  ]}
                  value={paymentModes}
                  onChange={(values) =>
                    handleMultiSelectChange("paymentModes", values)
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
                  required={true}
                  placeholder="Upload Product Image"
                  style={
                    isFormFilled ? "border-strokeCream" : "border-strokeGrey"
                  }
                  iconRight={<LuImagePlus color="#828da9" />}
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
        <SelectInventoryModal
          isInventoryOpen={isInventoryOpen}
          setIsInventoryOpen={setIsInventoryOpen}
          listData={generateRandomProductInventoryEntries(20, 30, 40, 25, 60)}
        />
      </>
    );
  }
);

export default CreateNewProduct;
