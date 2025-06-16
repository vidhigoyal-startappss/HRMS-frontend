import { useSelector } from 'react-redux';
import EmployeeView from '../components/LeaveManagement/EmployeeView';
import HRAdminView from '../components/LeaveManagement/HRAdminView';

const LeaveManagement = () => {
  const role = useSelector((state: any) => state.user.user.role);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-blue-900 text-2xl font-bold mb-4">Leave Management</h1>
      {role === 'employee' && <EmployeeView />}
      {(role === 'hr' || role === 'superAdmin') && <HRAdminView />}
    </div>
  );
};

export default LeaveManagement;
