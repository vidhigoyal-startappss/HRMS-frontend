import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Announcement {
  title: string;
  content: string;
}

interface AnnouncementBoxProps {
  announcements: Announcement[];
}

const AnnouncementBox: React.FC<AnnouncementBoxProps> = ({ announcements }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-6 w-full h-full bg-white py-10 px-6 shadow-md rounded-md">
      <h2 className="text-xl font-bold">Announcement(s)</h2>
      {announcements.map((announcement, index) => (
        <div key={index} className="border border-blue-200 rounded-md overflow-hidden">
          <button
            onClick={() => toggle(index)}
            className="w-full text-left py-3 px-4 bg-blue-100 hover:bg-blue-200 font-medium flex justify-between items-center"
          >
            {announcement.title}
            <span>{openIndex === index ? <ChevronUp /> : <ChevronDown />}</span>
          </button>
          {openIndex === index && (
            <div className="px-4 py-3 text-gray-700 bg-gray-100 border-t border-blue-200">
              {announcement.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnnouncementBox;
