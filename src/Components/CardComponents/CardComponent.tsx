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
  variant: "agent" | "customer" | "transactions" | "sales" | "product-no-image";
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
}: CardComponentProps) => {
  return (
    <div className="flex flex-col w-[32%] min-w-[204px] bg-white border-[0.6px] border-strokeGreyThree rounded-[20px]">
      {/* HEADER */}
      <div
        className={`flex items-center justify-between p-2 ${
          variant === "sales" ? "bg-paleLightBlue rounded-t-[20px]" : "bg-white"
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
                <svg
                  width="12"
                  height="10"
                  viewBox="0 0 12 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.66634 9V1.70133C2.66629 1.54622 2.71777 1.39548 2.81269 1.27279C2.9076 1.1501 3.04058 1.06242 3.19074 1.0235C3.3409 0.984592 3.49973 0.996657 3.64228 1.0578C3.78484 1.11895 3.90305 1.22572 3.97834 1.36133L8.02101 8.63867C8.0963 8.77428 8.21451 8.88105 8.35707 8.9422C8.49962 9.00334 8.65845 9.01541 8.80861 8.9765C8.95877 8.93758 9.09175 8.8499 9.18666 8.72721C9.28158 8.60452 9.33306 8.45378 9.33301 8.29867V1M1.33301 3.66667H10.6663M1.33301 6.33333H10.6663"
                    stroke="#00AF50"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

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
        ) : null}
      </div>
      {/* BOTTOM */}
      <div
        className={`flex items-center ${
          variant === "transactions" ? "justify-end" : "justify-between"
        } ${
          variant === "sales" ? "bg-white" : "bg-[#F6F8FA]"
        } p-2 h-[40px] border-t-[0.6px] border-t-strokeGreyThree rounded-b-[20px]`}
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
            customIcon={
              <svg
                width="12"
                height="10"
                viewBox="0 0 12 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.66683 9V1.70133C2.66678 1.54622 2.71826 1.39548 2.81318 1.27279C2.90809 1.1501 3.04107 1.06242 3.19123 1.0235C3.34138 0.984592 3.50021 0.996657 3.64277 1.0578C3.78533 1.11895 3.90353 1.22572 3.97883 1.36133L8.0215 8.63867C8.09679 8.77428 8.215 8.88105 8.35756 8.9422C8.50011 9.00334 8.65894 9.01541 8.8091 8.9765C8.95926 8.93758 9.09223 8.8499 9.18715 8.72721C9.28207 8.60452 9.33354 8.45378 9.3335 8.29867V1M1.3335 3.66667H10.6668M1.3335 6.33333H10.6668"
                  stroke="#828DA9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            }
            containerClass="bg-successTwo font-bold px-2 py-1 border border-successThree rounded-full"
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
        <DropDown {...dropDownList} />
      </div>
    </div>
  );
};
