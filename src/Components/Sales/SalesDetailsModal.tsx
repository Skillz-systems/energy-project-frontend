import React from "react";
import { KeyedMutator } from "swr";

const SalesDetailsModal = ({
  isOpen,
  setIsOpen,
  salesID,
  refreshTable,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  salesID: string;
  refreshTable: KeyedMutator<any>;
}) => {
  return <div>SalesDetailsModal</div>;
};

export default SalesDetailsModal;
