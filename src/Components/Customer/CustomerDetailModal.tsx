import React, { useState } from "react";
import { KeyedMutator } from "swr";
import { Modal } from '@/Components/ModalComponent/Modal';
import editInput from "../../assets/settings/editInput.svg";

const CustomerDetailModal = ({
  isOpen,
  setIsOpen,
  customerID,
  refreshTable,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  customerID: string;
  refreshTable: KeyedMutator<any>;
}) => {
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const [tabContent, setTabContent] = useState<string>("details");

  const handleCancelClick = () => setDisplayInput(false);

  return (
    <Modal
      layout="right"
      bodyStyle="pb-44 overflow-auto"
      isOpen={isOpen}
      onClose={() => {
        setTabContent("details");
        setIsOpen(false);
      }}
      leftHeaderContainerClass="pl-2"
      leftHeaderComponents={<></>}
      rightHeaderComponents={
        displayInput ? (
          <p
            className="text-xs text-textDarkGrey font-semibold cursor-pointer over"
            onClick={handleCancelClick}
            title="Cancel editing user details"
          >
            Cancel Edit
          </p>
        ) : (
          <button
            className="flex items-center justify-center w-[24px] h-[24px] bg-white border border-strokeGreyTwo rounded-full hover:bg-slate-100"
            onClick={() => setDisplayInput(true)}
          >
            <img src={editInput} alt="Edit Button" width="15px" />
          </button>
        )
      }
    >
      <div>CustomerDetailModal</div>
    </Modal>
  );
};

export default CustomerDetailModal;
