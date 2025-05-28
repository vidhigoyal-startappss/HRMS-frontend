import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles?: string[];
}) => {
  const user = useSelector((state: any) => state.user.user);

  if (!user) return <Navigate to="/login" />;

  const normalizedUserRole = user.role.trim().toLowerCase();

  if (allowedRoles && !allowedRoles.some(role => role.toLowerCase() === normalizedUserRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoutes;
