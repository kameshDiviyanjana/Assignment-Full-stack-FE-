// import React from "react";

// export  type Column<T> = {
//   header: string;
//   accessor: keyof T;
//   render?: (value: any, row: T) => React.ReactNode;
// };

// type CommonTableProps<T> = {
//   columns: Column<T>[];
//   data: T[];
// };

// export const TableCommon = <T extends Record<string, any>>({
//   columns,
//   data,
// }: CommonTableProps<T>) => {
//   return (
//     <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//         <thead>
//                   <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
//             {columns.map((column) => (
//               <th key={String(column.accessor)} className="px-6 py-3">
//                 {column.header}
//               </th>
//             ))}
//           </tr>
//         </thead>

//                 <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
//           {data.map((row, index) => (
//             <tr key={index}  className={`hover:bg-gray-50 cursor-pointer transition-colors`}
//                     >
//               {columns.map((column) => (
//                 <td
//                   key={String(column.accessor)}
//                       className="px-6 py-4"                >
//                   {column.render
//                     ? column.render(row[column.accessor], row)
//                     : String(row[column.accessor])}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };


import React from "react";

export type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
};

type CommonTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void; // Added prop for row clicking
};

export const TableCommon = <T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
}: CommonTableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
            {columns.map((column) => (
              <th key={String(column.accessor)} className="px-6 py-3">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                No matching tasks found.
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr 
                key={index} 
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onRowClick && onRowClick(row)} // Trigger selection click
              >
                {columns.map((column) => (
                  <td key={String(column.accessor)} className="px-6 py-4">
                    {column.render
                      ? column.render(row[column.accessor], row)
                      : String(row[column.accessor] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};