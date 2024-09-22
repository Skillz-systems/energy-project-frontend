import React, { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import clsx from "clsx";

export type ModalType = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  layout?: "right" | "default";
  bodyStyle?: string;
};

export const Modal = ({
  isOpen,
  onClose,
  children,
  size = "medium",
  layout = "default",
  bodyStyle,
}: ModalType) => {
  const [isClosing, setIsClosing] = useState<boolean>(false);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Slide out animation trigger before closing
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(
      () => {
        setIsClosing(false);
        onClose();
      },
      layout === "right" ? 250 : 0
    );
  };

  if (!isOpen && !isClosing) return null;

  // Modal size mapping
  const sizeClasses = {
    small: "w-[25vw]",
    medium: "w-[50vw]",
    large: "w-[75vw]",
  };

  // Conditional layout styles
  const layoutClasses = clsx(
    layout === "right" &&
      "h-[97vh] mr-1.5 bg-white shadow-lg transition-transform transform rounded-md",
    sizeClasses[size],
    {
      "animate-slide-out-right": isClosing,
      "animate-slide-in-right": !isClosing && layout === "right",
      "translate-x-full": !isClosing && layout === "right",
      "-translate-y-full mt-2": layout !== "right",
    }
  );

  const wrapperClasses = clsx(
    layout === "right"
      ? "fixed inset-0 z-50 flex items-center justify-end"
      : "relative inline-block";

  return (
    <div className={wrapperClasses}>
      <div
        className="fixed inset-0 transition-opacity bg-black opacity-50"
        onClick={handleClose}
        aria-hidden="true"
      ></div>

      {layout === "right" ? (
        <div className={layoutClasses} role="dialog" aria-modal="true">
          <header className="flex items-center justify-end p-2 h-[40px] border-b-[0.6px] border-b-strokeGreyThree">
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-[24px] h-[24px] bg-white border border-strokeGreyTwo rounded-full top-4 right-4"
              aria-label="Close modal"
              title="Close modal"
            >
              <MdCancel className="text-error" />
            </button>
          </header>

          <section className={`${bodyStyle} h-full overflow-auto`}>
            {children}
          </section>
        </div>
      ) : (
        <section className={`${bodyStyle}h-full overflow-auto`}>
          {children}
        </section>
      )}
    </div>
  );
};
