import React, { useState } from "react";
import search from "../../assets/table/searchdropdown.svg";

export type TableSearchType = {
  name?: string;
  onSearch?: (query: string) => void;
  queryValue?: string;
  refreshTable?: () => Promise<any>;
};

export const TableSearch = (props: TableSearchType) => {
  const { name, onSearch, queryValue, refreshTable } = props;
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [query, setQuery] = useState<string>(queryValue);

  const handleSearch = () => {
    if (onSearch) onSearch(query);
    setIsSearching(false);
  };

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value === "" && refreshTable) {
      await refreshTable();
      setIsSearching(false);
    }
  };

  return (
    <div className="relative flex w-max">
      {queryValue || isSearching ? (
        // Input field is shown when isSearching is true
        <div className="flex items-center gap-2">
          <input
            type="search"
            className="text-xs font-medium text-textDarkGrey pl-2 pr-1 py-1 border-[0.6px] border-strokeGreyThree rounded-full"
            value={query}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            autoFocus
            placeholder="Enter your query"
          />
        </div>
      ) : (
        // Button is shown when isSearching is false
        <button
          className="flex items-center justify-between w-max gap-6 pl-2 pr-1 py-1 bg-[#F9F9F9] border-[0.6px] border-strokeGreyThree rounded-full"
          onClick={() => setIsSearching(true)}
        >
          <span className="text-xs font-medium text-textGrey">{name}</span>
          <img src={search} alt="Search Icon" className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
