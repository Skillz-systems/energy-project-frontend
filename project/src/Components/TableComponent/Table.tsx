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
};

export const Table = (props: TableType) => {
  const { tableTitle, filterList } = props;
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
      <table></table>
    </div>
  );
};
