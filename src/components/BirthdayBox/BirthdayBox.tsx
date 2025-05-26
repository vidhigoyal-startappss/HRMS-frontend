import React from "react";
import { Cake, Send } from "lucide-react";

interface Birthday {
  name: string;
  date: string;
}

interface BirthdayBoxProps {
  birthdays: Birthday[];
  onSendWish: (name: string) => void;
}

const BirthdayBox: React.FC<BirthdayBoxProps> = ({ birthdays, onSendWish }) => {
  return (
    <div className="space-y-6 w-full h-full bg-white py-10 px-6 shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        Birthdays
      </h2>

      {birthdays.length === 0 ? (
        <p className="text-gray-500">No upcoming birthdays.</p>
      ) : (
        <ul className="space-y-3">
          
          {birthdays.map(({ name, date }, index) => (
            <li
              key={index}
              className="flex items-center justify-between px-5 py-2 bg-blue-100 rounded-md"
            > 
              <div>
                <p className="font-semibold text-gray-800">{name}</p>
                <p className="text-sm text-gray-600">
                  {new Date(date).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => onSendWish(name)}
                className="flex items-center gap-2 bg-yellow-500 px-4 py-1.5 rounded hover:bg-yellow-400 text-sm transition duration-200"
              >
                <Send size={14} /> Send Wish
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BirthdayBox;
