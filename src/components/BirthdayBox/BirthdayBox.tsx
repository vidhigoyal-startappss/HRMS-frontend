import React, { useState } from "react";
import { Cake, Send, Info } from "lucide-react";

interface Birthday {
  name: string;
  date: string;
}

interface BirthdayBoxProps {
  birthdays: Birthday[];
  onSendWish: (name: string) => void;
}

const BirthdayBox: React.FC<BirthdayBoxProps> = ({ birthdays, onSendWish }) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="space-y-6 w-full h-full bg-gray-300 py-2 px-5 shadow-md rounded-md border border-[#dbe9f1] relative">
      {/* Header with i button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#113F67]">Birthdays</h2>
        <div className="relative">
          <button
            className="text-[#113F67] hover:text-[#226597]"
            onClick={() => setShowInfo(!showInfo)}
            aria-label="Info"
          >
            <Info size={18} />
          </button>
          {showInfo && (
            <div className="absolute right-0 mt-2 w-52 text-sm text-gray-700 bg-white border border-gray-300 shadow-md rounded p-2 z-50">
              🚧 This feature is in progress.
            </div>
          )}
        </div>
      </div>

      {/* Birthday List */}
      {birthdays.length === 0 ? (
        <p className="text-gray-600 italic">No upcoming birthdays.</p>
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
                className="flex items-center gap-2 bg-[#113F67] text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-[#226597] transition duration-200"
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
