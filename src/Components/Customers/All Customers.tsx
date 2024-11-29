import { useEffect, useState } from "react";
import { Table } from "../TableComponent/Table";
import role from "../../assets/table/role.svg";
import clock from "../../assets/table/clock.svg";
import { GoDotFill } from "react-icons/go";
import { useApiCall } from "../../utils/useApiCall";
import { observer } from "mobx-react-lite";
import { capitalizeFirstLetter } from "../../utils/helpers";
import { KeyedMutator } from "swr";
import rootStore from "../../stores/rootStore";
import CustomerPagemodal from "./CustomerPagemodal";

interface CustomerEntries {
    id: string;
    no: number;
    name: string;
    email: string;
    location: string | null;
    tier: string;
    status: string;
}

// Helper function to map the API data to the desired format
const generateCustomerEntries = (data: any): CustomerEntries[] => {
    const entries: CustomerEntries[] = data?.customers.map((customer: any, index: number) => {
        return {
            id: customer?.id,
            no: index + 1,
            name: `${customer?.firstname} ${customer?.lastname}`,
            email: customer?.email,
            location: customer?.location || "N/A",
            tier: customer?.tier?.toUpperCase(),
            status: customer?.status.toUpperCase(),
        };
    });

    return entries;
};

const Customers = observer(
    ({
        tiersList,
        data,
        isLoading,
        refreshTable,
    }: {
        tiersList: any;
        data: any;
        isLoading: boolean;
        refreshTable: KeyedMutator<any>;
    }) => {
        const { settingsStore } = rootStore;
        const { apiCall } = useApiCall();
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

        const filterList = [
            {
                name: "All Tiers",
                items: [
                    "All Tiers",
                    ...(tiersList
                        ? tiersList.map((tier) => capitalizeFirstLetter(tier.label))
                        : []),
                ],
                onClickLink: async (index: number) => {
                    setIsSearchQuery(false);
                    let tierId = "";
                    if (index !== 0) {
                        const selectedTier = tiersList[index - 1];
                        tierId = selectedTier?.value;
                        setQueryValue(tierId);
                    } else {
                        setQueryValue("");
                    }
                    setQueryLoading(true);
                    try {
                        const response = await apiCall({
                            endpoint:
                                index === 0 ? "/v1/customers" : `/v1/customers?tierId=${tierId}`,
                            method: "get",
                            showToast: false,
                        });
                        setQueryData(response.data);
                    } catch (error) {
                        console.error(error);
                    } finally {
                        setQueryLoading(false);
                    }
                    return;
                },
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
        ];

        const columnList = [
            { title: "S/N", key: "no" },
            { title: "NAME", key: "name" },
            { title: "EMAIL", key: "email" },
            { title: "LOCATION", key: "location" },
            {
                title: "TIER",
                key: "tier",
                valueIsAComponent: true,
                customValue: (value: any) => (
                    <span className="flex items-center gap-0.5 w-max px-2 py-1 bg-[#F6F8FA] border-[0.4px] border-strokeGreyTwo rounded-full">
                        <GoDotFill />
                        {value}
                    </span>
                ),
                rightIcon: <img src={role} alt="tier icon" className="ml-auto" />,
            },
            {
                title: "STATUS",
                key: "status",
                valueIsAComponent: true,
                customValue: (value: any) => {
                    const style =
                        value === "ACTIVE" ? "text-success" : "text-errorTwo";

                    return (
                        <span
                            className={`${style} flex items-center gap-0.5 w-max px-2 py-1 bg-[#F6F8FA] border-[0.4px] border-strokeGreyTwo rounded-full`}
                        >
                            <GoDotFill />
                            {value}
                        </span>
                    );
                },
                rightIcon: <img src={clock} alt="status icon" className="ml-auto" />,
            },
            {
                title: "ACTIONS",
                key: "actions",
                valueIsAComponent: true,
                customValue: (_, rowData) => (
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
                <CustomerPagemodal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    customerId={customerID} // Correct
                    refreshTable={refreshTable}
                    tiersList={tiersList}
                />

            </>
        );
    }
);

export default Customers;
