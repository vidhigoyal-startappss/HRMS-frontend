import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getTodayEventsByType } from "../../../api/events";

interface Event {
  _id: string;
  type: string;
  title: string;
  description?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  dob?: string;
}

const AnniversaryBox: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBirthdays = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTodayEventsByType("birthday");
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching birthdays:", err);
      setError("Failed to load birthdays.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBirthdays();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
      <h2 className="text-3xl font-bold text-center text-[#113F67] mb-6 border-b pb-2 border-blue-200">
        Today’s Birthdays
      </h2>

      {loading ? (
        <div className="flex items-center gap-2 text-[#226597] text-sm justify-center">
          <Loader2 className="animate-spin" size={18} /> Loading birthdays...
        </div>
      ) : error ? (
        <p className="text-red-500 italic text-center">{error}</p>
      ) : events.length === 0 ? (
        <p className="text-[#226597] italic text-center">No birthdays today.</p>
      ) : (
        <ul className="grid gap-4">
          {events.map(({ _id, firstName, lastName, profileImage, title }) => {
            const fullName = `${firstName || ""} ${lastName || ""}`.trim();
            const avatarUrl =
              profileImage ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                fullName
              )}&background=random`;

            return (
              <li
                key={_id}
                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition duration-300 border border-blue-100"
              >
                <div className="w-16 h-16 rounded-full border-2 border-blue-400 bg-white p-1">
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-[#0A2540] font-semibold text-lg">
                    {fullName}
                  </p>
                  <p className="text-sm text-gray-600">{title}</p>
                  <p className="mt-1 text-blue-700 font-medium animate-pulse">
                    Happy Birthday! Wishing you a fantastic day!
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AnniversaryBox;
