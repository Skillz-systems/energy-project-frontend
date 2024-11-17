import React from "react";
import producticon from "../../assets/product-grey.svg";
import creditcardicon from "../../assets/creditcardgrey.svg";
import settingsicon from "../../assets/settings.svg";
import {
  NairaSymbol,
  NameTag,
  ProductTag,
} from "../CardComponents/CardComponent";
import { formatDateTime, formatNumberWithCommas } from "../../utils/helpers";

interface ProductDetailsProps {
  productId: string;
  productImage: string;
  productTag: string;
  productPrice: number;
  paymentModes: string[];
  datetime: string;
  name: string;
}

const Tag = ({ name, variant }: { name: string; variant?: string }) => {
  return (
    <p
      className={`flex items-center justify-center h-[24px] text-xs  p-2 rounded-full
    ${
      variant === "ink"
        ? "text-inkBlueTwo bg-paleLightBlue"
        : "text-textBlack bg-[#F6F8FA]"
    }
    `}
    >
      {name}
    </p>
  );
};

const ProductDetails: React.FC<ProductDetailsProps> = ({
  productId,
  productImage,
  productTag,
  productPrice,
  paymentModes,
  datetime,
  name,
}) => {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex items-center justify-between h-[44px] p-2.5 gap-2 bg-white border-[0.6px] border-strokeGreyThree rounded-full">
        <Tag name="Product ID" />
        <p className="text-textDarkGrey text-xs font-bold">{productId}</p>
      </div>
      <div className="flex items-center justify-between p-2.5 gap-2 bg-white border-[0.6px] border-strokeGreyThree rounded-[20px]">
        <Tag name="Product Picture" variant="ink" />
        <div className="flex items-center justify-center w-full p-2 max-w-[100px] h-[100px] gap-2 border-[0.6px] border-[#D3C6A1] rounded-full">
          <img
            src={productImage}
            alt="Product Image"
            height={"100%"}
            className="rounded-full"
          />
        </div>
      </div>
      <div className="flex flex-col p-2.5 gap-2 bg-white border-[0.6px] border-strokeGreyThree rounded-[20px]">
        <p className="flex gap-1 w-max text-textLightGrey text-xs font-medium pb-2">
          <img src={producticon} alt="Product Icon" /> PRODUCT DETAILS
        </p>
        <div className="flex items-center justify-between">
          <Tag name="Category" />
          <ProductTag productTag={productTag} />
        </div>
        <div className="flex items-center justify-between">
          <Tag name="Name" />
          <p className="text-xs font-bold text-textDarkGrey">
            {productTag}-{productId}
          </p>
        </div>
      </div>
      <div className="flex flex-col p-2.5 gap-2 bg-white border-[0.6px] border-strokeGreyThree rounded-[20px]">
        <p className="flex gap-1 w-max text-textLightGrey text-xs font-medium pb-2">
          <img src={creditcardicon} alt="Credit Card Icon" /> TRANSACTIONS
          DETAILS
        </p>
        <div className="flex items-center justify-between">
          <Tag name="Product Price" />
          <p className="flex items-center gap-0.5 text-xs font-bold text-textDarkGrey">
            <NairaSymbol color="#828DA9" />
            {formatNumberWithCommas(productPrice)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Tag name="Payment Mode(s)" variant="ink" />
          <div className="flex items-center w-max gap-1">
            {paymentModes.map((payment, index) => (
              <Tag key={index} name={payment} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col p-2.5 gap-2 bg-white border-[0.6px] border-strokeGreyThree rounded-[20px]">
        <p className="flex gap-1 w-max text-textLightGrey text-xs font-medium pb-2">
          <img src={settingsicon} alt="Settings Icon" /> GENERAL DETAILS
        </p>
        <div className="flex items-center justify-between">
          <Tag name="Date Created" />
          <p className="text-xs font-bold text-textDarkGrey">
            {formatDateTime("date", datetime)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Tag name="Time Created" />
          <p className="text-xs font-bold text-textDarkGrey">
            {formatDateTime("time", datetime)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Tag name="Created By" />
          <p className="text-xs font-bold text-textDarkGrey">
            <NameTag name={name} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
