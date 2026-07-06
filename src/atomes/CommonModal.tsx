import React, { useEffect } from "react";

type CommonModalProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  position?: "left" | "right" | "center";
  height?: "full" | "half" | "auto";     
};

export const CommonModal: React.FC<CommonModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  position = "center",
  height = "auto",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const positionClasses = {
    left: "justify-start items-stretch",
    right: "justify-end items-stretch",
    center: "justify-center items-center p-4", 
  };

  const heightClasses = {
    full: "h-full",
    half: "h-1/2",
    auto: "h-auto ", 
  };

  const roundedClasses = {
    left: "rounded-r-2xl",
    right: "rounded-l-2xl",
    center: "rounded-2xl",
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex ${positionClasses[position]} bg-black/50 backdrop-blur-sm transition-opacity duration-300`}
      onClick={onClose} 
    >
      <div
        className={`${heightClasses[height]} ${roundedClasses[position]} w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right`}
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
            aria-label="Close panel"
          >
            <span className="text-xl font-light">✕</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
};