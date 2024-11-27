import { useState } from "react";
import { Table } from "../TableComponent/Table";
import { CardComponent } from "../CardComponents/CardComponent";
import ProductModal from "../Products/ProductModal";
import { generateAgentEntries} from "../TableComponent/sampleData";
import solarpanel from "../../assets/table/solar-panel.png";
// import { useApiCall } from "../../utils/useApiCall";

interface AgentEntries {
  datetime: string;
  name: string;
  status: string; 
  onGoingSales: number;
  inventoryInPossession: number;
  sales: number;
  registeredCustomers: number;
}

// // Helper function to map the API data to the ProductEntries format
// const generateProductEntries = (data: any): ProductEntries[] => {
//   const entries: ProductEntries[] = data?.products.map((product: any) => {
//     return {
//       productId: product?.id,
//       productTag: product?.tag,
//       productImage: product?.imageUrl,
//       productPrice: product?.price,
//       paymentModes: product?.paymentModes || null,
//       datetime: product?.datetime,
//       name: product?.name,
//     };
//   });

//   return entries;
// };

const AgentsTable = ({
  agentData,
  isLoading,
}: {
  productData: any;
  isLoading: boolean;
}) => {
  // const { apiCall } = useApiCall();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const [productId, setProductId] = useState<string>("");
  // const [queryValue, setQueryValue] = useState<string>("");
  // const [queryData, setQueryData] = useState<any>(null);
  // const [queryLoading, setQueryLoading] = useState<boolean>(false);
  // const [isSearchQuery, setIsSearchQuery] = useState<boolean>(false);

  const filterList = [
    {
      name: "All Agents",
      items: ["SHS", "EAAS", "Rootop"],
      onClickLink: (index: number) => {
        console.log("INDEX:", index);
      },
    },
    {
      name: "Search",
      onSearch: (query: string) => {
        console.log("Query:", query);
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
    onClickLink: (index: number) => {
      switch (index) {
        case 0:
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

  // const getTableData = () => {
  //   if (queryValue && queryData) {
  //     return generateProductEntries(queryData);
  //   } else return generateProductEntries(data);
  // };

  return (
    <>
      <Table
        tableType="card"
        tableTitle="ALL AGENTS"
        tableClassname="flex flex-wrap items-center gap-4"
        tableData={agentData}
        loading={isLoading}
        filterList={filterList}
        cardComponent={(data) => {
          return data?.map((item: AgentEntries, index) => (
            <CardComponent
              key={index}
              variant="agent"
              name={item.name}
              status={item.status}
              onGoingSales={item.onGoingSales}
              inventoryInPossession={item.inventoryInPossession}
              sales={item.sales}
              registeredCustomers={item.registeredCustomers}
            />
          ));
        }}
        // refreshTable={async () => {
        //   await refreshTable();
        //   setQueryData(null);
        // }}
        queryValue={""}
      />
      <ProductModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        // productID={1232763}
        // refreshTable={() => {}}
        productData={generateAgentEntries()}
        inventoryData={Array.from({ length: 10 }, () => ({
          productImage: solarpanel,
          productName: "Monochromatic Solar Panels",
          productPrice: 250000,
        }))}
      />
    </>
  );
};

export default AgentsTable;
