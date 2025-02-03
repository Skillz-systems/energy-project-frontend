import { useState } from "react";
import { PaginationType, Table } from "../TableComponent/Table";
import { CardComponent } from "../CardComponents/CardComponent";
import ProductModal from "./ProductModal";
import { KeyedMutator } from "swr";
import { ApiErrorStatesType, useApiCall } from "../../utils/useApiCall";
import { ErrorComponent } from "@/Pages/ErrorPage";

interface AllProductEntries {
  productId: string;
  productImage: string;
  productName: string;
  productTag: string;
  productPrice: string;
}

// Helper function to map the API data to the ProductEntries format
const generateProductEntries = (data: any): AllProductEntries[] => {
  const entries: AllProductEntries[] = data?.updatedResults?.map(
    (product: any) => {
      return {
        productId: product?.id,
        productImage: product?.image,
        productName: product.name,
        productTag: product?.category?.name,
        productPrice: product?.priceRange,
      };
    }
  );

  return entries;
};

const ProductsTable = ({
  productData,
  isLoading,
  refreshTable,
  error,
  errorData,
  paginationInfo,
}: {
  productData: any;
  isLoading: boolean;
  refreshTable: KeyedMutator<any>;
  error: any;
  errorData: ApiErrorStatesType;
  paginationInfo: PaginationType;
}) => {
  const { apiCall } = useApiCall();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [productId, setProductId] = useState<string>("");
  const [queryValue, setQueryValue] = useState<string>("");
  const [queryData, setQueryData] = useState<any>(null);
  const [queryLoading, setQueryLoading] = useState<boolean>(false);
  const [isSearchQuery, setIsSearchQuery] = useState<boolean>(false);

  const filterList = [
    // {
    //   name: "All Products",
    //   items: ["SHS", "EAAS", "Rootop"],
    //   onClickLink: (index: number) => {
    //     console.log("INDEX:", index);
    //   },
    // },
    {
      name: "Search",
      onSearch: async (query: string) => {
        setIsSearchQuery(true);
        if (queryData) setQueryData(null);
        setQueryLoading(true);
        setQueryValue(query);
        try {
          const response = await apiCall({
            endpoint: `/v1/products?search=${encodeURIComponent(query)}`,
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

  const dropDownList = {
    items: ["View Product", "Cancel Product"],
    onClickLink: (index: number, cardData: any) => {
      switch (index) {
        case 0:
          setProductId(cardData?.productId);
          setIsOpen(true);
          break;
        case 1:
          console.log("Cancel product");
          break;
        default:
          break;
      }
    },
    defaultStyle: true,
    showCustomButton: true,
  };

  const getTableData = () => {
    if (queryValue && queryData) {
      return generateProductEntries(queryData);
    } else return generateProductEntries(productData);
  };

  return (
    <>
      {!error ? (
        <div className="w-full">
          <Table
            tableType="card"
            tableTitle="ALL PRODUCTS"
            tableClassname="flex flex-wrap items-center gap-4"
            tableData={getTableData()}
            loading={queryLoading || isLoading}
            filterList={filterList}
            cardComponent={(data) => {
              return data?.map((item: AllProductEntries, index) => (
                <CardComponent
                  key={index}
                  variant="product-no-image"
                  productId={item.productId}
                  productImage={item.productImage}
                  productName={item.productName}
                  productTag={item.productTag}
                  productPrice={item.productPrice}
                  dropDownList={dropDownList}
                />
              ));
            }}
            refreshTable={async () => {
              await refreshTable();
              setQueryData(null);
            }}
            queryValue={isSearchQuery ? queryValue : ""}
            paginationInfo={paginationInfo}
          />
          {productId && (
            <ProductModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              productID={productId}
              refreshTable={refreshTable}
            />
          )}
        </div>
      ) : (
        <ErrorComponent
          message="Failed to fetch product list."
          className="rounded-[20px]"
          refreshData={refreshTable}
          errorData={errorData}
        />
      )}
    </>
  );
};

export default ProductsTable;
