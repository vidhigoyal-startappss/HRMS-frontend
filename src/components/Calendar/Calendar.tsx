import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./custom-calendar.css";

const holidays: Date[] = [
  new Date(2025, 3, 14), // April 14, 2025
  new Date(2025, 4, 1), // May 1, 2025
];

const isHoliday = (date: Date): boolean =>
  holidays.some(
    (holiday) =>
      date.getFullYear() === holiday.getFullYear() &&
      date.getMonth() === holiday.getMonth() &&
      date.getDate() === holiday.getDate()
  );

const HolidayCalendar: React.FC = () => {
  const [value, setValue] = useState<Date | Date[]>(new Date());

  return (
    <div className="p-4 bg-white rounded-xl shadow-md shadow-blue-950 max-w-md w-full mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Employee Calendar</h2>
      <Calendar
        onChange={setValue}
        value={value}
        tileClassName={({ date, view }) =>
          view === "month" && isHoliday(date) ? "holiday-tile" : ""
        }
        className="rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default HolidayCalendar;
