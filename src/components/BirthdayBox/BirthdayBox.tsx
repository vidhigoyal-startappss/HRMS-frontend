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
    <div className="space-y-6 w-full h-full bg-white py-6 px-5 shadow-md rounded-md border border-[#dbe9f1]">
      <h2 className="text-xl font-semibold text-[#113F67] mb-2 flex items-center gap-2">
        Birthdays
      </h2>

      {birthdays.length === 0 ? (
        <p className="text-gray-500">No upcoming birthdays.</p>
      ) : (
        <ul className="space-y-3">
          {birthdays.map(({ name, date }, index) => (
            <li
              key={index}
              className="flex items-center justify-between px-4 py-2 bg-[#f0f8fb] border border-[#dbe9f1] rounded-md"
            >
              <div>
                <p className="font-medium text-[#113F67]">{name}</p>
                <p className="text-sm text-gray-600">
                  {new Date(date).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => onSendWish(name)}
                className="flex items-center gap-2 bg-[#113F67] text-[#FFF] px-4 py-1.5 rounded-md text-sm font-medium hover:bg-[#] transition duration-200"
              >
                Send Wish
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BirthdayBox;
