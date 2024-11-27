import { lazy, Suspense, useEffect, useState } from "react";
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
import CreateNewInventory, {
  InventoryFormType,
} from "@/Components/Inventory/CreateNewInventory";
import { useGetRequest } from "@/utils/useApiCall";

const InventoryTable = lazy(
  () => import("@/Components/Inventory/InventoryTable")
);

const Inventory = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [_inventoryData, setInventoryData] = useState<any>(null); // Temporary
  const [formType, setFormType] = useState<InventoryFormType>("newInventory");
  const {
    data: inventoryData,
    isLoading: inventoryLoading,
    mutate: allInventoryRefresh,
  } = useGetRequest("/v1/inventory", true, 60000);

  const navigationList = [
    {
      title: "All Inventory",
      link: "/inventory/all",
      // count: inventoryData?.total,
      count:
        inventoryData?.inventories?.filter(
          (item) => item.batches && item.batches.length > 0
        )?.length ?? 0,
    },
    // {
    //   title: "Regular",
    //   link: "/inventory/regular",
    //   count: 70,
    // },
    // {
    //   title: "Out of stock",
    //   link: "/inventory/out-of-stock",
    //   count: 20,
    // },
    // {
    //   title: "Deleted Inventory",
    //   link: "/inventory/deleted",
    //   count: 10,
    // },
  ];

  useEffect(() => {
    switch (location.pathname) {
      case "/inventory/all":
        setInventoryData(inventoryData);
        break;
      // case "/inventory/regular":
      //   setInventoryData(inventoryData);
      //   break;
      // case "/inventory/out-of-stock":
      //   setInventoryData(inventoryData);
      //   break;
      // case "/inventory/deleted":
      //   setInventoryData(inventoryData);
      //   break;
      default:
        setInventoryData(inventoryData);
    }
    setInventoryData(inventoryData);
  }, [location.pathname, inventoryData]);

  const dropDownList = {
    items: [
      "Add New Inventory",
      "Create New Category",
      "Create New Sub-Category",
      "Create New Location",
      "Export List",
    ],
    onClickLink: (index: number) => {
      switch (index) {
        case 0:
          setFormType("newInventory");
          setIsOpen(true);
          break;
        case 1:
          setFormType("newCategory");
          setIsOpen(true);
          break;
        case 2:
          setFormType("newSubCategory");
          setIsOpen(true);
          break;
        case 3:
          setFormType("newLocation");
          setIsOpen(true);
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

  const inventoryPaths = ["all", "regular", "out-of-stock", "deleted"];

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
              value={
                inventoryData?.inventories?.filter(
                  (item) => item.batches && item.batches.length > 0
                )?.length ?? 0
              }
            />
            <TitlePill
              icon={inventorygradient}
              iconBgColor="bg-[#FDEEC2]"
              topText="Regular"
              bottomText="INVENTORY"
              value={1}
            />
            <TitlePill
              icon={inventorygradient}
              iconBgColor="bg-[#FDEEC2]"
              topText="Refurbished"
              bottomText="INVENTORY"
              value={0}
            />
            <TitlePill
              icon={cancelled}
              iconBgColor="bg-[#FFDBDE]"
              topText="Deleted"
              bottomText="INVENTORY"
              value={0}
            />
          </div>
          <div className="flex w-full items-center justify-between gap-2 min-w-max sm:w-max sm:justify-end">
            <ActionButton
              label="New Inventory"
              icon={<img src={circleAction} />}
              onClick={() => {
                setFormType("newInventory");
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
                  element={<Navigate to="/inventory/all" replace />}
                />
                {inventoryPaths.map((path) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <InventoryTable
                        inventoryData={_inventoryData}
                        isLoading={inventoryLoading}
                        refreshTable={allInventoryRefresh}
                      />
                    }
                  />
                ))}
              </Routes>
            </Suspense>
          </section>
        </div>
      </PageLayout>
      {isOpen ? (
        <CreateNewInventory
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          formType={formType}
        />
      ) : null}
    </>
  );
};

export default Inventory;
