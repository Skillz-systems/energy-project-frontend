import { lazy, Suspense, useEffect, useState } from "react";
import PageLayout from "./PageLayout";
import { DropDown } from "@/Components/DropDownComponent/DropDown";
import { TitlePill } from "@/Components/TitlePillComponent/TitlePill";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import cancelled from "../assets/cancelled.svg";
import gradientcontract from "../assets/contracts/gradientcontract.svg";
import contractsbadge from "../assets/contracts/contractsbadge.png";
import { SideMenu } from "@/Components/SideMenuComponent/SideMenu";
import LoadingSpinner from "@/Components/Loaders/LoadingSpinner";
import CreateNewContract from "@/Components/Contracts/CreateNewContract";
import { useApiCall } from "@/utils/useApiCall";

const ContractsTable = lazy(() => import("@/Components/Contracts/ContractsTable"));

const Contracts = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [contractsData, setContractsData] = useState<any>({ contracts: [] }); // Default to empty array
  const [contractsFilter, setContractsFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const { apiCall } = useApiCall();


  const fetchContracts = async (filter: string = "") => {
    setIsLoading(true);
    try {
      const response = await apiCall({
        endpoint: `/v1/contract${filter ? `?status=${filter}` : ""}`,
        method: "get",
        successMessage: "",
        showToast: false,
      });
      setContractsData(response.data);
    } catch (error) {

      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchContracts();
  }, []);



  useEffect(() => {
    switch (location.pathname) {
      case "/contracts/all":
        setContractsFilter("");
        fetchContracts();
        break;
      case "/contracts/signed":
        setContractsFilter("signed");
        fetchContracts("signed");
        break;
      case "/contracts/unsigned":
        setContractsFilter("unsigned");
        fetchContracts("unsigned");
        break;
      case "/contracts/cancelled":
        setContractsFilter("cancelled");
        fetchContracts("cancelled");
        break;
      default:
        setContractsFilter("");
        fetchContracts();
    }
  }, [location.pathname]);

  const paginationInfo = () => {
    const total = contractsData?.contracts?.length || 0; 
    return {
      total,
      currentPage,
      entriesPerPage,
      setCurrentPage,
      setEntriesPerPage,
    };
  };

  const navigationList = [
    {
      title: "All Contracts",
      link: "/contracts/all",
      count: contractsData?.contracts?.length || 0, 
    },
    {
      title: "Signed Contracts",
      link: "/contracts/signed",
      count: contractsData?.contracts?.filter((contract: any) => contract.signedAt).length || 0, 
    },
    {
      title: "Unsigned Contracts",
      link: "/contracts/unsigned",
      count: contractsData?.contracts?.filter((contract: any) => !contract.signedAt).length || 0, 
    },
    {
      title: "Cancelled Contracts",
      link: "/contracts/cancelled",
      count: contractsData?.contracts?.filter((contract: any) => contract.status === "cancelled").length || 0, 
    },
    // {
    //   title: "Signed Contracts",
    //   link: "/contracts/signed",
    //   count: 75,
    // },
    // {
    //   title: "Unsigned Contracts",
    //   link: "/contracts/unsigned",
    //   count: 50,
    // },
    // {
    //   title: "Cancelled Contracts",
    //   link: "/contracts/cancelled",
    //   count: 25,
    // },
  ];

  const dropDownList = {
    items: ["Add New Template", "Export List"],
    onClickLink: (index: number) => {
      switch (index) {
        case 0:
          console.log("Adding template...");
          break;
        case 1:
          console.log("Exporting list...");
          break;
        default:
          break;
      }
    },
    showCustomButton: true,
  };

  // const contractsPaths = ["all", "signed", "unsigned", "cancelled"];
  const contractsPaths = ["all"];

  return (
    <>
      <PageLayout pageName="Contracts" badge={contractsbadge}>
        <section className="flex flex-col-reverse sm:flex-row items-center justify-between w-full bg-paleGrayGradient px-2 md:px-8 py-4 gap-2 min-h-[64px]">
          <div className="flex flex-wrap w-full items-center gap-2 gap-y-3">
            <TitlePill
              icon={gradientcontract}
              iconBgColor="bg-[#FDEEC2]"
              topText="All"
              bottomText="CONTRACTS"
              value={contractsData?.contracts?.length || 0}
            />
            <TitlePill
              icon={cancelled}
              iconBgColor="bg-[#FFDBDE]"
              topText="Cancelled"
              bottomText="CONTRACTS"
              value={contractsData?.contracts?.filter((contract: any) => contract.status === "cancelled").length || 0}
            />
          </div>
          <div className="flex w-full items-center justify-between gap-2 min-w-max sm:w-max sm:justify-end">
            <DropDown {...dropDownList} />
          </div>
        </section>
        <div className="flex flex-col w-full px-2 py-8 gap-4 lg:flex-row md:p-8">
          <SideMenu navigationList={navigationList} />
          <section className="relative items-start justify-center flex min-h-[415px] w-full overflow-hidden">
            <Suspense fallback={<LoadingSpinner parentClass="absolute top-[50%] w-full" />}>
              <Routes>
                <Route path="/" element={<Navigate to="/contracts/all" replace />} />
                {contractsPaths.map((path) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <ContractsTable
                        contractsData={contractsData}
                        isLoading={isLoading}
                        refreshTable={() => fetchContracts(contractsFilter)}
                        error={error}
                        errorData={{
                          errorStates: [
                            {
                              endpoint: "",
                              errorExists: !!error,
                              errorCount: error ? 1 : 0,
                              toastShown: false,
                            },
                          ],
                          isNetworkError: false,
                        }}
                        paginationInfo={paginationInfo()}
                      />
                    }
                  />
                ))}
              </Routes>
            </Suspense>
          </section>
        </div>
      </PageLayout>
      <CreateNewContract
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        allContractsRefresh={() => fetchContracts(contractsFilter)}
      />
    </>
  );
};

export default Contracts;