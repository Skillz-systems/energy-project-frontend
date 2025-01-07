import { lazy, Suspense, useEffect, useState } from "react";
import PageLayout from "./PageLayout";
import { DropDown } from "@/Components/DropDownComponent/DropDown";
import ActionButton from "@/Components/ActionButtonComponent/ActionButton";
import { TitlePill } from "@/Components/TitlePillComponent/TitlePill";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import circleAction from "../assets/settings/addCircle.svg";
import cancelled from "../assets/cancelled.svg";
import gradientcontract from "../assets/contracts/gradientcontract.svg";
import contractsbadge from "../assets/contracts/contractsbadge.png";
import { SideMenu } from "@/Components/SideMenuComponent/SideMenu";
import LoadingSpinner from "@/Components/Loaders/LoadingSpinner";
import CreateNewContract from "@/Components/Contracts/CreateNewContract";
import { generateRandomContracts } from "@/Components/TableComponent/sampleData";
// import { useGetRequest } from "@/utils/useApiCall";

const ContractsTable = lazy(
  () => import("@/Components/Contracts/ContractsTable")
);

const Contracts = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [_contractsData, setContractsData] = useState<any>(null);
  const [contractsFilter, setContractsFilter] = useState<string>("");
  //   const {
  //     data: transactionsData,
  //     isLoading: transactionsLoading,
  //     mutate: allTransactionsRefresh,
  //     error: allTransactionsError,
  //     errorStates: allTransactionsErrorStates,
  //   } = useGetRequest(
  //     `/v1/transactions${transactionsFilter && `?status=${transactionsFilter}`}`,
  //     true,
  //     60000
  //   );
  //   const fetchTransactionsStats = useGetRequest("/v1/transactions/stats", true);

  useEffect(() => {
    switch (location.pathname) {
      case "/contracts/all":
        setContractsFilter("");
        setContractsData(generateRandomContracts(100));
        break;
      case "/contracts/signed":
        setContractsFilter("signed");
        setContractsData(generateRandomContracts(75));
        break;
      case "/contracts/unsigned":
        setContractsFilter("unsigned");
        setContractsData(generateRandomContracts(50));
        break;
      case "/contracts/cancelled":
        setContractsFilter("cancelled");
        setContractsData(generateRandomContracts(25));
        break;
      case "/contracts/templates":
        setContractsFilter("templates");
        setContractsData(generateRandomContracts(5));
        break;
      default:
        setContractsFilter("");
        setContractsData(generateRandomContracts(100));
    }
  }, [location.pathname]);

  const navigationList = [
    {
      title: "All Contracts",
      link: "/contracts/all",
      count: 100,
    },
    {
      title: "Signed Contracts",
      link: "/contracts/signed",
      count: 75,
    },
    {
      title: "Unsigned Contracts",
      link: "/contracts/unsigned",
      count: 50,
    },
    {
      title: "Cancelled Contracts",
      link: "/contracts/cancelled",
      count: 25,
    },
    {
      title: "Templates",
      link: "/contracts/templates",
      count: 5,
    },
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

  const contractsPaths = [
    "all",
    "signed",
    "unsigned",
    "cancelled",
    "templates",
  ];

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
              value={2240}
            />
            <TitlePill
              icon={gradientcontract}
              iconBgColor="bg-[#FDEEC2]"
              topText="All"
              bottomText="TEMPLATES"
              value={4}
            />
            <TitlePill
              icon={cancelled}
              iconBgColor="bg-[#FFDBDE]"
              topText="Cancelled"
              bottomText="CONTRACTS"
              value={120}
            />
          </div>
          <div className="flex w-full items-center justify-between gap-2 min-w-max sm:w-max sm:justify-end">
            <ActionButton
              label="New Contract"
              icon={<img src={circleAction} />}
              onClick={() => {
                setIsOpen(true);
              }}
            />
            <DropDown {...dropDownList} />
          </div>
        </section>
        <div className="flex flex-col w-full px-2 py-8 gap-4 lg:flex-row md:p-8">
          <SideMenu navigationList={navigationList} />
          <section className="relative items-start justify-center flex min-h-[415px] w-full overflow-hidden">
            <Suspense
              fallback={
                <LoadingSpinner parentClass="absolute top-[50%] w-full" />
              }
            >
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/contracts/all" replace />}
                />
                {contractsPaths.map((path) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <ContractsTable
                        contractsData={_contractsData}
                        isLoading={false}
                        refreshTable={() => Promise.resolve()}
                        error={""}
                        errorData={{
                          errorStates: [
                            {
                              endpoint: "",
                              errorExists: false,
                              errorCount: 0,
                              toastShown: false,
                            },
                          ],
                          isNetworkError: false,
                        }}
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
        allContractsRefresh={() => Promise.resolve()}
      />
    </>
  );
};

export default Contracts;
