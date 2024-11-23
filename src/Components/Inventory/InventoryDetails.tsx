import React, { useState } from "react";
import { Tag } from "../Products/ProductDetails";
import { SmallFileInput } from "../InputComponent/Input";
import { LuImagePlus } from "react-icons/lu";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";
import inventoryIcon from "../../assets/inventory/inventoryIcon.svg";
import { GoDotFill } from "react-icons/go";
import { formatDateTime, formatNumberWithCommas } from "@/utils/helpers";
import { NairaSymbol } from "../CardComponents/CardComponent";

type InventoryDetailsProps = {
  inventoryId: string | number;
  inventoryImage: string;
  inventoryName: string;
  inventoryClass: string;
  inventoryCategory: string;
  sku: string;
  manufacturerName: string;
  dateOfManufacture: string;
  numberOfStock: number;
  costPrice: number;
  salePrice: number;
  displayInput?: boolean;
  tagStyle: (value: string) => string;
};

const InventoryDetails: React.FC<InventoryDetailsProps> = ({
  inventoryId = "",
  inventoryImage = "",
  inventoryName = "",
  inventoryClass = "",
  inventoryCategory = "",
  sku = "",
  manufacturerName = "",
  dateOfManufacture = "",
  numberOfStock = 0,
  costPrice = 0,
  salePrice = 0,
  displayInput = false,
  tagStyle,
}) => {
  const [formData, setFormData] = useState({
    inventoryId,
    inventoryImage,
    inventoryName,
    inventoryClass,
    inventoryCategory,
    sku,
    manufacturerName,
    dateOfManufacture,
    numberOfStock,
    costPrice,
    salePrice,
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
        <p className="text-textDarkGrey text-xs font-bold">{inventoryId}</p>
      </div>

      <div className="flex items-center justify-between p-2.5 gap-2 bg-white border-[0.6px] border-strokeGreyThree rounded-[20px]">
        <Tag name="Product Picture" variant="ink" />
        {displayInput ? (
          <SmallFileInput
            name="productImage"
            onChange={handleChange}
            placeholder="Upload Image"
            required={false}
            iconRight={<LuImagePlus />}
          />
        ) : (
          <div className="flex items-center justify-center w-full p-2 max-w-[100px] h-[100px] gap-2 border-[0.6px] border-strokeCream rounded-full">
            <img
              src={inventoryImage}
              alt="Inventory Image"
              height={"100%"}
              className="rounded-full"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col p-2.5 gap-2 bg-white border-[0.6px] border-strokeGreyThree rounded-[20px]">
        <p className="flex gap-1 w-max text-textLightGrey text-xs font-medium pb-2">
          <img src={inventoryIcon} alt="Inventory Icon" /> ITEM DETAILS
        </p>
        <div className="flex items-center justify-between">
          <Tag name="Name" />
          {displayInput ? (
            <input
              type="text"
              name="inventoryName"
              value={formData.inventoryName}
              onChange={handleChange}
              required={true}
              placeholder="Enter Inventory Name"
              className="text-xs text-textDarkGrey px-2 py-1 w-full max-w-[160px] border-[0.6px] border-strokeGreyThree rounded-full"
            />
          ) : (
            <p className="text-xs font-bold text-textDarkGrey">
              {inventoryName}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Tag name="Class" variant="ink" />
          {displayInput ? (
            <select
              name="inventoryClass"
              value={formData.inventoryClass}
              onChange={handleChange}
              required={true}
              className="text-xs text-textDarkGrey px-2 py-1 w-full max-w-[160px] border-[0.6px] border-strokeGreyThree rounded-[10px]"
            >
              <option value="regular">Regular</option>
              <option value="returned">Returned</option>
              <option value="refurbished">Refurbished</option>
            </select>
          ) : (
            <span
              className={`${tagStyle(
                "regular"
              )} flex items-center justify-center gap-0.5 w-max px-2 h-[24px] text-xs uppercase rounded-full`}
            >
              <GoDotFill width={4} height={4} />
              {"regular"}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Tag name="Category" variant="ink" />
          {displayInput ? (
            <select
              name="inventoryCategory"
              value={formData.inventoryCategory}
              onChange={handleChange}
              required={true}
              className="text-xs text-textDarkGrey px-2 py-1 w-full max-w-[160px] border-[0.6px] border-strokeGreyThree rounded-[10px]"
            >
              <option value="solarPanel">Solar Panel</option>
              <option value="inverter">Inverter</option>
              <option value="battery">Batttery</option>
            </select>
          ) : (
            <span className="flex items-center justify-center bg-[#FEF5DA] gap-0.5 w-max px-2 h-[24px] text-textDarkBrown text-xs uppercase rounded-full">
              <GoDotFill width={4} height={4} />
              {inventoryCategory}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Tag name="SKU" />
          {displayInput ? (
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Enter SKU"
              required={false}
              className="text-xs text-textDarkGrey px-2 py-1 w-full max-w-[160px] border-[0.6px] border-strokeGreyThree rounded-full"
            />
          ) : (
            <p className="text-xs font-bold text-textDarkGrey">{sku}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col p-2.5 gap-2 bg-white border-[0.6px] border-strokeGreyThree rounded-[20px]">
        <p className="flex gap-1 w-max text-textLightGrey text-xs font-medium pb-2">
          <img src={inventoryIcon} alt="Inventory Icon" /> MANUFACTURERS DETAILS
        </p>
        <div className="flex items-center justify-between">
          <Tag name="Manufacturers Name" />
          {displayInput ? (
            <input
              type="text"
              name="manufacturerName"
              value={formData.manufacturerName}
              onChange={handleChange}
              placeholder="Enter Manufacturer Name"
              required={true}
              className="text-xs text-textDarkGrey px-2 py-1 w-full max-w-[160px] border-[0.6px] border-strokeGreyThree rounded-full"
            />
          ) : (
            <p className="text-xs font-bold text-textDarkGrey">
              {manufacturerName}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Tag name="Date Of Manufacture" />
          {displayInput ? (
            <input
              type="date"
              name="dateOfManufacture"
              value={formData.dateOfManufacture}
              onChange={handleChange}
              placeholder="Enter Date of Manufacture"
              required={false}
              className="text-xs text-textDarkGrey px-2 py-1 w-full max-w-[160px] border-[0.6px] border-strokeGreyThree rounded-full"
            />
          ) : (
            <p className="text-xs font-bold text-textDarkGrey">
              {formatDateTime("date", dateOfManufacture)}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col p-2.5 gap-2 bg-white border-[0.6px] border-strokeGreyThree rounded-[20px]">
        <p className="flex gap-1 w-max text-textLightGrey text-xs font-medium pb-2">
          <img src={inventoryIcon} alt="Inventory Icon" /> STOCK DETAILS
        </p>
        <div className="flex items-center justify-between">
          <Tag name="Number of Stock" />
          {displayInput ? (
            <input
              type="number"
              name="numberOfStock"
              value={formData.numberOfStock}
              onChange={handleChange}
              placeholder="Enter Number of Stock"
              required={true}
              className="text-xs text-textDarkGrey px-2 py-1 w-full max-w-[160px] border-[0.6px] border-strokeGreyThree rounded-full"
            />
          ) : (
            <p className="text-xs font-bold text-textDarkGrey">
              {formatNumberWithCommas(numberOfStock)}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Tag name="Cost of Stock" />
          {displayInput ? (
            <input
              type="number"
              name="costPrice"
              value={formData.costPrice}
              onChange={handleChange}
              placeholder="Enter Cost Price"
              required={true}
              className="text-xs text-textDarkGrey px-2 py-1 w-full max-w-[160px] border-[0.6px] border-strokeGreyThree rounded-full"
            />
          ) : (
            <p className="flex items-center justify-end gap-1 w-max text-xs font-bold text-textDarkGrey">
              <NairaSymbol color="#828DA9" />
              {formatNumberWithCommas(costPrice)}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Tag name="Price of Stock" />
          {displayInput ? (
            <input
              type="number"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleChange}
              placeholder="Enter Selling Price"
              required={true}
              className="text-xs text-textDarkGrey px-2 py-1 w-full max-w-[160px] border-[0.6px] border-strokeGreyThree rounded-full"
            />
          ) : (
            <p className="flex items-center justify-end gap-1 w-max text-xs font-bold text-textDarkGrey">
              <NairaSymbol color="#828DA9" />
              {formatNumberWithCommas(salePrice)}
            </p>
          )}
        </div>
      </div>

      {displayInput && (
        <div className="flex items-center justify-center w-full pt-5 pb-5">
          <ProceedButton type="submit" loading={loading} variant={"gray"} />
        </div>
      )}
    </form>
  );
};

export default InventoryDetails;
