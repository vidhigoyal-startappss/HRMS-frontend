import React from "react";
import EmployeeCard from "../components/EmployeeCards";
import QuickBtnData from "../assets/data/QuickActionsBtn.json";
import Button from "../components/common/ButtonComp";
import LeaveProgressBar, { LeaveType } from "../components/LeaveProgressBar/LeaveProgressBar";
import TaskBox from "../components/TaskBox/TaskBox";
import AnnouncementBox from "../components/Announcement/Announcement";
import BirthdayBox from "../components/BirthdayBox/BirthdayBox";
import PayslipBreakdown from "../pages/PayslipBreakdown"; // <-- You need to create this

const EmployeeDashboard = () => {
  const leaveStats: LeaveType[] = [
    { type: "Sick Leave", used: 4, total: 10 },
    { type: "Casual Leave", used: 2, total: 5 },
    { type: "Annual Leave", used: 8, total: 15 },
  ];

  const tasks = [
    "Design Login Page",
    "Set up Redux",
    "Implement JWT",
    "Write Tests",
  ];

  const birthdays = [
    { name: "Aisha Khan", date: "2025-04-28" },
    { name: "Ravi Patel", date: "2025-05-26" },
  ];

  const announcements = [
    {
      title: "New Leave Policy",
      content: "We’ve updated our leave policy effective May 1st.",
    },
    {
      title: "System Downtime",
      content: "The HR portal will be under maintenance on Sunday from 2am to 4am.",
    },
    {
      title: "Monthly Meetup",
      content: "Join us for the virtual town hall meeting this Friday at 3 PM.",
    },
  ];

  const handleSendWish = (name: string) => {
    alert(`🎉 Birthday wish sent to ${name}!`);
  };

  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  return (
    <div className="w-full px-4 md:px-8 py-4">
      {/* Title */}
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Dashboard</h1>

      {/* Profile Card */}
      <EmployeeCard
        imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUpiglNG5F4DdRpAG_jVCrqsQVX4P2d4jLzQ&s"
        name="Ankit Sharma"
        role="Frontend Developer"
      />

      {/* Quick Actions */}
      {/* <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2 text-blue-900">{QuickBtnData.label}</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(QuickBtnData.content[0]).map(([key, label]) => (
            <Button
              key={key}
              name={label}
              cls="bg-white text-black cursor-pointer font-semibold py-2 px-6 rounded-3xl shadow hover:bg-gray-200 transition min-w-[140px]"
            />
          ))}
        </div>
      </div> */}

      {/* Leave + Payslip */}
      <div className="flex flex-col lg:flex-row gap-4 mt-6">
        <div className="w-full lg:w-1/2">
          <LeaveProgressBar leaveData={leaveStats} />
        </div>
        <div className="w-full lg:w-1/2">
          <PayslipBreakdown month={currentMonth} /> {/* Dynamic Month */}
        </div>
      </div>

      {/* Announcements + Birthdays */}
      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <div className="w-full md:w-1/2">
          <AnnouncementBox announcements={announcements} />
        </div>
        <div className="w-full md:w-1/2">
          <BirthdayBox birthdays={birthdays} onSendWish={handleSendWish} />
        </div>
      </div>

      {/* Tasks */}
      <div className="mt-6">
        <TaskBox tasks={tasks} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
