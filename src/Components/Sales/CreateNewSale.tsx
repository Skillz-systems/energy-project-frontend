import React from "react";
import { KeyedMutator } from "swr";

type CreateSalesType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allSalesRefresh: KeyedMutator<any>;
};

const CreateNewSale = ({
  isOpen,
  setIsOpen,
  allSalesRefresh,
}: CreateSalesType) => {
  return <div>CreateNewSale</div>;
};

export default CreateNewSale;
