import { lazy, Suspense, useEffect, useState } from "react";
import PageLayout from "./PageLayout";
import productsbadge from "../assets/products/productsbadge.png";
import { TitlePill } from "../Components/TitlePillComponent/TitlePill";
import ActionButton from "../Components/ActionButtonComponent/ActionButton";
import { DropDown } from "../Components/DropDownComponent/DropDown";
import circleAction from "../assets/settings/addCircle.svg";
import productgradient from "../assets/products/productgradient.svg";
import productgreen from "../assets/products/productgreen.svg";
import cancelled from "../assets/cancelled.svg";
import LoadingSpinner from "../Components/Loaders/LoadingSpinner";
import { SideMenu } from "../Components/SideMenuComponent/SideMenu";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import CreateNewProduct from "../Components/Products/CreateNewProduct";
import { generateRandomProductEntries } from "../Components/TableComponent/sampleData";
// import { useGetRequest } from "../utils/useApiCall";

const ProductsTable = lazy(
  () => import("../Components/Products/ProductsTable")
);

const Products = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [productData, setProductData] = useState<any>(null); // Temporary
  //   const {
  //     data: productData,
  //     isLoading: productLoading,
  //     mutate: allProductsRefresh,
  //   } = useGetRequest("/v1/products", true, 60000);

  const navigationList = [
    {
      title: "All Product",
      link: "/products/all",
      count: 100,
      onclick: () => {},
    },
    {
      title: "SHS",
      link: "/products/shs",
      count: 50,
      onclick: () => {},
    },
    {
      title: "EAAS",
      link: "/products/eaas",
      count: 25,
      onclick: () => {},
    },
    {
      title: "Rooftop",
      link: "/products/rooftop",
      count: 25,
      onclick: () => {},
    },
  ];

  useEffect(() => {
    switch (location.pathname) {
      case "/products/all":
        setProductData(generateRandomProductEntries(100));
        break;
      case "/products/shs":
        setProductData(generateRandomProductEntries(50, ["SHS"]));
        break;
      case "/products/eaas":
        setProductData(generateRandomProductEntries(25, ["EAAS"]));
        break;
      case "/products/rooftop":
        setProductData(generateRandomProductEntries(25, ["Rooftop"]));
        break;
      default:
        setProductData(generateRandomProductEntries(100));
    }
  }, [location.pathname]);

  const dropDownList = {
    items: ["Add New Product", "Export List"],
    onClickLink: (index: number) => {
      switch (index) {
        case 0:
          setIsOpen(true);
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

  const productPaths = ["all", "shs", "eaas", "rooftop"];

  return (
    <>
      <PageLayout pageName="Products" badge={productsbadge}>
        <section className="flex flex-col-reverse sm:flex-row items-center justify-between w-full bg-paleGrayGradient px-2 md:px-8 py-4 gap-2 min-h-[64px]">
          <div className="flex flex-wrap w-full items-center gap-2 gap-y-3">
            <TitlePill
              icon={productgradient}
              iconBgColor="bg-[#FDEEC2]"
              topText="All"
              bottomText="PRODUCTS"
              value={40}
            />
            <TitlePill
              icon={productgreen}
              iconBgColor="bg-[#E3FAD6]"
              topText="Instalmental"
              bottomText="PRODUCTS"
              value={22}
            />
            <TitlePill
              icon={productgreen}
              iconBgColor="bg-[#E3FAD6]"
              topText="Single Deposit"
              bottomText="PRODUCTS"
              value={7}
            />
            <TitlePill
              icon={productgreen}
              iconBgColor="bg-[#E3FAD6]"
              topText="Recharge"
              bottomText="PRODUCTS"
              value={7}
            />
            <TitlePill
              icon={cancelled}
              iconBgColor="bg-[#FFDBDE]"
              topText="Cancelled"
              bottomText="PRODUCTS"
              value={4}
            />
          </div>
          <div className="flex w-full items-center justify-between gap-2 min-w-max sm:w-max sm:justify-end">
            <ActionButton
              label="New Product"
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
                  element={<Navigate to="/products/all" replace />}
                />
                {productPaths.map((path) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <ProductsTable
                        productData={productData}
                        isLoading={!productData?.length}
                      />
                    }
                  />
                ))}
              </Routes>
            </Suspense>
          </section>
        </div>
      </PageLayout>
      <CreateNewProduct isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Products;
