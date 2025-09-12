// import React from "react";
// // import AttendanceTracker from "../components/Attendance/AttendanceTracker";
// // import AnnouncementBox from "../components/Announcement/Announcement";
// // import BirthdayBox from "../components/BirthdayBox/BirthdayBox";
// // import LeaveProgressBar, {
// //   LeaveType,
// // } from "../components/LeaveProgressBar/LeaveProgressBar";
// import EmployeeBasicDashboard from "../pages/EmployeeBasicDashboard";
// import { useEmployeeLeaveStats } from "./useEmployeeLeaveStats";
// import { useSelector } from "react-redux";

// import { RootState } from "../store/store";

// const EmployeeDashboard = () => {
//     useEmployeeLeaveStats();
//   const { leaveSummary } = useSelector((state: RootState) => state.leave);

//   // const birthdays = [
//   //   { name: "Aisha Khan", date: "2025-04-28" },
//   //   { name: "Ravi Patel", date: "2025-05-26" },
//   // ];

//   // const announcements = [
//   //   {
//   //     title: "New Leave Policy",
//   //     content: "We’ve updated our leave policy effective May 1st.",
//   //   },
//   //   {
//   //     title: "System Downtime",
//   //     content:
//   //       "The HR portal will be under maintenance on Sunday from 2am to 4am.",
//   //   },
//   //   {
//   //     title: "Monthly Meetup",
//   //     content: "Join us for the virtual town hall meeting this Friday at 3 PM.",
//   //   },
//   // ];

//   // const handleSendWish = (name: string) => {
//   //   alert(` Birthday wish sent to ${name}!`);
//   // };

//   return (
//     <div className="w-full max-w-[1400px] px-4 py-4">
//       {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
//         {/* <AttendanceTracker /> */}
//         <div className="w-full">
//            {/* <LeaveProgressBar leaveData={leaveStats} /> */}
//            <EmployeeBasicDashboard leaveSummary = {leaveSummary} />
//         {/* </div> */}
//       </div>

//       {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"> */}
//         {/* <AnnouncementBox announcements={announcements} /> */}
//         {/* <BirthdayBox birthdays={birthdays} onSendWish={handleSendWish} /> */}
//       {/* </div> */}
//      </div>
//   );
// };

// export default EmployeeDashboard;
// function useSelector(arg0: (state: RootState) => LeaveState): { leaveSummary: any; } {
//   throw new Error("Function not implemented.");
// }

import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEmployeeLeaveStats } from "../hooks/useEmployeeLeaveStats";
// import { useEmployeeLeaveStats } from "../hooks/useEmployeeLeaveStats";
import EmployeeBasicDashboard from "./EmployeeBasicDashboard";
import AttendanceManagement from "./AttendanceMangement";
import AttendanceTracker from "../components/Attendance/AttendanceTracker";

const EmployeeDashboard = () => {
  useEmployeeLeaveStats();
  const { leaveSummary } = useSelector((state: RootState) => state.leave);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-10 space-y-10">
      <div className="w-full flex justify-center">
         <div className="w-[500px]">
          <AttendanceTracker />
        </div>
      </div>
       <div className="w-full flex justify-center">
        <EmployeeBasicDashboard leaveSummary={leaveSummary} />
      </div>
    </div>
  );
};
export default EmployeeDashboard;

