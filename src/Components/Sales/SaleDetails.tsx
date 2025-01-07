import { Tag } from "../Products/ProductDetails";
import { SaleDetailsType } from "./SalesDetailsModal";
import producticon from "../../assets/product-grey.svg";
import {
  NairaSymbol,
  NameTag,
  ProductTag,
} from "../CardComponents/CardComponent";
import { formatDateTime, formatNumberWithCommas } from "@/utils/helpers";
import customericon from "../../assets/customers/customericon.svg";
import creditcardicon from "../../assets/creditcardgrey.svg";

const SaleDetails = ({ data }: { data: SaleDetailsType }) => {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex items-center justify-between h-[44px] p-2.5 gap-2 bg-white border-[0.6px] border-strokeGreyThree rounded-full">
        <Tag name="Sale ID" />
        <p className="text-textDarkGrey text-xs font-bold">{data.saleId}</p>
      </div>

      <div className="flex flex-col p-2.5 gap-2 bg-white border-[0.6px] border-strokeGreyThree rounded-[20px]">
        <p className="flex gap-1 w-max text-textLightGrey text-xs font-medium pb-2">
          <img src={producticon} alt="Product Icon" /> PRODUCT DETAILS
        </p>
        <div className="flex items-center justify-between">
          <Tag name="Product Category" />
          <ProductTag productTag={data.productCategory} />
        </div>
        <div className="flex items-center justify-between">
          <Tag name="Product Name" />
          <p className="text-xs font-bold text-textDarkGrey">
            {data.productName}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Tag name="Payment Mode" />
          <div className="flex items-center justify-center gap-1 bg-[#F6F8FA] px-2 py-1 w-max border-[0.4px] border-strokeGreyTwo rounded-full">
            <p className="text-xs text-textDarkGrey font-semibold">
              {data.paymentMode}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Tag name="Price" />
          <div className="flex items-center justify-end w-max gap-1">
            <NairaSymbol />
            <p className="text-textDarkGrey text-xs font-bold">
              {formatNumberWithCommas(data.salePrice)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-2.5 gap-2 bg-white border-[0.6px] border-strokeGreyThree rounded-[20px]">
        <p className="flex gap-1 w-max text-textLightGrey text-xs font-medium pb-2">
          <img src={customericon} alt="Customer Icon" /> CUSTOMER DETAILS
        </p>
        <div className="flex items-center justify-between">
          <Tag name="Customer" />
          <p className="text-xs font-bold text-textDarkGrey">{data.customer}</p>
        </div>
        <div className="flex items-center justify-between">
          <Tag name="Installation Address" />
          <p className="text-xs font-bold text-textDarkGrey">{data.address}</p>
        </div>
      </div>

      <div className="flex flex-col p-2.5 gap-2 bg-white border-[0.6px] border-strokeGreyThree rounded-[20px]">
        <p className="flex gap-1 w-max text-textLightGrey text-xs font-medium pb-2">
          <img src={creditcardicon} alt="Card Icon" /> GENERAL DETAILS
        </p>
        <div className="flex items-center justify-between">
          <Tag name="Date Created" />
          <p className="text-xs font-bold text-textDarkGrey">
            {formatDateTime("date", data.datetime)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Tag name="Time Created" />
          <p className="text-xs font-bold text-textDarkGrey">
            {formatDateTime("time", data.datetime)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Tag name="Agent" />
          <NameTag name={data.agent} />
        </div>
      </div>
    </div>
  );
};

export default SaleDetails;
