import { Users, CalendarDays, Briefcase, DollarSign } from "lucide-react";
import userimg from "../assets/userimg.png";
const roles = [
  "UI Designer at Zensar",
  "DevOps Intern at Google",
  "Data Analyst at Amazon",
  "Frontend Developer at Microsoft",
  "Backend Developer at Facebook",
  "HR Intern at Infosys"
];

const dummyEmployees = [
  { name: "Alice Johnson", role: "HR Manager", img: userimg },
  { name: "Bob Smith", role: "Frontend Developer", img: userimg },
  { name: "Charlie Brown", role: "Backend Developer", img: userimg },
  { name: "Diana Prince", role: "UI/UX Designer", img: userimg },
  { name: "Ethan Hunt", role: "Project Manager", img: userimg },
];

const dummyCandidates = [
  { name: "Priya Mehra", appliedFor: "UI/UX Designer", img: userimg },
  { name: "Rahul Verma", appliedFor: "Backend Developer", img: userimg },
  { name: "Sita Sharma", appliedFor: "Frontend Developer", img: userimg },
  { name: "Vikram Singh", appliedFor: "Data Analyst", img: userimg },
  { name: "Anjali Gupta", appliedFor: "HR Intern", img: userimg },
];

const dummyPayrolls = [
  { name: "Sonia Patel", salary: "₹50,000", img: userimg },
  { name: "Rohan Shah", salary: "₹60,000", img: userimg },
  { name: "Karan Mehta", salary: "₹55,000", img: userimg },
  { name: "Neha Bansal", salary: "₹70,000", img: userimg },
  { name: "Amit Joshi", salary: "₹65,000", img: userimg },
];

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Top Stat Boxes */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-green-500 p-4 rounded-xl text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Candidates</h2>
            <p className="text-2xl">25</p>
          </div>
          <Users size={40} />
        </div>

        <div className="bg-yellow-500 p-4 rounded-xl text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Leaves</h2>
            <p className="text-2xl">8</p>
          </div>
          <CalendarDays size={40} />
        </div>

        <div className="bg-gray-800 p-4 rounded-xl text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Employees</h2>
            <p className="text-2xl">12</p>
          </div>
          <Briefcase size={40} />
        </div>

        <div className="bg-blue-900 p-4 rounded-xl text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Payrolls</h2>
            <p className="text-2xl">10</p>
          </div>
          <DollarSign size={40} />
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-4 gap-4">
        {/* Applied Jobs */}
        <div className="bg-white shadow-lg rounded-xl p-4 mt-4">
          <h3 className="text-lg font-bold mb-2 text-black">Applied Jobs</h3>
          <div>
      {roles.map((role, index) => (
        <p
          key={index}
          className={`text-black p-2 rounded-lg ${
            index % 2 === 0 ? "bg-blue-100" : ""
          }`}
        >
          {role}
        </p>
      ))}
    </div>
        </div>

        {/* Employees */}
<div className="bg-white shadow-lg rounded-xl p-4 mt-4">
  <h3 className="text-lg font-bold mb-2 text-black">Employees</h3>
  <div className="space-y-3">
    {dummyEmployees.map((emp, idx) => (
      <div
        key={idx}
        className={`flex items-center gap-3 p-2 rounded-lg ${idx % 2 === 0 ? "bg-blue-100" : ""}`}
      >
        <img src={emp.img} alt={emp.name} className="w-10 h-10 rounded-full" />
        <div>
          <p className="text-black font-semibold">{emp.name}</p>
          <p className="text-xs text-gray-600">{emp.role}</p>
        </div>
      </div>
    ))}
  </div>
</div>

{/* Candidates */}
<div className="bg-white shadow-lg rounded-xl p-4 mt-4">
  <h3 className="text-lg font-bold mb-2 text-black">Candidates</h3>
  <div className="space-y-3">
    {dummyCandidates.map((c, idx) => (
      <div
        key={idx}
        className={`flex items-center gap-3 p-2 rounded-lg ${idx % 2 === 0 ? "bg-blue-100" : ""}`}
      >
        <img src={c.img} alt={c.name} className="w-10 h-10 rounded-full" />
        <div>
          <p className="text-black font-semibold">{c.name}</p>
          <p className="text-xs text-gray-600">Applied for: {c.appliedFor}</p>
        </div>
      </div>
    ))}
  </div>
</div>

{/* Payrolls */}
<div className="bg-white shadow-lg rounded-xl p-4 mt-4">
  <h3 className="text-lg font-bold mb-2 text-black">
    {new Date().toLocaleString("default", { month: "long" })} Payrolls
  </h3>
  <div className="space-y-3">
    {dummyPayrolls.map((p, idx) => (
      <div
        key={idx}
        className={`flex items-center gap-3 p-2 rounded-lg ${idx % 2 === 0 ? "bg-blue-100" : ""}`}
      >
        <img src={p.img} alt={p.name} className="w-10 h-10 rounded-full" />
        <div>
          <p className="text-black font-semibold">{p.name}</p>
          <p className="text-xs text-gray-600">Salary: {p.salary}</p>
        </div>
      </div>
    ))}
  </div>
</div>


      </div>
    </div>
  );
};

export default AdminDashboard;
