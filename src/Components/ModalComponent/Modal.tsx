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
  leftHeaderComponents?: React.ReactNode;
  rightHeaderComponents?: React.ReactNode;
};

export const Modal = ({
  isOpen,
  onClose,
  children,
  size = "medium",
  layout = "default",
  bodyStyle,
  leftHeaderComponents,
  rightHeaderComponents,
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
    if (isOpen) {
      setIsClosing(true);
      setTimeout(
        () => {
          setIsClosing(false);
          onClose();
        },
        layout === "right" ? 250 : 0
      );
    }
  };

  if (!isOpen && !isClosing) return null;

  // Modal size mapping
  const sizeClasses = {
    small: "w-[90vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] xl:w-[25vw]",
    medium: "w-[95vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw]",
    large: "w-[100vw] sm:w-[90vw] md:w-[75vw] lg:w-[65vw] xl:w-[50vw]",
  };

  // Conditional layout styles
  const layoutClasses = clsx(
    layout === "right" &&
      "h-[100vh] mt-2 mr-1.5 bg-white shadow-lg transition-transform transform rounded-md",
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
      : "relative inline-block"
  );

  return (
    <div className={wrapperClasses}>
      <div
        className={`fixed inset-0 ${
          layout === "default" ? "z-40" : ""
        } transition-opacity bg-black opacity-50`}
        onClick={handleClose}
        aria-hidden="true"
      ></div>

      {layout === "right" ? (
        <div className={layoutClasses} role="dialog" aria-modal="true">
          <header
            className={`flex items-center p-2 h-[40px] border-b-[0.6px] border-b-strokeGreyThree ${
              leftHeaderComponents ? "justify-between" : "justify-end"
            }`}
          >
            <div className="flex items-center gap-1">
              {leftHeaderComponents}
            </div>
            <div className="flex items-center gap-1">
              {rightHeaderComponents}
              <button
                onClick={handleClose}
                className="flex items-center justify-center w-[24px] h-[24px] bg-white border border-strokeGreyTwo rounded-full top-4 right-4 hover:bg-slate-100"
                aria-label="Close modal"
                title="Close modal"
              >
                <MdCancel className="text-error" />
              </button>
            </div>
          </header>

          <section className={`${bodyStyle} h-full overflow-auto`}>
            {children}
          </section>
        </div>
      ) : (
        <section className={`${bodyStyle} h-full overflow-auto`}>
          {children}
        </section>
      )}
    </div>
  );
};
