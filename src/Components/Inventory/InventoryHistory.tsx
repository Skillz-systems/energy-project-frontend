// import { useState } from "react";
import { Table } from "../TableComponent/Table";
import { NairaSymbol } from "../CardComponents/CardComponent";
import { formatDateTime, formatNumberWithCommas } from "@/utils/helpers";
import roletwo from "../../assets/table/roletwo.svg";
import { GoDotFill } from "react-icons/go";

// interface InventoryHistoryEntries {
//   datetime: string;
//   stockNumber: number;
//   stockValue: number;
//   staffName: string;
// }

// Helper function to map the API data to the desired format
// const generateInventoryEntries = (data: any): InventoryHistoryEntries[] => {
//   const entries: InventoryHistoryEntries[] = data?.map((item: any) => {
//     return {
//       datetime: item.date,
//       stockNumber: item.stockNumber,
//       stockValue: item.stockValue,
//       staffName: item.staffName,
//     };
//   });

//   return entries;
// };

const InventoryHistory = ({ historyData }: { historyData: any }) => {
  // const [historyId, setHistoryID] = useState<string | number>("");
  // const [isOpen, setIsOpen] = useState<boolean>(false);

  const columnList = [
    {
      title: "DATE & TIME",
      key: "datetime",
      styles: "w-[20%]",
      valueIsAComponent: true,
      customValue: (value: string) => {
        return (
          <div className="flex items-center justify-center gap-1 bg-[#F6F8FA] px-2 py-1 w-max border-[0.4px] border-strokeGreyTwo rounded-full">
            <p className="text-xs text-textDarkGrey font-semibold">
              {formatDateTime("date", value)}
            </p>
            <GoDotFill color="#E2E4EB" />
            <p className="text-xs text-textDarkGrey">
              {formatDateTime("time", value)}
            </p>
          </div>
        );
      },
    },
    {
      title: "STOCK NUMBER",
      key: "stockNumber",
      styles: "w-[20%]",
      valueIsAComponent: true,
      customValue: (value: number) => {
        return (
          <span className="text-textBlack">
            {formatNumberWithCommas(value)}
          </span>
        );
      },
    },
    {
      title: "STOCK VALUE",
      key: "stockValue",
      styles: "w-[15%]",
      valueIsAComponent: true,
      customValue: (value: number) => {
        return (
          <div className="flex items-center gap-1">
            <NairaSymbol color="#A58730" />
            <span className="text-textBlack">
              {formatNumberWithCommas(value)}
            </span>
          </div>
        );
      },
    },
    {
      title: "STAFF",
      key: "staffName",
      styles: "w-[25%]",
      valueIsAComponent: true,
      customValue: (value: string) => {
        return (
          <div className="flex items-center gap-1 h-[24px]">
            <img src={roletwo} alt="Icon" />
            <span className="flex items-center justify-center bg-[#EFF2FF] px-2 h-full rounded-full text-xs font-semibold text-textBlack capitalize">
              {value}
            </span>
          </div>
        );
      },
    },
    {
      title: "ACTIONS",
      key: "actions",
      valueIsAComponent: true,
      customValue: (value: any, rowData: any) => {
        return (
          <span
            className="px-2 py-1 text-[10px] text-textBlack font-medium bg-[#F6F8FA] border-[0.2px] border-strokeGreyTwo rounded-full shadow-innerCustom cursor-pointer transition-all hover:bg-gold"
            onClick={() => {
              // setHistoryID(rowData.id);
              // setIsOpen(true);
              console.log(value, rowData);
            }}
          >
            View
          </span>
        );
      },
    },
  ];

  return (
    <>
      <div className="w-full">
        <Table
          showHeader={false}
          columnList={columnList}
          loading={!historyData}
          tableData={historyData}
        />
      </div>
    </>
  );
};

export default InventoryHistory;
