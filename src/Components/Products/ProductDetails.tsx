import React, { useState } from "react";
import producticon from "../../assets/product-grey.svg";
import creditcardicon from "../../assets/creditcardgrey.svg";
import settingsicon from "../../assets/settings.svg";
import {
  NairaSymbol,
  NameTag,
  ProductTag,
} from "../CardComponents/CardComponent";
import { formatDateTime, formatNumberWithCommas } from "../../utils/helpers";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";

interface ProductDetailsProps {
  productId: string;
  productImage: string;
  productTag: string;
  productPrice: number;
  paymentModes: string[];
  datetime: string;
  name: string;
  displayInput?: boolean;
}

const Tag = ({ name, variant }: { name: string; variant?: string }) => {
  return (
    <p
      className={`flex items-center justify-center h-[24px] text-xs p-2 rounded-full ${
        variant === "ink"
          ? "text-inkBlueTwo bg-paleLightBlue"
          : "text-textBlack bg-[#F6F8FA]"
      }`}
    >
      {name}
    </p>
  );
};

const ProductDetails: React.FC<ProductDetailsProps> = ({
  productId = "",
  productImage = "",
  productTag = "",
  productPrice = 0,
  paymentModes = [],
  datetime = "",
  name = "",
  displayInput = false,
}) => {
  const [formData, setFormData] = useState({
    productId,
    productImage: "",
    productTag,
    productPrice,
    paymentModes,
    productName: `${productTag}-${productId}`,
  });
  const [loading, setLoading] = useState<boolean>(false);
  // const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Check for unsaved changes by comparing the form data with the initial userData
    // if (data[name] !== value) {
    //   setUnsavedChanges(true);
    // } else {
    //   setUnsavedChanges(false);
    // }
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.selectedOptions;
    const values = Array.from(options, (option) => option.value);
    setFormData((prevData) => ({
      ...prevData,
      paymentModes: values,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Submitted Data:", formData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
      <div className="flex items-center justify-between h-[44px] p-2.5 gap-2 bg-white border-[0.6px] border-strokeGreyThree rounded-full">
        <Tag name="Product ID" />
        <p className="text-textDarkGrey text-xs font-bold">
          {formData.productId}
        </p>
      </div>

      <div className="flex items-center justify-between p-2.5 gap-2 bg-white border-[0.6px] border-strokeGreyThree rounded-[20px]">
        <Tag name="Product Picture" variant="ink" />
        {displayInput ? (
          <input
            type="file"
            name="productImage"
            value={formData.productImage}
            onChange={handleChange}
            className="px-2 py-1 w-full max-w-[160px] border-[0.6px] border-strokeGreyThree rounded-full"
            placeholder="Upload Product Image"
          />
        ) : (
          <div className="flex items-center justify-center w-full p-2 max-w-[100px] h-[100px] gap-2 border-[0.6px] border-[#D3C6A1] rounded-full">
            <img
              src={productImage}
              alt="Product Image"
              height={"100%"}
              className="rounded-full"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col p-2.5 gap-2 bg-white border-[0.6px] border-strokeGreyThree rounded-[20px]">
        <p className="flex gap-1 w-max text-textLightGrey text-xs font-medium pb-2">
          <img src={producticon} alt="Product Icon" /> PRODUCT DETAILS
        </p>
        <div className="flex items-center justify-between">
          <Tag name="Category" />
          {displayInput ? (
            <select
              name="productTag"
              value={formData.productTag}
              onChange={handleChange}
              className="text-xs text-textDarkGrey px-2 py-1 w-full max-w-[160px] border-[0.6px] border-strokeGreyThree rounded-full"
            >
              <option value="SHS">SHS</option>
              <option value="EAAS">EAAS</option>
              <option value="Rooftop">Rooftop</option>
            </select>
          ) : (
            <ProductTag productTag={productTag} />
          )}
        </div>
        <div className="flex items-center justify-between">
          <Tag name="Name" />
          {displayInput ? (
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter Product Name"
              className="text-xs text-textDarkGrey px-2 py-1 w-full max-w-[160px] border-[0.6px] border-strokeGreyThree rounded-full"
            />
          ) : (
            <p className="text-xs font-bold text-textDarkGrey">
              {productTag}-{productId}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col p-2.5 gap-2 bg-white border-[0.6px] border-strokeGreyThree rounded-[20px]">
        <p className="flex gap-1 w-max text-textLightGrey text-xs font-medium pb-2">
          <img src={creditcardicon} alt="Credit Card Icon" /> TRANSACTIONS
          DETAILS
        </p>
        <div className="flex items-center justify-between">
          <Tag name="Product Price" />
          {displayInput ? (
            <input
              type="number"
              name="productPrice"
              value={formData.productPrice}
              onChange={handleChange}
              placeholder="Enter Product Price"
              className="text-xs text-textDarkGrey px-2 py-1 w-full max-w-[160px] border-[0.6px] border-strokeGreyThree rounded-full"
            />
          ) : (
            <p className="flex items-center gap-0.5 text-xs font-bold text-textDarkGrey">
              <NairaSymbol color="#828DA9" />
              {formatNumberWithCommas(productPrice)}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Tag name="Payment Mode(s)" variant="ink" />
          {displayInput ? (
            <select
              multiple
              name="paymentModes"
              value={formData.paymentModes}
              onChange={handleMultiSelectChange}
              className="text-xs text-textDarkGrey px-2 py-1 w-full max-w-[160px] border-[0.6px] border-strokeGreyThree rounded-[10px]"
            >
              <option value="One-Time">One-Time</option>
              <option value="Instalmental">Instalmental</option>
            </select>
          ) : (
            <div className="flex items-center w-max gap-1">
              {paymentModes.map((payment, index) => (
                <Tag key={index} name={payment} />
              ))}
            </div>
          )}
        </div>
      </div>

      {displayInput ? (
        <div className="flex items-center justify-center w-full pt-5 pb-5">
          <ProceedButton
            type="submit"
            loading={loading}
            // variant={isFormFilled ? "gradient" : "gray"}
            variant={"gray"}
          />
        </div>
      ) : (
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
      )}
    </form>
  );
};

export default ProductDetails;
