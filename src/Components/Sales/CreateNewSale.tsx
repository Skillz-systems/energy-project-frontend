import React from "react";
//import { KeyedMutator } from "swr";
import { Modal } from "../ModalComponent/Modal";

type CreateSalesType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;

};

const CreateNewSale = ({
  isOpen,
  setIsOpen,

}: CreateSalesType) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        layout="right"
        bodyStyle="pb-[100px]"
      >
        Create New Sale
      </Modal>
    </>
  );
};

export default CreateNewSale;
