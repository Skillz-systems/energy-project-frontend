import { useEffect, useState, useMemo, useCallback } from "react";
import { Table } from "../TableComponent/Table";
import { observer } from "mobx-react-lite";
import { useApiCall } from "../../utils/useApiCall";
import rootStore from "../../stores/rootStore";
import { KeyedMutator } from "swr";
import { capitalizeFirstLetter } from "../../utils/helpers";
import roleIcon from "../../assets/table/role.svg";
import clockIcon from "../../assets/table/clock.svg";
import { GoDotFill } from "react-icons/go";
import CustomerModal from "./CustomerPagemodal";

interface CustomerEntries {
    id: string;
    no: number;
    name: string;
    email: string;
    location: string | null;
    product: string;
    status: string;
}

interface AllCustomersProps {
    customerList: any; 
    refreshTable: KeyedMutator<any>;
    data: { customers: any[]; total?: number };
    isLoading: boolean;
}

const generateCustomerEntries = (data: any): CustomerEntries[] => {
    return data?.customers?.map((customer: any, index: number) => ({
        id: customer.id,
        no: index + 1,
        name: `${customer.firstname} ${customer.lastname}`,
        email: customer.email,
        location: customer.location || "N/A",
        product: customer.product?.toUpperCase(),
        status: customer.status.toUpperCase(),
    }));
};

const AllCustomers = observer(({ customerList, refreshTable, data, isLoading }: AllCustomersProps) => {
    const { apiCall } = useApiCall();
    const { settingsStore } = rootStore;

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [customerID, setCustomerID] = useState<string>("");
    const [queryValue, setQueryValue] = useState<string>("");
    const [queryData, setQueryData] = useState<any>(null);
    const [queryLoading, setQueryLoading] = useState<boolean>(false);
    const [isSearchQuery, setIsSearchQuery] = useState<boolean>(false);

    useEffect(() => {
        if (data?.total) {
            settingsStore.updateUserCount(data.total);
        }
    }, [data?.total, settingsStore]);

    const handleViewCustomer = (id: string) => {
        setCustomerID(id); // Set the selected customer ID
        setIsOpen(true); // Open the modal
    };

    const customerEntries = useMemo(() => generateCustomerEntries(data), [data]);

    const filterList = [
        {
            name: "Location",
            
            
        },
        {
            name: "Product",
            
            
        },
        {
            name: "Product Type",
            
            
        },
        {
            name: "All Status",
            
            
        },
        {
            name: "Search",
            onSearch: async (query: string) => {
                setIsSearchQuery(true);
                if (queryData) setQueryData(null);
                setQueryLoading(true);
                setQueryValue(query);
                try {
                    const response = await apiCall({
                        endpoint: `/v1/customers?search=${encodeURIComponent(query)}`,
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
        { title: "NAME", key: "name" },
        { title: "EMAIL", key: "email" },
        { title: "LOCATION", key: "location" },
        {
            title: "PRODUCT",
            key: "product",
            valueIsAComponent: true,
            customValue: (value: any) => (
                <span className="flex items-center gap-0.5 w-max px-2 py-1 bg-[#F6F8FA] border-[0.4px] border-strokeGreyTwo rounded-full">
                    <GoDotFill />
                    {value}
                </span>
            ),
            rightIcon: <img src={roleIcon} alt="role icon" className="ml-auto" />,
        },
        {
            title: "STATUS",
            key: "status",
            valueIsAComponent: true,
            customValue: (value: any) => {
                const style = value === "ACTIVE" ? "text-success" : "text-errorTwo";
                return (
                    <span className={`${style} flex items-center gap-0.5 w-max px-2 py-1 bg-[#F6F8FA] border-[0.4px] border-strokeGreyTwo rounded-full`}>
                        <GoDotFill />
                        {value}
                    </span>
                );
            },
            rightIcon: <img src={clockIcon} alt="clock icon" className="ml-auto" />,
        },
        {
            title: "ACTIONS",
            key: "actions",
            valueIsAComponent: true,
            customValue: (value, rowData) => (
                <span
                    className="px-2 py-1 text-[10px] text-textBlack font-medium bg-[#F6F8FA] border-[0.2px] border-strokeGreyTwo rounded-full shadow-innerCustom cursor-pointer transition-all hover:bg-gold"
                    onClick={() => {
                        setCustomerID(rowData.id);
                        setIsOpen(true);
                    }}
                >
                    View
                </span>
            ),
        },
    ];

    const getTableData = () => {
        if (queryValue && queryData) {
            return generateCustomerEntries(queryData);
        } else return generateCustomerEntries(data);
    };

    return (
        <>
            <div className="w-full">
                <Table
                    tableTitle="CUSTOMERS"
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
            </div>
            <CustomerModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                customerId={customerID}
                refreshTable={refreshTable}
                customerList={customerList}
            />
        </>
    );
});

export default AllCustomers;
