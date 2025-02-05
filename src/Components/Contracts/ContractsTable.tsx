
import { useState } from "react";
import {  useApiCall } from "@/utils/useApiCall";
import { ErrorComponent } from "@/Pages/ErrorPage";
import { Table } from "../TableComponent/Table";
import ContractModal from "./ContractModal";
import { format } from "date-fns";
import { ContractCard } from "./ContractCard";


interface PaginationInfo {
  total: number;
  currentPage: number;
  entriesPerPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setEntriesPerPage: React.Dispatch<React.SetStateAction<number>>;
}


interface Contract {
  id: string;
  contractProducts: { name: string; components: string[] }[];
}

interface ContractsTableProps {
  contractsData: any;
  isLoading: boolean;
  refreshTable: () => Promise<void>;
  error: any;
  errorData: {
    errorStates: {
      endpoint: string;
      errorExists: boolean;
      errorCount: number;
      toastShown: boolean;
    }[];
    isNetworkError: boolean;
  };
  paginationInfo: PaginationInfo;
}

type ContractEntries = {
  id: string;
  date: string;
  fullNameAsOnID: string;
  contractSigned: string | null;
};

const generateContractEntries = (data: any): ContractEntries[] => {
  if (!data || !Array.isArray(data)) {
    console.error("Contracts data is missing or malformed:", data);
    return [];
  }

  return data.map((item: any) => ({
    id: item?.id || "",
    date: item?.createdAt ? format(new Date(item.createdAt), "MMM dd, yyyy") : "N/A",
    fullNameAsOnID: item?.fullNameAsOnID || "Unknown",
    contractSigned: item?.signedAt ? format(new Date(item.signedAt), "dd/MM/yyyy") : null,
  }));
};

const ContractsTable: React.FC<ContractsTableProps> = ({
  contractsData,
  isLoading,
  refreshTable,
  error,
  errorData,
}: ContractsTableProps) => {
  const { apiCall } = useApiCall();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [contractID, setContractID] = useState<string>("");
  const [queryValue, setQueryValue] = useState<string>("");
  const [queryData, setQueryData] = useState<any>(null);
  const [queryLoading, setQueryLoading] = useState<boolean>(false);
  const [isSearchQuery, setIsSearchQuery] = useState<boolean>(false);


  const cardComponent = (data: ContractEntries[]) => {
    return data?.map((item: ContractEntries, index) => (
        <ContractCard
            key={index}
            {...item}
            handleContractClick={() => {
                if (item.contractSigned) {
                    setIsOpen(true);
                    setContractID(item.id);
                }
            }}
            refreshTable={refreshTable} 
        />
    ));
};

  const getTableData = () => {
    const dataToUse = queryValue && queryData ? queryData : contractsData?.contracts;
    return generateContractEntries(dataToUse || []);
  };

  const filterList = [
    {
      name: "Categories",
      items: ["SHS", "EAAS", "Rooftop"],
      onClickLink: async (index: number) => {
        const data = ["SHS", "EAAS", "Rooftop"].map((item) => item.toLocaleLowerCase());
        const query = data[index];
        setQueryValue(query);
        if (queryData) setQueryData(null);
        setQueryLoading(true);
        try {
          const response = await apiCall({
            endpoint: `/v1/contracts?status=${encodeURIComponent(query)}`,
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
        try {
          const response = await apiCall({
            endpoint: `/v1/contracts?search=${encodeURIComponent(query)}`,
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

  return (
    <>
        {!error ? (
            <div className="w-full">
                <Table
                    tableType="card"
                    tableTitle="ALL CONTRACTS"
                    tableClassname="flex flex-wrap items-center gap-4"
                    tableData={getTableData()}
                    loading={queryLoading || isLoading}
                    filterList={filterList}
                    paginationInfo={() => ({
                        total: contractsData?.contracts?.length || 0,
                        currentPage: 1,
                        entriesPerPage: 10,
                        setCurrentPage: () => {},
                        setEntriesPerPage: () => {},
                    })}
                    cardComponent={cardComponent}
                    refreshTable={async () => {
                        await refreshTable();
                        setQueryData(null);
                    }}
                    queryValue={isSearchQuery ? queryValue : ""}
                />

                {isOpen && contractID && (
                    <ContractModal
                        setIsOpen={setIsOpen}
                        contractDocData={{
                            contractProducts: contractsData?.contracts?.find(
                                (contract: Contract) => contract.id === contractID
                            )?.contractProducts || [],
                            contractID: contractID,
                        }}
                    />
                )}
            </div>
        ) : (
            <ErrorComponent
                message="Failed to fetch contract list."
                className="rounded-[20px]"
                refreshData={refreshTable}
                errorData={errorData}
            />
        )}
    </>
);
   
};

export default ContractsTable;