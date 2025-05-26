import React, { useState } from "react";
import { Pencil, Trash2, UserRound } from "lucide-react";
import ConfirmationModal from "../Modal/ConfirmModal";

type Employee = {
  id: string;
  name: string;
  profile: string;
  doj: string;
  role: string;
  dept: string;
  actions: "edit" | "delete"; // optional: if you still want to keep this
};

type TableProps = {
  headers: string[];
  data: Employee[];
};

const Table: React.FC<TableProps> = ({ headers, data }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleDeleteUser = () => {
    console.log("user deleted");
  };
  const handleDeleteButton = () => {
    setModalOpen(true);
  };
  return (
    <div className="overflow-x-auto rounded-xl shadow-md">
      <table className="min-w-full text-sm text-left text-gray-700 bg-white">
        <thead className="bg-blue-900 text-white border-b">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 font-semibold tracking-wide uppercase"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b bg-gray-100 hover:bg-gray-50"
            >
              {headers.map((header, colIndex) => (
                <td key={colIndex} className="px-6 py-4 text-md text-black">
                  {header === "profile" ? (
                    <UserRound size={16} />
                  ) : header === "actions" ? (
                    <div className="flex gap-4 cursor-pointer">
                      <button className="text-blue-500">
                        <Pencil size={16} />
                      </button>
                      <button
                        className="text-red-500 cursor-pointer"
                        onClick={handleDeleteButton}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    // @ts-ignore
                    row[header]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen && (
        <>
          <ConfirmationModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            message="Are you want to sure delete Employee"
            confirmText="detete"
            onConfirm={handleDeleteUser}
            cancelText="cancel"
          />
        </>
      )}
    </div>
  );
};

export default Table;
