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
import CreateNewProduct, {
  ProductFormType,
} from "../Components/Products/CreateNewProduct";
import { useGetRequest } from "../utils/useApiCall";

const ProductsTable = lazy(
  () => import("../Components/Products/ProductsTable")
);

const Products = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [_productData, setProductData] = useState<any>(null);
  const [formType, setFormType] = useState<ProductFormType>("newProduct");

  const {
    data: productData,
    isLoading: productLoading,
    mutate: allProductsRefresh,
    errorStates: allProductsErrorStates,
  } = useGetRequest("/v1/products", true, 60000);

  const fetchAllProductStats = useGetRequest(
    "/v1/products/statistics/view",
    true,
    60000
  );

  const navigationList = [
    {
      title: "All Product",
      link: "/products/all",
      count: fetchAllProductStats.data?.allProducts || 0,
    },
    // {
    //   title: "SHS",
    //   link: "/products/shs",
    //   count: 50,
    // },
    // {
    //   title: "EAAS",
    //   link: "/products/eaas",
    //   count: 25,
    // },
    // {
    //   title: "Rooftop",
    //   link: "/products/rooftop",
    //   count: 25,
    // },
  ];

  useEffect(() => {
    switch (location.pathname) {
      case "/products/all":
        setProductData(productData);
        break;
      // case "/products/shs":
      //   setProductData(productData);
      //   break;
      // case "/products/eaas":
      //   setProductData(productData);
      //   break;
      // case "/products/rooftop":
      //   setProductData(productData);
      //   break;
      default:
        setProductData(productData);
    }
  }, [location.pathname, productData]);

  const dropDownList = {
    items: ["Add New Product", "Create New Category", "Export List"],
    onClickLink: (index: number) => {
      switch (index) {
        case 0:
          setFormType("newProduct");
          setIsOpen(true);
          break;
        case 1:
          setFormType("newCategory");
          setIsOpen(true);
          break;
        case 2:
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
              value={fetchAllProductStats.data?.allProducts || 0}
            />
            <TitlePill
              icon={productgreen}
              iconBgColor="bg-[#E3FAD6]"
              topText="Instalmental"
              bottomText="PRODUCTS"
              value={0}
            />
            <TitlePill
              icon={productgreen}
              iconBgColor="bg-[#E3FAD6]"
              topText="Single Deposit"
              bottomText="PRODUCTS"
              value={0}
            />
            <TitlePill
              icon={productgreen}
              iconBgColor="bg-[#E3FAD6]"
              topText="Recharge"
              bottomText="PRODUCTS"
              value={0}
            />
            <TitlePill
              icon={cancelled}
              iconBgColor="bg-[#FFDBDE]"
              topText="Cancelled"
              bottomText="PRODUCTS"
              value={0}
            />
          </div>
          <div className="flex w-full items-center justify-between gap-2 min-w-max sm:w-max sm:justify-end">
            <ActionButton
              label="New Product"
              icon={<img src={circleAction} />}
              onClick={() => {
                setFormType("newProduct");
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
                  element={<Navigate to="/products/all" replace />}
                />
                {productPaths.map((path) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <ProductsTable
                        productData={_productData}
                        isLoading={productLoading}
                        refreshTable={allProductsRefresh}
                        errorData={allProductsErrorStates}
                      />
                    }
                  />
                ))}
              </Routes>
            </Suspense>
          </section>
        </div>
      </PageLayout>
      <CreateNewProduct
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refreshTable={allProductsRefresh}
        formType={formType}
      />
    </>
  );
};

export default Products;
