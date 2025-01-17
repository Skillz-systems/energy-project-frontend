import React from "react";
import { KeyedMutator } from "swr";
import { Modal } from "../ModalComponent/Modal";

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
  // const handleSubmit
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        layout="right"
        bodyStyle="pb-[100px]"
      >
        {/* <form
          className="flex flex-col items-center bg-white"
          onSubmit={handleSubmit}
          noValidate
        ></form> */}
        SALE
      </Modal>
    </>
  );
};

export default CreateNewSale;
