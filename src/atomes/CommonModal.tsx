

// import React, { useEffect } from "react";

// type CommonModalProps = {
//   isOpen: boolean;
//   title: string;
//   onClose: () => void;
//   children: React.ReactNode;
//   postion?: "left" | "right" | "center"; // Optional prop to control the position of the modal
//   hight?: "full" | "half" | "auto"; // Optional prop to control the height of the modal 
// };

// export const CommonModal: React.FC<CommonModalProps> = ({
//   isOpen,
//   title,
//   onClose,
//   children,postion="center",hight="auto"
// }) => {
//   // Prevent background scrolling when panel is open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div 
//       className={`fixed inset-0 z-50 flex ${postion === "left" ? "justify-start" : postion === "right" ? "justify-end" : "justify-center"} bg-black/50 backdrop-blur-sm transition-opacity duration-300`}
//       onClick={onClose} // Click backdrop to close
//     >
//       <div 
//         className={`h-${hight === "full" ? "full" : hight === "half" ? "1/2" : "auto"}  w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right`}
//         onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the panel
//       >
//         {/* Panel Header */}
//         <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
//           <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          
//           <button 
//             onClick={onClose}
//             className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
//             aria-label="Close panel"
//           >
//             <span className="text-xl font-light">✕</span>
//           </button>
//         </div>

//         {/* Panel Content (Scrollable if form is long) */}
//         <div className="flex-1 overflow-y-auto px-6 py-5">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useEffect } from "react";

type CommonModalProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  position?: "left" | "right" | "center"; // Fixed spelling typo
  height?: "full" | "half" | "auto";      // Fixed spelling typo
};

export const CommonModal: React.FC<CommonModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  position = "center",
  height = "auto",
}) => {
  // Prevent background scrolling when panel is open
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

  // 1. Map positions safely to static Tailwind strings
  const positionClasses = {
    left: "justify-start items-stretch",
    right: "justify-end items-stretch",
    center: "justify-center items-center p-4", // "items-center" forces vertical centering
  };

  // 2. Map heights safely to static Tailwind strings
  const heightClasses = {
    full: "h-full",
    half: "h-1/2",
    auto: "h-auto ", // Prevents auto height from spilling off-screen
  };

  // 3. Optional rounded corner styling based on placement
  const roundedClasses = {
    left: "rounded-r-2xl",
    right: "rounded-l-2xl",
    center: "rounded-2xl",
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex ${positionClasses[position]} bg-black/50 backdrop-blur-sm transition-opacity duration-300`}
      onClick={onClose} // Click backdrop to close
    >
      <div
        className={`${heightClasses[height]} ${roundedClasses[position]} w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
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

        {/* Panel Content (Scrollable if form is long) */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
};