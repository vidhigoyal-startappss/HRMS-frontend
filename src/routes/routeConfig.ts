export interface RouteConfig {
  to: string;
  label: string;
}

export const commonRoutes: RouteConfig[] = [
  { to: "/dashboard", label: "Dashboard" },
];

export const roleRoutes: Record<string, RouteConfig[]> = {
  admin: [
    { to: "/manage-users", label: "Manage Users" },
    { to: "/reports", label: "Reports" },
  ],
  hr: [
    { to: "/recruitment", label: "Recruitment" },
    { to: "/attendance", label: "Attendance" },
  ],
  employee: [
    { to: "/my-profile", label: "My Profile" },
    { to: "/my-leaves", label: "My Leaves" },
  ],
};
