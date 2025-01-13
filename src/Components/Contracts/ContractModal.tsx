import React, { useCallback, useEffect } from "react";

const ContractModal = ({
  setIsOpen,
  contractDocData,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contractDocData: any;
}) => {
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose]);

  return (
    <div className="flex items-center justify-center w-full">
      <div
        className="fixed inset-0 z-40 transition-opacity bg-black opacity-50"
        onClick={handleClose}
        aria-hidden="true"
      ></div>
      <section className="fixed inset-y-0 inset-x-[20%] z-50">
        <div className="flex flex-col w-full bg-white p-4 h-screen">
          Contract Document PDF {contractDocData?.contractID}
        </div>
      </section>
    </div>
  );
};

export default ContractModal;
