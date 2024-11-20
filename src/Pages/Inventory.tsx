import { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import PageLayout from "./PageLayout";
import LoadingSpinner from "@/Components/Loaders/LoadingSpinner";
import inventorybadge from "../assets/inventory/inventorybadge.png";
import { TitlePill } from "@/Components/TitlePillComponent/TitlePill";
import inventorygradient from "../assets/inventory/inventorygradient.svg";
import cancelled from "../assets/cancelled.svg";
import circleAction from "../assets/settings/addCircle.svg";
import ActionButton from "@/Components/ActionButtonComponent/ActionButton";
import { DropDown } from "@/Components/DropDownComponent/DropDown";
import { SideMenu } from "@/Components/SideMenuComponent/SideMenu";
import InventoryTable from "@/Components/Inventory/InventoryTable";
import CreateNewInventory from "@/Components/Inventory/CreateNewInventory";

const Inventory = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inventoryData, setInventoryData] = useState<any>(null); // Temporary
  //   const {
  //     data: productData,
  //     isLoading: productLoading,
  //     mutate: allProductsRefresh,
  //   } = useGetRequest("/v1/products", true, 60000);

  const navigationList = [
    {
      title: "All Inventory",
      link: "/inventory/all",
      count: 100,
      onclick: () => {},
    },
    {
      title: "Deleted Inventory",
      link: "/inventory/deleted",
      count: 50,
      onclick: () => {},
    },
    {
      title: "Categories",
      link: "/inventory/category",
      count: 25,
      onclick: () => {},
    },
    {
      title: "Out of stock",
      link: "/inventory/out-of-stock",
      count: 25,
      onclick: () => {},
    },
  ];

  useEffect(() => {
    switch (location.pathname) {
      case "/inventory/all":
        // setInventoryData(generateRandomProductEntries(100));
        break;
      case "/inventory/deleted":
        // setInventoryData(generateRandomInventoryEntries(50, ["deleted"]));
        break;
      case "/inventory/category":
        // setInventoryData(generateRandomInventoryEntries(25, ["category"]));
        break;
      case "/inventory/out-of-stock":
        // setInventoryData(generateRandomInventoryEntries(25, ["out-of-stock"]));
        break;
      default:
      // setInventoryData(generateRandomInventoryEntries(100));
    }
  }, [location.pathname]);

  const dropDownList = {
    items: [
      "Add New Inventory",
      "Create New Category",
      "Create New Location",
      "Export List",
    ],
    onClickLink: (index: number) => {
      switch (index) {
        case 0:
          setIsOpen(true);
          break;
        case 1:
          console.log("Exporting list...");
          break;
        case 2:
          console.log("Exporting list...");
          break;
        case 3:
          console.log("Exporting list...");
          break;
        case 4:
          console.log("Exporting list...");
          break;
        default:
          break;
      }
    },
    showCustomButton: true,
  };

  const inventoryPaths = ["all", "deleted", "category", "out-of-stock"];

  return (
    <>
      <PageLayout pageName="Inventory" badge={inventorybadge}>
        <section className="flex flex-col-reverse sm:flex-row items-center justify-between w-full bg-paleGrayGradient px-2 md:px-8 py-4 gap-2 min-h-[64px]">
          <div className="flex flex-wrap w-full items-center gap-2 gap-y-3">
            <TitlePill
              icon={inventorygradient}
              iconBgColor="bg-[#FDEEC2]"
              topText="All"
              bottomText="INVENTORY"
              value={5124}
            />
            <TitlePill
              icon={inventorygradient}
              iconBgColor="bg-[#FDEEC2]"
              topText="Regular"
              bottomText="INVENTORY"
              value={498}
            />
            <TitlePill
              icon={inventorygradient}
              iconBgColor="bg-[#FDEEC2]"
              topText="Refurbished"
              bottomText="INVENTORY"
              value={12}
            />
            <TitlePill
              icon={cancelled}
              iconBgColor="bg-[#FFDBDE]"
              topText="Deleted"
              bottomText="INVENTORY"
              value={4}
            />
          </div>
          <div className="flex w-full items-center justify-between gap-2 min-w-max sm:w-max sm:justify-end">
            <ActionButton
              label="New Inventory"
              icon={<img src={circleAction} />}
              onClick={() => setIsOpen(true)}
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
                  element={<Navigate to="/inventory/all" replace />}
                />
                {inventoryPaths.map((path) => (
                  <Route
                    key={path}
                    path={path}
                    element={<InventoryTable inventoryData={inventoryData} />}
                  />
                ))}
              </Routes>
            </Suspense>
          </section>
        </div>
      </PageLayout>
      <CreateNewInventory isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Inventory;
