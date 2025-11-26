/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { IColumn } from "@/types/IColumn";
import React from "react";
import { AiFillEdit } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";

interface Props {
  columns: IColumn[];
  data: any[];
  noDataText?: string;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}

const DynamicTable: React.FC<Props> = ({
  columns,
  data,
  noDataText = "No data",
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full border-t-[3px]  border-t-[#00b0ea] border border-[#cfd8e3] border-collapse table-fixed ">
        <thead>
          <tr className=" border-b border-[#cfd8e3] text-left bg-[#e2e8f0]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`border-b border-[#cfd8e3]  p-3 align-middle ${
                  col.thClass || ""
                }`}
              >
                <div className="flex ">
                  <span className="font-semibold text-sm ">{col.label}</span>
                  {col.headerComponent && col.headerComponent}
                </div>
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="border-b border-[#cfd8e3] p-3 align-middle text-right w-[120px]">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                className="border-b border-[#cfd8e3] p-4 text-center align-middle"
              >
                {noDataText}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row._id || rowIndex}
                className="hover:bg-gray-50 border-b border-[#cfd8e3] align-middle"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`border-b border-[#cfd8e3] p-3 align-middle`}
                  >
                    {col.render
                      ? col.useValue
                        ? col.render(row[col.key], row)
                        : col.render(row)
                      : row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="border-b border-[#cfd8e3] p-2 align-middle text-right">
                    <div className="inline-flex gap-2">
                      {onEdit && (
                        <button
                          className="px-3 py-3 bg-[#9ca3af] text-white rounded-full cursor-pointer"
                          onClick={() => onEdit(row)}
                        >
                          <AiFillEdit />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className="px-3 py-3 bg-[#ef4444] text-white rounded-full cursor-pointer"
                          onClick={() => onDelete(row)}
                        >
                          <AiOutlineDelete />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
