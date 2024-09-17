import React, { useEffect } from "react";
import { MdCancel } from "react-icons/md";

export type ModalType = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  layout?: "right" | "default";
};

export const Modal = ({
  isOpen,
  onClose,
  children,
  size = "medium",
  layout = "default",
}: ModalType) => {
  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Modal size mapping
  const sizeClasses = {
    small: "w-[25vw]",
    medium: "w-[50vw]",
    large: "w-[75vw]",
  };

  // Conditional layout styles
  const layoutClasses =
    layout === "right"
      ? `h-[97vh] mr-1.5 ${sizeClasses[size]} bg-white shadow-lg transition-transform transform translate-x-full rounded-md animate-slide-in-right`
      : `absolute bg-white shadow-md rounded-md ${sizeClasses[size]} transform -translate-y-full mt-2`;

  const wrapperClasses =
    layout === "right"
      ? "fixed inset-0 z-50 flex items-center justify-end"
      : "relative inline-block";

  return (
    <div className={wrapperClasses}>
      <div
        className="fixed inset-0 transition-opacity bg-black opacity-50"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {layout === "right" ? (
        <div className={layoutClasses} role="dialog" aria-modal="true">
          <div className="flex items-center justify-end p-2 h-[40px] border-b-[0.6px] border-b-strokeGreyThree">
            <button
              onClick={onClose}
              className="flex items-center justify-center w-[24px] h-[24px] bg-white border border-strokeGreyTwo rounded-full top-4 right-4"
              aria-label="Close modal"
              title="Close modal"
            >
              <MdCancel className="text-error" />
            </button>
          </div>

          <div className="h-full overflow-auto">{children}</div>
        </div>
      ) : (
        <div className="h-full overflow-auto">{children}</div>
      )}
    </div>
  );
};
