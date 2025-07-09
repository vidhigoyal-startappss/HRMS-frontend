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
   <div className="space-y-6 w-full h-full bg-white py-2 px-5 shadow-md rounded-md border border-[#dbe9f1]">
      {/* Heading */}
      <h2 className="text-xl font-semibold text-[#113F67]">Announcement(s)</h2>

      {/* Announcements List */}
      {announcements.map((announcement, index) => (
        <div key={index} className="border border-[#dbe9f1] rounded-md overflow-hidden">
          {/* Title Button */}
          <button
            onClick={() => toggle(index)}
            className="w-full text-left py-1 px-4 bg-[#f0f8fb] hover:bg-[#dbe9f1] font-medium text-[#113F67] flex justify-between items-center"
          >
            <span>{announcement.title}</span>
            <span>{openIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
          </button>

          {/* Content */}
          {openIndex === index && (
            <div className="px-4 py-3 text-sm text-gray-700 bg-[#f9fcfd] border-t border-[#dbe9f1]">
              {announcement.content}
            </div>
          )}
        </div>
      ))}
    </div>

  );
};

export default AnnouncementBox;
