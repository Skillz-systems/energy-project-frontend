import React from "react";

export type TableType = {
  tableName: string;
};

export const Table = (props: TableType) => {
  const { tableName } = props;
  return (
    <div className="w-full">
      <header>
        <h2>{tableName}</h2>
      </header>
      <table></table>
    </div>
  );
};
