import { useState } from "react";
import { ApiErrorStatesType, useApiCall } from "@/utils/useApiCall";
import { KeyedMutator } from "swr";
import { Table } from "../TableComponent/Table";
import { ErrorComponent } from "@/Pages/ErrorPage";
import SalesDetailsModal from "./SalesDetailsModal";
import {
  NameTag,
  DateTimeTag,
  NairaSymbol,
  ProductTag,
  SimpleTag,
} from "../CardComponents/CardComponent";
import { formatNumberWithCommas } from "@/utils/helpers";

type SalesEntries = {
  no: string;
  salesId: string;
  dateCreated: string;
  customer: string;
  status: string;
  productType: {
    productCategory: string;
    paymentMode: string;
  };
  amount: number;
};

// Helper function to map the API data to the desired format
const generateSalesEntries = (data: any): SalesEntries[] => {
  const entries: SalesEntries[] = data?.map((item: any, index: number) => {
    return {
      no: index + 1,
      salesId: item?.salesId,
      dateCreated: item?.dateCreated,
      customer: item?.customer,
      status: item?.status?.toLowerCase(),
      productType: {
        productCategory: item?.productCategory,
        paymentMode: item?.paymentMode,
      },
      amount: item?.amount,
    };
  });
  return entries;
};

const SalesTable = ({
  salesData,
  isLoading,
  refreshTable,
  error,
  errorData,
}: {
  salesData: any;
  isLoading: boolean;
  refreshTable: KeyedMutator<any>;
  error: any;
  errorData: ApiErrorStatesType;
}) => {
  const { apiCall } = useApiCall();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [salesID, setSalesID] = useState<string>("");
  const [queryValue, setQueryValue] = useState<string>("");
  const [queryData, setQueryData] = useState<any>(null);
  const [queryLoading, setQueryLoading] = useState<boolean>(false);
  const [isSearchQuery, setIsSearchQuery] = useState<boolean>(false);

  const filterList = [
    {
      name: "Status",
      items: ["All", "New", "Closed"],
      onClickLink: async (index: number) => {
        const data = ["All", "New", "Closed"].map((item) =>
          item.toLocaleLowerCase()
        );
        const query = data[index];
        setQueryValue(query);
        if (queryData) setQueryData(null);
        setQueryLoading(true);
        setQueryValue(query);
        try {
          const response = await apiCall({
            endpoint: `/v1/sales?status=${encodeURIComponent(query)}`,
            method: "get",
            successMessage: "",
            showToast: false,
          });
          setQueryData(response.data);
        } catch (error) {
          console.error(error);
        } finally {
          setQueryLoading(false);
        }
      },
    },
    {
      name: "Search",
      onSearch: async (query: string) => {
        setQueryValue(query);
        setIsSearchQuery(true);
        if (queryData) setQueryData(null);
        setQueryLoading(true);
        setQueryValue(query);
        try {
          const response = await apiCall({
            endpoint: `/v1/sales?search=${encodeURIComponent(query)}`,
            method: "get",
            successMessage: "",
            showToast: false,
          });
          setQueryData(response.data);
        } catch (error) {
          console.error(error);
        } finally {
          setQueryLoading(false);
        }
      },
      isSearch: true,
    },
    {
      onDateClick: (date: string) => {
        console.log("Date:", date);
      },
      isDate: true,
    },
  ];

  const columnList = [
    { title: "S/N", key: "no" },
    { title: "SALES ID", key: "salesId" },
    {
      title: "DATE CREATED",
      key: "dateCreated",
      valueIsAComponent: true,
      customValue: (value: string) => {
        return <DateTimeTag datetime={value} showAll={false} />;
      },
    },
    {
      title: "CUSTOMER",
      key: "customer",
      valueIsAComponent: true,
      customValue: (value: string) => {
        return <NameTag name={value} />;
      },
    },
    {
      title: "STATUS",
      key: "status",
      valueIsAComponent: true,
      customValue: (value: string) => {
        return (
          <SimpleTag
            text={value}
            dotColour="#9BA4BA"
            containerClass="bg-[#F6F8FA] font-light text-textDarkGrey px-2 py-1 border-[0.4px] border-strokeGreyThree rounded-full"
          />
        );
      },
      rightIcon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.62922 2.16602H9.37111C10.5963 2.16601 11.5667 2.166 12.3262 2.26811C13.1078 2.37319 13.7404 2.5946 14.2393 3.09351C14.7382 3.59242 14.9597 4.22505 15.0647 5.00667C15.125 5.45525 15.1497 5.97741 15.1598 6.5822C15.1644 6.60945 15.1668 6.63745 15.1668 6.66602C15.1668 6.68952 15.1652 6.71264 15.1621 6.73528C15.1668 7.11243 15.1668 7.52057 15.1668 7.96174V7.99935C15.1668 8.27549 14.943 8.49935 14.6668 8.49935C14.3907 8.49935 14.1668 8.27549 14.1668 7.99935C14.1668 7.70208 14.1668 7.42494 14.1655 7.16602H1.83482C1.83355 7.42494 1.8335 7.70208 1.8335 7.99935C1.8335 9.27056 1.83456 10.1737 1.92667 10.8588C2.01685 11.5295 2.18596 11.9159 2.4681 12.1981C2.75024 12.4802 3.13667 12.6493 3.8074 12.7395C4.4925 12.8316 5.39562 12.8327 6.66683 12.8327H9.3335C9.60964 12.8327 9.8335 13.0565 9.8335 13.3327C9.8335 13.6088 9.60964 13.8327 9.3335 13.8327H6.62922C5.40405 13.8327 4.43362 13.8327 3.67415 13.7306C2.89253 13.6255 2.2599 13.4041 1.76099 12.9052C1.26208 12.4063 1.04067 11.7736 0.935586 10.992C0.833477 10.2326 0.833486 9.26213 0.833496 8.03696V7.96174C0.833492 7.52056 0.833489 7.11242 0.838254 6.73527C0.835117 6.71263 0.833497 6.68951 0.833497 6.66602C0.833497 6.63746 0.835891 6.60946 0.840489 6.58221C0.850591 5.97742 0.875276 5.45525 0.935586 5.00667C1.04067 4.22505 1.26208 3.59242 1.76099 3.09351C2.2599 2.5946 2.89253 2.37319 3.67415 2.26811C4.43362 2.166 5.40405 2.16601 6.62922 2.16602ZM1.85088 6.16602H14.1494C14.1364 5.77486 14.1136 5.43691 14.0737 5.13991C13.9835 4.46919 13.8144 4.08276 13.5322 3.80062C13.2501 3.51848 12.8637 3.34937 12.1929 3.25919C11.5078 3.16708 10.6047 3.16602 9.3335 3.16602H6.66683C5.39562 3.16602 4.49251 3.16708 3.8074 3.25919C3.13667 3.34937 2.75024 3.51848 2.4681 3.80062C2.18596 4.08276 2.01685 4.46919 1.92667 5.13991C1.88674 5.43691 1.86392 5.77486 1.85088 6.16602ZM12.6668 8.83268C12.943 8.83268 13.1668 9.05654 13.1668 9.33268V12.1256L13.6466 11.6458C13.8419 11.4505 14.1585 11.4505 14.3537 11.6458C14.549 11.8411 14.549 12.1576 14.3537 12.3529L13.0204 13.6862C12.8251 13.8815 12.5085 13.8815 12.3133 13.6862L10.9799 12.3529C10.7847 12.1576 10.7847 11.8411 10.9799 11.6458C11.1752 11.4505 11.4918 11.4505 11.687 11.6458L12.1668 12.1256V9.33268C12.1668 9.05654 12.3907 8.83268 12.6668 8.83268ZM3.50016 10.666C3.50016 10.3899 3.72402 10.166 4.00016 10.166H6.66683C6.94297 10.166 7.16683 10.3899 7.16683 10.666C7.16683 10.9422 6.94297 11.166 6.66683 11.166H4.00016C3.72402 11.166 3.50016 10.9422 3.50016 10.666ZM7.8335 10.666C7.8335 10.3899 8.05735 10.166 8.3335 10.166H8.66683C8.94297 10.166 9.16683 10.3899 9.16683 10.666C9.16683 10.9422 8.94297 11.166 8.66683 11.166H8.3335C8.05735 11.166 7.8335 10.9422 7.8335 10.666Z"
            fill="#828DA9"
          />
        </svg>
      ),
    },
    {
      title: "PRODUCT TYPE",
      key: "productType",
      valueIsAComponent: true,
      customValue: (value: {
        productCategory: string;
        paymentMode: string;
      }) => {
        return (
          <div className="flex items-center gap-1 pl-1 pr-2 py-1 w-max bg-[#F6F8FA] border-[0.4px] border-strokeGreyTwo rounded-full">
            <ProductTag productTag={value.productCategory} />
            <p className="text-textBlack text-xs">{value.paymentMode}</p>
          </div>
        );
      },
      rightIcon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.00024 1.83398C7.17181 1.83398 6.50024 2.50556 6.50024 3.33398V3.50724C6.87162 3.50064 7.27913 3.50065 7.72633 3.50065H8.27415C8.72136 3.50065 9.12886 3.50064 9.50024 3.50724V3.33398C9.50024 2.50556 8.82867 1.83398 8.00024 1.83398ZM10.5002 3.5526V3.33398C10.5002 1.95327 9.38095 0.833984 8.00024 0.833984C6.61953 0.833984 5.50024 1.95327 5.50024 3.33398V3.5526C5.40509 3.56079 5.31314 3.57028 5.22429 3.58125C4.55098 3.66444 3.99589 3.8392 3.52436 4.23054C3.05284 4.62187 2.77877 5.13524 2.57292 5.78169C2.37343 6.40817 2.22243 7.21359 2.0326 8.22604L2.01881 8.29957C1.75095 9.72811 1.53985 10.8539 1.50111 11.7415C1.46141 12.6512 1.59675 13.4047 2.10993 14.023C2.62312 14.6413 3.33873 14.9132 4.24019 15.0419C5.11967 15.1673 6.26508 15.1673 7.71849 15.1673H8.28195C9.73538 15.1673 10.8808 15.1673 11.7603 15.0418C12.6618 14.9132 13.3774 14.6413 13.8905 14.023C14.4037 13.4046 14.5391 12.6512 14.4994 11.7415C14.4606 10.8539 14.2495 9.72812 13.9817 8.29958L13.9679 8.22606C13.7781 7.2136 13.627 6.40818 13.4276 5.78169C13.2217 5.13524 12.9476 4.62187 12.4761 4.23054C12.0046 3.8392 11.4495 3.66444 10.7762 3.58125C10.6873 3.57028 10.5954 3.56079 10.5002 3.5526ZM5.34691 4.57371C4.77655 4.64418 4.43207 4.77674 4.163 5.00005C3.89393 5.22336 3.70016 5.5375 3.52578 6.08511C3.34721 6.6459 3.20671 7.39041 3.0093 8.44326C2.73215 9.92138 2.53543 10.9771 2.50016 11.7851C2.4655 12.5792 2.59288 13.0391 2.87944 13.3844C3.16601 13.7297 3.5945 13.9396 4.38145 14.0519C5.18205 14.1661 6.25597 14.1673 7.75985 14.1673H8.24063C9.74451 14.1673 10.8184 14.1661 11.619 14.0519C12.406 13.9396 12.8345 13.7297 13.121 13.3844C13.4076 13.0391 13.535 12.5792 13.5003 11.7851C13.4651 10.9771 13.2683 9.92138 12.9912 8.44326C12.7938 7.39041 12.6533 6.6459 12.4747 6.08511C12.3003 5.53751 12.1066 5.22336 11.8375 5.00005C11.5684 4.77674 11.2239 4.64418 10.6536 4.57371C10.0695 4.50154 9.31183 4.50065 8.24063 4.50065H7.75985C6.68865 4.50065 5.93101 4.50154 5.34691 4.57371ZM6.82816 8.19374C6.67529 8.24733 6.50024 8.41444 6.50024 8.79847C6.50024 8.94152 6.59439 9.16221 6.83988 9.44606C7.0723 9.71481 7.37929 9.97012 7.65794 10.1746C7.80876 10.2852 7.88036 10.3363 7.93765 10.3665C7.97391 10.3856 7.98395 10.3857 8.00024 10.3857C8.01654 10.3857 8.02658 10.3856 8.06284 10.3665C8.12012 10.3363 8.19173 10.2852 8.34255 10.1746C8.62119 9.97013 8.92818 9.71482 9.1606 9.44607C9.40609 9.16222 9.50024 8.94153 9.50024 8.79846C9.50024 8.41443 9.3252 8.24733 9.17232 8.19374C9.00545 8.13525 8.6964 8.15389 8.34603 8.48936C8.15268 8.6745 7.84781 8.6745 7.65445 8.48936C7.30408 8.15389 6.99503 8.13525 6.82816 8.19374ZM8.00024 7.49019C7.52272 7.17582 6.98356 7.0796 6.49735 7.25005C5.87521 7.46814 5.50024 8.06701 5.50024 8.79847C5.50024 9.3117 5.79438 9.76589 6.08351 10.1002C6.3857 10.4496 6.75967 10.7558 7.06636 10.9808C7.0819 10.9922 7.09755 11.0038 7.11336 11.0155C7.34754 11.1886 7.61405 11.3857 8.00024 11.3857C8.38644 11.3857 8.65294 11.1886 8.88712 11.0155C8.90293 11.0038 8.91858 10.9922 8.93412 10.9808C9.24082 10.7558 9.61478 10.4496 9.91698 10.1002C10.2061 9.76589 10.5002 9.3117 10.5002 8.79846C10.5002 8.06701 10.1253 7.46814 9.50313 7.25005C9.01692 7.0796 8.47776 7.17582 8.00024 7.49019Z"
            fill="#828DA9"
          />
        </svg>
      ),
    },
    {
      title: "TOTAL AMOUNT",
      key: "amount",
      valueIsAComponent: true,
      customValue: (value: number) => {
        return (
          <div className="flex items-center gap-1">
            <NairaSymbol />
            <span className="text-textBlack">
              {value && formatNumberWithCommas(value)}
            </span>
          </div>
        );
      },
      rightIcon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.62922 2.16602H9.37111C10.5963 2.16601 11.5667 2.166 12.3262 2.26811C13.1078 2.37319 13.7404 2.5946 14.2393 3.09351C14.7382 3.59242 14.9597 4.22505 15.0647 5.00667C15.125 5.45525 15.1497 5.97741 15.1598 6.5822C15.1644 6.60945 15.1668 6.63745 15.1668 6.66602C15.1668 6.68952 15.1652 6.71264 15.1621 6.73528C15.1668 7.11243 15.1668 7.52057 15.1668 7.96174V7.99935C15.1668 8.27549 14.943 8.49935 14.6668 8.49935C14.3907 8.49935 14.1668 8.27549 14.1668 7.99935C14.1668 7.70208 14.1668 7.42494 14.1655 7.16602H1.83482C1.83355 7.42494 1.8335 7.70208 1.8335 7.99935C1.8335 9.27056 1.83456 10.1737 1.92667 10.8588C2.01685 11.5295 2.18596 11.9159 2.4681 12.1981C2.75024 12.4802 3.13667 12.6493 3.8074 12.7395C4.4925 12.8316 5.39562 12.8327 6.66683 12.8327H9.3335C9.60964 12.8327 9.8335 13.0565 9.8335 13.3327C9.8335 13.6088 9.60964 13.8327 9.3335 13.8327H6.62922C5.40405 13.8327 4.43362 13.8327 3.67415 13.7306C2.89253 13.6255 2.2599 13.4041 1.76099 12.9052C1.26208 12.4063 1.04067 11.7736 0.935586 10.992C0.833477 10.2326 0.833486 9.26213 0.833496 8.03696V7.96174C0.833492 7.52056 0.833489 7.11242 0.838254 6.73527C0.835117 6.71263 0.833497 6.68951 0.833497 6.66602C0.833497 6.63746 0.835891 6.60946 0.840489 6.58221C0.850591 5.97742 0.875276 5.45525 0.935586 5.00667C1.04067 4.22505 1.26208 3.59242 1.76099 3.09351C2.2599 2.5946 2.89253 2.37319 3.67415 2.26811C4.43362 2.166 5.40405 2.16601 6.62922 2.16602ZM1.85088 6.16602H14.1494C14.1364 5.77486 14.1136 5.43691 14.0737 5.13991C13.9835 4.46919 13.8144 4.08276 13.5322 3.80062C13.2501 3.51848 12.8637 3.34937 12.1929 3.25919C11.5078 3.16708 10.6047 3.16602 9.3335 3.16602H6.66683C5.39562 3.16602 4.49251 3.16708 3.8074 3.25919C3.13667 3.34937 2.75024 3.51848 2.4681 3.80062C2.18596 4.08276 2.01685 4.46919 1.92667 5.13991C1.88674 5.43691 1.86392 5.77486 1.85088 6.16602ZM12.6668 8.83268C12.943 8.83268 13.1668 9.05654 13.1668 9.33268V12.1256L13.6466 11.6458C13.8419 11.4505 14.1585 11.4505 14.3537 11.6458C14.549 11.8411 14.549 12.1576 14.3537 12.3529L13.0204 13.6862C12.8251 13.8815 12.5085 13.8815 12.3133 13.6862L10.9799 12.3529C10.7847 12.1576 10.7847 11.8411 10.9799 11.6458C11.1752 11.4505 11.4918 11.4505 11.687 11.6458L12.1668 12.1256V9.33268C12.1668 9.05654 12.3907 8.83268 12.6668 8.83268ZM3.50016 10.666C3.50016 10.3899 3.72402 10.166 4.00016 10.166H6.66683C6.94297 10.166 7.16683 10.3899 7.16683 10.666C7.16683 10.9422 6.94297 11.166 6.66683 11.166H4.00016C3.72402 11.166 3.50016 10.9422 3.50016 10.666ZM7.8335 10.666C7.8335 10.3899 8.05735 10.166 8.3335 10.166H8.66683C8.94297 10.166 9.16683 10.3899 9.16683 10.666C9.16683 10.9422 8.94297 11.166 8.66683 11.166H8.3335C8.05735 11.166 7.8335 10.9422 7.8335 10.666Z"
            fill="#828DA9"
          />
        </svg>
      ),
    },
    {
      title: "ACTIONS",
      key: "actions",
      valueIsAComponent: true,
      customValue: (_value: any, rowData: { salesId: string }) => {
        return (
          <span
            className="px-2 py-1 text-[10px] text-textBlack font-medium bg-[#F6F8FA] border-[0.2px] border-strokeGreyTwo rounded-full shadow-innerCustom cursor-pointer transition-all hover:bg-gold"
            onClick={() => {
              setSalesID(rowData.salesId);
              setIsOpen(true);
            }}
          >
            View
          </span>
        );
      },
    },
  ];

  const getTableData = () => {
    if (queryValue && queryData) {
      return generateSalesEntries(queryData);
    } else return generateSalesEntries(salesData);
  };

  return (
    <>
      {!error ? (
        <div className="w-full">
          <Table
            tableTitle="SALES"
            filterList={filterList}
            columnList={columnList}
            loading={queryLoading || isLoading}
            tableData={getTableData()}
            refreshTable={async () => {
              await refreshTable();
              setQueryData(null);
            }}
            queryValue={isSearchQuery ? queryValue : ""}
          />
          {salesID && (
            <SalesDetailsModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              salesID={salesID}
              refreshTable={refreshTable}
            />
          )}
        </div>
      ) : (
        <ErrorComponent
          message="Failed to fetch sales list."
          className="rounded-[20px]"
          refreshData={refreshTable}
          errorData={errorData}
        />
      )}
    </>
  );
};

export default SalesTable;
