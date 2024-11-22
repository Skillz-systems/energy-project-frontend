import { useState } from "react";
import editInput from "../../assets/settings/editInput.svg";
// import LoadingSpinner from "../Loaders/LoadingSpinner";
import { DropDown } from "../DropDownComponent/DropDown";
import TabComponent from "../TabComponent/TabComponent";
import ProductDetails from "./ProductDetails";
import InventoryDetails from "./InventoryDetails";
import StatsDetails from "./StatsDetails";
import CustomerDetails from "./CustomerDetails";
import { Modal } from "../ModalComponent/ModalComponent/Modal";
// import { useApiCall, useGetRequest } from "../../utils/useApiCall";

const ProductModal = ({
  isOpen,
  setIsOpen,
  // productID,
  // refreshTable,
  productData,
  inventoryData,
}) => {
  // const { apiCall } = useApiCall();
  // const { data, isLoading, error, mutate } = useGetRequest(
  //   `/v1/product/single/${productID}`,
  //   false
  // );

  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const [tabContent, setTabContent] = useState<string>("productDetails");

  const handleCancelClick = () => {
    setDisplayInput(false);
  };

  const dropDownList = {
    items: ["Edit Product", "Cancel Product"],
    onClickLink: (index: number) => {
      switch (index) {
        case 0:
          setDisplayInput(true);
          console.log("Edit Product");
          break;
        case 1:
          console.log("Cancel Product");
          break;
        default:
          break;
      }
    },
    defaultStyle: true,
    showCustomButton: true,
  };

  const tabNames = [
    { name: "Product Details", key: "productDetails", count: null },
    { name: "Stats", key: "stats", count: null },
    { name: "Inventory Details", key: "inventoryDetails", count: null },
    { name: "Customers", key: "customers", count: 0 },
  ];

  return (
    <Modal
      layout="right"
      size="large"
      bodyStyle="pb-44 overflow-auto"
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        setTabContent("productDetails");
      }}
      rightHeaderComponents={
        displayInput ? (
          <p
            className="text-xs text-textDarkGrey font-semibold cursor-pointer over"
            onClick={handleCancelClick}
            title="Cancel editing user details"
          >
            Cancel Editnvhh
          </p>
        ) : (
          <button
            className="flex items-center justify-center w-[24px] h-[24px] bg-white border border-strokeGreyTwo rounded-full hover:bg-slate-100"
            onClick={() => setDisplayInput(true)}
          >
            <img src={editInput} alt="Edit Button" width="15px" />
          </button>
        )
      }
    >
      {/* {isLoading ? (
        <LoadingSpinner parentClass="absolute top-[50%] w-full" />
      ) : error ? (
        <div>Oops, an error occurred: {error}</div>
      ) : ( */}
      <div className="bg-white">
        <header className="flex items-center justify-between bg-paleGrayGradientLeft p-4 min-h-[64px] border-b-[0.6px] border-b-strokeGreyThree">
          <p className="flex items-center justify-center bg-paleLightBlue w-max p-2 h-[24px] text-textBlack text-xs font-semibold rounded-full">
            {productData.productTag} - {productData.productId}
          </p>
          <div className="flex items-center justify-end gap-2">
            <DropDown {...dropDownList} />
          </div>
        </header>
        <div className="flex flex-col w-full gap-4 px-4 py-2">
          <TabComponent
            tabs={tabNames.map(({ name, key, count }) => ({
              name,
              key,
              count,
            }))}
            onTabSelect={(key) => setTabContent(key)}
          />
          {tabContent === "productDetails" ? (
            <ProductDetails {...productData} displayInput={displayInput} />
          ) : tabContent === "stats" ? (
            <StatsDetails />
          ) : tabContent === "inventoryDetails" ? (
            <InventoryDetails inventoryData={inventoryData} />
          ) : (
            <CustomerDetails />
          )}
        </div>
      </div>
      {/* )} */}
    </Modal>
  );
};

export default ProductModal;
