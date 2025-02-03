import React from "react";
import { formatNumberWithCommas } from "@/utils/helpers";
import { Tag } from "../Products/ProductDetails";
import {
  NairaSymbol,
  ProductTag,
  SimpleTag,
} from "../CardComponents/CardComponent";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { ExtraInfoType } from "./CreateNewSale";
import { SaleStore } from "@/stores/SaleStore";

const ProductDetailRow = ({
  label,
  value,
  isPrice = false,
}: {
  label: string;
  value: string | number;
  isPrice?: boolean;
}) => (
  <div className="flex items-center justify-between w-full">
    <Tag name={label} />
    <p
      className={`text-xs font-bold text-textDarkGrey ${
        isPrice ? "flex items-center gap-0.5" : ""
      }`}
    >
      {isPrice && <NairaSymbol color="#828DA9" />}
      {isPrice ? (
        formatNumberWithCommas(value)
      ) : label === "Product Category" ? (
        <ProductTag productTag={value} />
      ) : (
        value
      )}
    </p>
  </div>
);

const ExtraInfoSection = ({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) => (
  <div className="flex flex-col gap-2 w-full">
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center justify-between w-max gap-2">
        <p className="text-textDarkGrey text-sm font-semibold">{label}</p>
        <SimpleTag
          text={"SAVED"}
          dotColour="#00AF50"
          containerClass="bg-[#F6F8FA] text-success font-semibold px-2 py-1 border-[0.4px] border-strokeGreyThree rounded-full"
        />
      </div>
      <button
        type="button"
        className="text-sm font-semibold text-errorTwo"
        title={`Clear ${label}`}
        onClick={onClear}
      >
        Clear
      </button>
    </div>
  </div>
);

const ProductSaleDisplay = ({
  productData,
  onRemoveProduct,
  setExtraInfoModal,
}: {
  productData: {
    productId: string;
    productCategory: string;
    productName: string;
    productUnits: number;
    productPrice: number;
    productImage: string;
    productTag: string;
  };
  onRemoveProduct: (productId: string) => void;
  setExtraInfoModal: React.Dispatch<React.SetStateAction<ExtraInfoType>>;
}) => {
  const {
    productId,
    productCategory,
    productName,
    productUnits,
    productPrice,
  } = productData;

  const doesParamsExist = Boolean(
    SaleStore.parameters.find((p) => p.currentProductId === productId)
  );
  const miscellaneousCosts = SaleStore.miscellaneousPrices.find(
    (misc) => misc.currentProductId === productId
  )?.costs;
  const doesDevicesExist = Boolean(
    SaleStore.devices.find((d) => d.currentProductId === productId)
  );

  const extraInfoExist =
    doesParamsExist ||
    (miscellaneousCosts && Object.keys(miscellaneousCosts).length > 0) ||
    doesDevicesExist;

  return (
    <div className="flex flex-col gap-2 w-full p-2.5 border-[0.6px] border-strokeGreyThree rounded-[20px]">
      <ProductDetailRow label="Product Category" value={productCategory} />
      <ProductDetailRow label="Product Name" value={productName} />
      <ProductDetailRow label="Product Units" value={productUnits} />
      <ProductDetailRow label="Product Price" value={productPrice} isPrice />

      <div
        className={`flex flex-col w-full gap-2 bg-[#F9F9F9] p-3 border-[0.6px] border-strokeGreyThree ${
          extraInfoExist ? "rounded-[20px]" : "rounded-full"
        }`}
      >
        {doesParamsExist && (
          <ExtraInfoSection
            label="Parameters"
            onClear={() => SaleStore.removeParameter(productId)}
          />
        )}
        {miscellaneousCosts && Object.keys(miscellaneousCosts).length > 0 && (
          <ExtraInfoSection
            label="Miscellaneous Costs"
            onClear={() => SaleStore.removeMiscellaneousPrice(productId)}
          />
        )}
        {doesDevicesExist && (
          <ExtraInfoSection
            label="Devices"
            onClear={() => SaleStore.removeDevices(productId)}
          />
        )}

        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center justify-between w-max gap-1">
            {["parameters", "miscellaneous", "devices"].map((type) => (
              <div
                key={type}
                className={`flex items-center justify-center text-sm font-medium px-3 py-1 w-max rounded-full cursor-pointer transition-all
                  ${
                    type === "parameters"
                      ? "bg-primaryGradient text-white"
                      : "bg-white text-textDarkGrey border-[0.6px] border-strokeGreyTwo"
                  }
                  `}
                onClick={() => setExtraInfoModal(type as ExtraInfoType)}
              >
                {type === "parameters"
                  ? "Set Parameters"
                  : type === "miscellaneous"
                  ? "Set Miscellaneous Costs"
                  : "Link Device"}
              </div>
            ))}
          </div>
          <span
            className="flex items-center justify-center w-7 h-7 bg-white cursor-pointer border-[0.6px] border-strokeGreyTwo rounded-full transition-all hover:opacity-50"
            title="Remove Product"
            onClick={() => onRemoveProduct(productId)}
          >
            <RiDeleteBin5Fill color="#FC4C5D" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductSaleDisplay;
