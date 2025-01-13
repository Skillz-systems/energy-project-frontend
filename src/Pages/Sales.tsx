import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import PageLayout from "./PageLayout";
import transactionsbadge from "../assets/transactions/transactionsbadge.png";
import { TitlePill } from "@/Components/TitlePillComponent/TitlePill";
import ActionButton from "@/Components/ActionButtonComponent/ActionButton";
import { DropDown } from "@/Components/DropDownComponent/DropDown";
import circleAction from "../assets/settings/addCircle.svg";
import cancelled from "../assets/cancelled.svg";
import gradientsales from "../assets/sales/gradientsales.svg";
import greensales from "../assets/sales/greensales.svg";
import { SideMenu } from "@/Components/SideMenuComponent/SideMenu";
import LoadingSpinner from "@/Components/Loaders/LoadingSpinner";
import CreateNewSale from "@/Components/Sales/CreateNewSale";
import { generateRandomSalesEntries } from "@/Components/TableComponent/sampleData";
// import { useGetRequest } from "@/utils/useApiCall";

const SalesTable = lazy(() => import("@/Components/Sales/SalesTable"));

const Sales = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [_salesData, setSalesData] = useState<any>(null);
  const [, setSalesFilter] = useState<string>("");
  //   const {
  //     data: salesData,
  //     isLoading: salesLoading,
  //     mutate: allSalesRefresh,
  //     error: allSalesError,
  //     errorStates: allSalesErrorStates,
  //   } = useGetRequest(
  //     `/v1/sales${salesFilter && `?status=${salesFilter}`}`,
  //     true,
  //     60000
  //   );
  //   const fetchSalesStats = useGetRequest("/v1/sales/stats", true);

  useEffect(() => {
    switch (location.pathname) {
      case "/sales/all":
        setSalesFilter("");
        setSalesData(generateRandomSalesEntries(100));
        break;
      case "/sales/new":
        setSalesFilter("new");
        setSalesData(generateRandomSalesEntries(25));
        break;
      case "/sales/closed":
        setSalesFilter("closed");
        setSalesData(generateRandomSalesEntries(75));
        break;
      default:
        setSalesFilter("");
        setSalesData(generateRandomSalesEntries(100));
    }
  }, [location.pathname]);

  const navigationList = [
    {
      title: "All Sales",
      link: "/sales/all",
      count: 100,
    },
    {
      title: "New Sales",
      link: "/sales/new",
      count: 25,
    },
    {
      title: "Closed Sales",
      link: "/sales/closed",
      count: 75,
    },
  ];

  const dropDownList = {
    items: ["Add New Sale", "Export List"],
    onClickLink: (index: number) => {
      switch (index) {
        case 0:
          console.log("Adding New Sale...");
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

  const salesPaths = ["all", "new", "closed"];

  return (
    <>
      <PageLayout pageName="Sales" badge={transactionsbadge}>
        <section className="flex flex-col-reverse sm:flex-row items-center justify-between w-full bg-paleGrayGradient px-2 md:px-8 py-4 gap-2 min-h-[64px]">
          <div className="flex flex-wrap w-full items-center gap-2 gap-y-3">
            <TitlePill
              icon={gradientsales}
              iconBgColor="bg-[#FDEEC2]"
              topText="All"
              bottomText="SALES"
              value={2240}
            />
            <TitlePill
              icon={greensales}
              iconBgColor="bg-[#E3FAD6]"
              topText="Active"
              bottomText="SALES"
              value={200}
            />
            <TitlePill
              icon={cancelled}
              iconBgColor="bg-[#FFDBDE]"
              topText="Cancelled"
              bottomText="SALES"
              value={120}
            />
          </div>
          <div className="flex w-full items-center justify-between gap-2 min-w-max sm:w-max sm:justify-end">
            <ActionButton
              label="New Sale"
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
                  element={<Navigate to="/sales/all" replace />}
                />
                {salesPaths.map((path) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <SalesTable
                        salesData={_salesData}
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
      <CreateNewSale
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      //allSalesRefresh={() => Promise.resolve()}
      />
    </>
  );
};

export default Sales;
