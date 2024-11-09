import React, { useState } from "react";
import smile from "../../assets/table/smile.svg";
import ongoing from "../../assets/table/ongoing.svg";
import inventory from "../../assets/table/inventory.svg";
import customer from "../../assets/table/customer.svg";
import product from "../../assets/table/product.svg";
import checkers from "../../assets/table/checkers.svg";
import call from "../../assets/settings/call.svg";
import message from "../../assets/settings/message.svg";
import { GoDotFill } from "react-icons/go";
import { Icon } from "../Settings/UserModal";
import { DropDown } from "../DropDownComponent/DropDown";
import { formatDateTime, formatNumberWithCommas } from "../../utils/helpers";

export type CardComponentProps = {
  variant:
    | "agent"
    | "customer"
    | "transactions"
    | "sales"
    | "product-no-image"
    | "inventoryOne"
    | "inventoryTwo";
  handleCallClick?: () => void;
  handleWhatsAppClick?: () => void;
  dropDownList: {
    items: string[];
    onClickLink: (index: number) => void;
    defaultStyle: boolean;
    showCustomButton?: boolean;
  };
  name?: string;
  status?: string;
  onGoingSales?: number;
  inventoryInPossession?: number;
  sales?: number;
  registeredCustomers?: number;
  productTag?: string;
  productType?: string;
  paymentStatus?: "Completed" | "Successful" | "Defaulted";
  daysDue?: number;
  transactionId?: string;
  transactionStatus?: string;
  datetime?: string;
  transactionAmount?: number;
  saleId?: string | number;
  productStatus?: string;
  productId?: string;
  installment?: number;
  productPrice?: number;
  productImage?: string;
  productName?: string;
  productUnits?: number;
  onSelectProduct?: (productId: string | number, productUnits: number) => void;
};

const ProductTag = ({ productTag }: { productTag: string }) => {
  return (
    <p
      className={`flex items-center justify-center ${
        productTag === "EAAS"
          ? "bg-purpleBlue"
          : productTag === "SHS"
          ? "bg-pink"
          : "bg-paleYellow"
      } w-max text-textBlack text-[12px] font-normal px-1 border-[0.4px] border-strokeGreyTwo rounded-[40px]`}
    >
      {productTag}
    </p>
  );
};

const ProductTypeWithTag = ({
  productTag,
  productType,
  paymentStatus,
  daysDue,
}: {
  productTag?: string;
  productType?: string;
  paymentStatus?: "Completed" | "Successful" | "Defaulted" | any;
  daysDue?: number;
}) => {
  const paymentStatusColor = ["Completed", "Successful"].includes(paymentStatus)
    ? "text-success"
    : "text-errorTwo";
  return (
    <div
      className={`flex items-center justify-between ${
        paymentStatus ? "gap-0.5" : "gap-1"
      } bg-[#F6F8FA] w-max px-1.5 py-1 border-[0.4px] border-strokeGreyTwo rounded-full`}
    >
      {!paymentStatus ? (
        <>
          {productTag && <ProductTag productTag={productTag} />}
          <p className="text-textBlack text-xs uppercase">{productType}</p>
        </>
      ) : (
        <>
          <span className={paymentStatusColor}>
            <GoDotFill />
          </span>
          <p className={`text-xs uppercase ${paymentStatusColor}`}>
            {paymentStatus}
            {paymentStatus === "Defaulted" ? (
              <span>: {daysDue} DAYS</span>
            ) : null}
          </p>
        </>
      )}
    </div>
  );
};

const SimpleTag = ({
  text,
  dotColour,
  customIcon,
  containerClass,
}: {
  text: string | number;
  dotColour?: string;
  customIcon?: React.ReactNode;
  containerClass?: string;
}) => {
  return (
    <p
      className={`flex items-center w-max gap-0.5 text-textDarkGrey text-xs uppercase ${containerClass}`}
    >
      {customIcon ? customIcon : <GoDotFill color={dotColour || "#E0E0E0"} />}
      {text}
    </p>
  );
};

const DateTimeTag = ({ datetime }: { datetime: string }) => {
  return (
    <div className="flex items-center justify-center gap-1 bg-[#F6F8FA] px-2 py-1 w-max border-[0.4px] border-strokeGreyTwo rounded-full">
      <p className="text-xs text-textDarkGrey font-semibold">
        {formatDateTime("date", datetime)}
      </p>
      <GoDotFill color="#E2E4EB" />
      <p className="text-xs text-textDarkGrey">
        {formatDateTime("time", datetime)}
      </p>
    </div>
  );
};

const NameTag = ({ name }: { name: string }) => {
  return (
    <span className="flex items-center gap-0.5">
      <img src={smile} alt="Smile Icon" />
      <p className="flex items-center justify-center bg-paleLightBlue text-xs px-2 text-textBlack font-semibold rounded-full h-[24px]">
        {name}
      </p>
    </span>
  );
};

const NairaSymbol = ({ color }: { color?: string }) => {
  return (
    <svg
      width="12"
      height="10"
      viewBox="0 0 12 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.66659 9V1.70133C2.66654 1.54622 2.71802 1.39548 2.81293 1.27279C2.90785 1.1501 3.04083 1.06242 3.19098 1.0235C3.34114 0.984592 3.49997 0.996657 3.64253 1.0578C3.78508 1.11895 3.90329 1.22572 3.97859 1.36133L8.02125 8.63867C8.09655 8.77428 8.21476 8.88105 8.35731 8.9422C8.49987 9.00334 8.6587 9.01541 8.80885 8.9765C8.95901 8.93758 9.09199 8.8499 9.18691 8.72721C9.28182 8.60452 9.3333 8.45378 9.33325 8.29867V1M1.33325 3.66667H10.6666M1.33325 6.33333H10.6666"
        stroke={color || "#00AF50"}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

interface QuantitySelectorProps {
  productUnits: number;
  defaultValue?: number;
  onValueChange: (value: number) => void;
  isSelected: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default function QuantitySelector({
  productUnits,
  defaultValue = 0,
  onValueChange,
  isSelected,
  onClick,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(defaultValue);

  const updateQuantity = (adjustment: number) => {
    const newValue = quantity + adjustment;
    if (newValue >= 0 && newValue <= productUnits) {
      setQuantity(newValue);
      onValueChange(newValue);
    }
  };

  return (
    <div
      className="inline-flex items-center w-max gap-2 bg-white p-1 rounded-[32px] border-[0.2px] border-strokeGreyTwo h-[20px]"
      onClick={onClick}
    >
      {isSelected && (
        <button
          onClick={() => updateQuantity(-1)}
          disabled={quantity === 0}
          className="group rounded-full disabled:opacity-50 transition-colors"
          aria-label="Decrease quantity"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            className="group-hover:stroke-gray-400 group-hover:fill-gray-400"
            stroke="#CCD0DC"
            strokeWidth="1"
          >
            <path
              d="M9.99992 8.4987C10.2761 8.4987 10.4999 8.27484 10.4999 7.9987C10.4999 7.72256 10.2761 7.4987 9.99992 7.4987H5.99992C5.72378 7.4987 5.49992 7.72256 5.49992 7.9987C5.49992 8.27484 5.72378 8.4987 5.99992 8.4987H9.99992Z"
              className="transition-colors duration-200 group-hover:fill-gray-400"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.99992 0.832031C4.04188 0.832031 0.833252 4.04066 0.833252 7.9987C0.833252 11.9567 4.04188 15.1654 7.99992 15.1654C11.958 15.1654 15.1666 11.9567 15.1666 7.9987C15.1666 4.04066 11.958 0.832031 7.99992 0.832031ZM1.83325 7.9987C1.83325 4.59294 4.59416 1.83203 7.99992 1.83203C11.4057 1.83203 14.1666 4.59294 14.1666 7.9987C14.1666 11.4045 11.4057 14.1654 7.99992 14.1654C4.59416 14.1654 1.83325 11.4045 1.83325 7.9987Z"
              className="transition-colors duration-200 group-hover:fill-gray-400"
            />
          </svg>
        </button>
      )}
      <span className="text-center text-[#49526A] font-semibold" key={quantity}>
        {quantity}
      </span>
      {isSelected && (
        <button
          onClick={() => updateQuantity(1)}
          disabled={quantity === productUnits}
          className="group rounded-full disabled:opacity-50 transition-colors"
          aria-label="Increase quantity"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            className="group-hover:stroke-gray-400 group-hover:fill-gray-400"
            stroke="#CCD0DC"
            strokeWidth="1"
          >
            <path
              d="M8.49992 5.9987C8.49992 5.72256 8.27606 5.4987 7.99992 5.4987C7.72378 5.4987 7.49992 5.72256 7.49992 5.9987L7.49992 7.49871H5.99992C5.72378 7.49871 5.49992 7.72257 5.49992 7.99871C5.49992 8.27486 5.72378 8.49871 5.99992 8.49871H7.49992V9.9987C7.49992 10.2748 7.72378 10.4987 7.99992 10.4987C8.27606 10.4987 8.49992 10.2748 8.49992 9.9987L8.49992 8.49871H9.99992C10.2761 8.49871 10.4999 8.27486 10.4999 7.99871C10.4999 7.72257 10.2761 7.49871 9.99992 7.49871H8.49992V5.9987Z"
              className="transition-colors duration-200 group-hover:fill-gray-400"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.99992 0.832031C4.04188 0.832031 0.833252 4.04066 0.833252 7.9987C0.833252 11.9567 4.04188 15.1654 7.99992 15.1654C11.958 15.1654 15.1666 11.9567 15.1666 7.9987C15.1666 4.04066 11.958 0.832031 7.99992 0.832031ZM1.83325 7.9987C1.83325 4.59294 4.59416 1.83203 7.99992 1.83203C11.4057 1.83203 14.1666 4.59294 14.1666 7.9987C14.1666 11.4045 11.4057 14.1654 7.99992 14.1654C4.59416 14.1654 1.83325 11.4045 1.83325 7.9987Z"
              className="transition-colors duration-200 group-hover:fill-gray-400"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export const CardComponent = ({
  variant = "agent",
  handleCallClick,
  handleWhatsAppClick,
  dropDownList,
  name,
  status,
  onGoingSales,
  inventoryInPossession,
  sales,
  registeredCustomers,
  productTag,
  productType,
  paymentStatus,
  daysDue,
  transactionId,
  transactionStatus,
  datetime,
  transactionAmount,
  saleId,
  productStatus,
  productId,
  installment,
  productPrice,
  productImage,
  productName,
  productUnits,
  onSelectProduct,
}: CardComponentProps) => {
  const [_productUnits, setProductUnits] = useState<number>(0);
  const [_productId, setProductId] = useState<string>(productId);
  const [selected, setSelected] = useState<boolean>(false);

  const handleSelectProduct = () => {
    if (!selected) {
      onSelectProduct(_productId, _productUnits);
      setSelected(true);
    } else {
      setSelected(false);
    }
  };

  const handleCardClick = () => {
    setProductId(productId);
    if (variant === "inventoryTwo") {
      if (productId === _productId) {
        handleSelectProduct();
      }
    }
  };

  return (
    <div
      className={`flex flex-col ${
        variant === "inventoryOne" || variant === "inventoryTwo"
          ? "w-[24%] min-w-[150px]"
          : "w-[32%] min-w-[204px]"
      } bg-white border-[0.6px] rounded-[20px] ${
        selected ? " border-success" : "border-strokeGreyThree"
      }`}
      onClick={handleCardClick}
    >
      {/* HEADER */}
      <div
        className={`flex items-center justify-between p-2 rounded-t-[20px] ${
          variant === "sales" ? "bg-paleLightBlue" : "bg-white"
        }`}
      >
        {variant === "transactions" ? (
          <p className="flex items-center justify-center bg-paleLightBlue w-max p-2 h-[20px] text-xs font-bold rounded-full">
            {transactionId}
          </p>
        ) : variant === "sales" ? (
          <p className="flex items-center justify-center bg-paleLightBlue w-max p-2 h-[24px] text-xs font-bold rounded-full border-[0.2px] border-inkBlue">
            {saleId}
          </p>
        ) : variant === "product-no-image" ? (
          <img src={checkers} width="100%" />
        ) : variant === "inventoryOne" || variant === "inventoryTwo" ? (
          <div className="flex items-center justify-center w-full h-full">
            <img
              src={productImage}
              alt="Product"
              width="100%"
              className="max-w-[134px]"
            />
          </div>
        ) : (
          <NameTag name={name} />
        )}

        {variant === "agent" ? (
          <span
            className={`flex items-center text-xs justify-center gap-0.5 bg-[#F6F8FA] px-2 py-1 border-[0.4px] border-strokeGreyTwo h-[24px] rounded-full ${
              status === "active"
                ? "text-success"
                : status === "barred"
                ? "text-errorTwo"
                : "text-brightBlue"
            }`}
          >
            <GoDotFill /> {status.toUpperCase()}
          </span>
        ) : variant === "customer" ? (
          <ProductTag productTag={productTag} />
        ) : variant === "transactions" ? (
          <ProductTypeWithTag paymentStatus={transactionStatus} />
        ) : variant === "sales" ? (
          <SimpleTag
            text={productStatus}
            dotColour="#9BA4BA"
            containerClass="bg-[#F6F8FA] font-light  px-2 py-1 border-[0.4px] border-strokeGreyThree rounded-full"
          />
        ) : null}
      </div>
      {/* MIDDLE */}
      <div className="flex flex-col gap-2 p-2">
        {variant === "agent" ? (
          <>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1 px-2 py-1 text-xs text-textDarkGrey bg-successTwo rounded-full h-[24px]">
                <img src={ongoing} />
                On-Going Sales
              </p>
              <span className="text-xs font-bold text-textDarkGrey">
                {onGoingSales}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1 px-2 py-1 text-xs text-textDarkGrey bg-successTwo rounded-full h-[24px]">
                <img src={inventory} />
                Inventory in Possession
              </p>
              <span className="text-xs font-bold text-textDarkGrey">
                {inventoryInPossession}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1 px-2 py-1 text-xs text-textDarkGrey bg-[#F6F8FA] rounded-full h-[24px]">
                <img src={inventory} />
                Total Sales
              </p>
              <span className="text-xs font-bold text-textDarkGrey">
                {sales}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1 px-2 py-1 text-xs text-textDarkGrey bg-[#F6F8FA] rounded-full h-[24px]">
                <img src={customer} />
                Registered Customers
              </p>
              <span className="text-xs font-bold text-textDarkGrey">
                {registeredCustomers}
              </span>
            </div>
          </>
        ) : variant === "customer" ? (
          <div className="flex items-center gap-2">
            <ProductTypeWithTag
              productTag={productTag}
              productType={productType}
            />
            <ProductTypeWithTag
              paymentStatus={paymentStatus}
              daysDue={daysDue}
            />
          </div>
        ) : variant === "transactions" ? (
          <>
            <div className="flex items-center justify-between gap-1">
              <SimpleTag text="DATE & TIME" containerClass="font-light" />
              <DateTimeTag datetime={datetime} />
            </div>
            <div className="flex items-center justify-between gap-1">
              <SimpleTag text="Product Type" containerClass="font-light" />
              <ProductTypeWithTag
                productTag={productTag}
                productType={productType}
              />
            </div>
            <div className="flex items-center justify-between gap-1">
              <SimpleTag text="AMOUNT" containerClass="font-light " />
              <div className="flex items-center gap-[1px]">
                <NairaSymbol />
                <p className="text-textBlack text-xs">
                  {formatNumberWithCommas(transactionAmount)}
                </p>
              </div>
            </div>
          </>
        ) : variant === "sales" ? (
          <>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1 px-2 py-1 text-xs text-textDarkGrey bg-[#F6F8FA] rounded-full h-[24px]">
                <img src={product} />
                Product
              </p>
              <ProductTypeWithTag
                productTag={productTag}
                productType={productId}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1 px-2 py-1 text-xs text-textDarkGrey bg-[#F6F8FA] rounded-full h-[24px]">
                <img src={customer} />
                Customers
              </p>
              <NameTag name={name} />
            </div>
          </>
        ) : variant === "product-no-image" ? (
          <div className="flex items-center justify-between">
            <p className="flex items-center justify-center bg-paleLightBlue w-max p-2 h-[20px] text-xs font-bold rounded-full">
              {productTag} - {productId}
            </p>
            <ProductTag productTag={productTag} />
          </div>
        ) : variant === "inventoryOne" || variant === "inventoryTwo" ? (
          <div className="flex flex-col gap-2">
            {variant === "inventoryTwo" && (
              <p className="flex items-center justify-center bg-paleLightBlue text-inkBlueTwo w-max p-1 h-[14px] text-[8px] font-medium rounded-full uppercase">
                {productTag}
              </p>
            )}
            <p className="text-textDarkGrey text-xs">{productName}</p>
          </div>
        ) : null}
      </div>
      {/* BOTTOM */}
      <div
        className={`flex items-center ${
          variant === "transactions" ? "justify-end" : "justify-between"
        } ${
          variant === "sales"
            ? "bg-white"
            : selected
            ? "bg-successTwo"
            : "bg-[#F6F8FA]"
        } p-2 h-[40px] border-t-[0.6px]
        ${
          selected ? "border-t-success" : "border-t-strokeGreyThree"
        }  rounded-b-[20px]`}
      >
        {variant === "transactions" ? null : variant === "sales" ? (
          <SimpleTag
            text={`${installment} DAYS`}
            dotColour="#49526A"
            containerClass="bg-[#F6F8FA] font-light px-2 py-1 border-[0.4px] border-strokeGreyTwo rounded-full"
          />
        ) : variant === "product-no-image" ? (
          <SimpleTag
            text={productPrice}
            dotColour="#49526A"
            customIcon={<NairaSymbol color="#828DA9" />}
            containerClass="bg-successTwo font-bold px-2 py-1 border border-successThree rounded-full"
          />
        ) : variant === "inventoryOne" ? (
          <SimpleTag
            text={formatNumberWithCommas(productPrice)}
            customIcon={<NairaSymbol color="#828DA9" />}
            containerClass="text-textBlack font-medium px-1 py-0.5 bg-[#eceef1] border-[0.4px] border-strokeGreyTwo rounded-full"
          />
        ) : variant === "inventoryTwo" ? (
          <SimpleTag
            text={formatNumberWithCommas(productPrice)}
            customIcon={
              <NairaSymbol color={selected ? undefined : "#828DA9"} />
            }
            containerClass="text-textBlack font-medium"
          />
        ) : (
          <div className="flex items-center gap-2">
            <Icon icon={call} iconText="Call" handleClick={handleCallClick} />
            <Icon
              icon={message}
              iconText="Message"
              handleClick={handleWhatsAppClick}
            />
          </div>
        )}

        {variant === "inventoryTwo" ? (
          <QuantitySelector
            productUnits={productUnits}
            onValueChange={(value) => setProductUnits(value)}
            isSelected={!selected}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <DropDown {...dropDownList} />
        )}
      </div>
    </div>
  );
};
