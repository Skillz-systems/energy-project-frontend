import React, { useState } from "react";
import { DropDown } from "../DropDownComponent/DropDown";
import { copyToClipboard } from "../../utils/helpers";
import { PiCopySimple } from "react-icons/pi";
import { Pagination } from "../PaginationComponent/Pagination";

export type TableType = {
  tableTitle: string;
  filterList: {
    name?: string;
    items?: string[];
    onClickLink?: (index: number) => void;
    buttonImgStyle?: string;
    dropDownContainerStyle?: string;
    isSearch?: boolean;
    isDate?: boolean;
    onDateClick?: (date: string) => void;
  }[];
  columnList: {
    title: string;
    key: string;
    valueIsAComponent?: boolean;
    customValue?: (value: string | number) => JSX.Element;
    width?: string;
    rightIcon?: React.ReactNode;
  }[];
  tableStyle?: string;
  tableData: any[];
  tableType?: "default" | "card";
  cardComponent: (data: any[]) => React.ReactNode;
};

export const Table = (props: TableType) => {
  const {
    tableTitle,
    filterList,
    columnList,
    tableStyle,
    tableData,
    tableType = "default",
    cardComponent,
  } = props;
  const [hoveredCell, setHoveredCell] = useState<{
    rowIndex: number;
    colIndex: number;
  } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(20);

  const totalEntries = tableData.length;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedData = tableData.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col w-full gap-2">
      <header className="flex items-center justify-between gap-2 p-[8px_8px_8px_16px] bg-paleGrayGradient border-[0.6px] border-strokeGreyThree rounded-full">
        <div className="flex items-center gap-0.5">
          <h2 className="text-sm font-bold text-textDarkGrey">{tableTitle}</h2>
          <span className="text-sm font-base text-textLightGrey">
            [Filter Table Title]
          </span>
        </div>
        <div className="flex items-center justify-end gap-2">
          {filterList.map((filter, index) => (
            <DropDown key={index} {...filter} />
          ))}
        </div>
      </header>
      <section
        className={`${tableStyle} w-full p-[16px_16px_0px_16px] border-[0.6px] border-strokeGreyThree rounded-[20px]`}
      >
        {tableType === "default" ? (
          <table>
            <thead>
              <tr className="h-[32px]">
                {columnList.map((column, index) => (
                  <th
                    key={index}
                    className={`${column.width} p-2 text-xs font-light text-left text-textDarkGrey border-b-[0.2px] border-[#E0E0E0]`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-strokeGreyTwo rounded-full"></span>
                      <span>{column.title}</span>
                      {column.rightIcon}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="h-[40px] hover:opacity-80">
                  {columnList.map((column, colIndex) => {
                    const cellValue = row[column.key];

                    return (
                      <td
                        key={colIndex}
                        className="px-2 text-xs text-textDarkGrey border-b-[0.2px] border-[#E0E0E0]"
                        onMouseOver={() =>
                          setHoveredCell({ rowIndex, colIndex })
                        }
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {column.valueIsAComponent && column.customValue ? (
                          column.customValue(cellValue)
                        ) : (
                          <div className="flex items-center justify-between">
                            <span>{cellValue || "-"}</span>
                            {colIndex === 0 ||
                            colIndex === columnList.length - 1 ? null : (
                              <span
                                className="flex items-center justify-center w-5 h-5 rounded-full cursor-pointer"
                                onClick={() => copyToClipboard(cellValue)}
                              >
                                {hoveredCell?.rowIndex === rowIndex &&
                                hoveredCell?.colIndex === colIndex ? (
                                  <PiCopySimple />
                                ) : null}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          cardComponent(paginatedData)
        )}
        <Pagination
          totalEntries={totalEntries}
          entriesPerPage={entriesPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onEntriesPerPageChange={setEntriesPerPage}
        />
      </section>
    </div>
  );
};
