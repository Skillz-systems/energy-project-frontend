import { DropDown } from "../DropDownComponent/DropDown";
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
  tableData: any[];
};

export const Table = (props: TableType) => {
  const { tableTitle, filterList, columnList, tableData } = props;
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
      <table className="w-full p-[16px_16px_0px_16px] border-[0.6px] border-strokeGreyThree rounded-[20px]">
        <thead>
          <tr className="h-[32px]">
            {columnList.map((column, index) => (
              <th
                key={index}
                className="p-2 text-xs font-light text-left text-textDarkGrey border-b-[0.2px] border-[#E0E0E0]"
              >
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-strokeGreyTwo rounded-full"></span>
                  <span>{column.title}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex} className="h-[40px]">
              {columnList.map((column, colIndex) => {
                const cellValue = row[column.key];

                return (
                  <td
                    key={colIndex}
                    className="px-2 text-xs text-textDarkGrey border-b-[0.2px] border-[#E0E0E0]"
                  >
                    {column.valueIsAComponent && column.customValue ? (
                      column.customValue(cellValue)
                    ) : (
                      <span>{cellValue || "-"}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
