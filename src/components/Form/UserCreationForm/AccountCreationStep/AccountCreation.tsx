// import React from "react";
// import { useFormContext } from "react-hook-form";

// // Define nested FormValues type for this step
// type FormValues = {
//   account: {
//     email: string;
//     password: string;
//     role: "Admin" | "HR" | "Employee";
//   };
// };

// const UserAccountCreationForm: React.FC<{ readOnly?: boolean }> = ({
//   readOnly = false,
// }) => {
//   const {
//     register,
//     formState: { errors },
//   } = useFormContext<FormValues>();

//   const accountErrors = errors?.account || {};

//   return (
//     <div className="space-y-6">
//       {/* Email Field */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Email
//         </label>
//         <input
//           type="email"
//           {...register("account.email", {
//             required: "Email is required",
//             pattern: {
//               value: /^\S+@\S+\.\S+$/,
//               message: "Invalid email address",
//             },
//           })}
//           className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           disabled={readOnly}
//         />
//         {accountErrors.email && (
//           <p className="text-sm text-red-500 mt-1">{accountErrors.email.message}</p>
//         )}
//       </div>

//       {/* Password Field */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Password
//         </label>
//         <input
//           type="password"
//           {...register("account.password", {
//             required: "Password is required",
//             minLength: {
//               value: 6,
//               message: "Password must be at least 6 characters",
//             },
//           })}
//           className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           disabled={readOnly}
//         />
//         {accountErrors.password && (
//           <p className="text-sm text-red-500 mt-1">
//             {accountErrors.password.message}
//           </p>
//         )}
//       </div>

//       {/* Role Selection */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Role
//         </label>
//         <select
//           {...register("account.role", {
//             required: "Role is required",
//             validate: (value) =>
//               ["admin", "hr", "employee"].includes(value) ||
//               "Role must be admin, hr, or employee",
//           })}
//           className="w-full border border-gray-300 px-4 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//           disabled={readOnly}
//         >
//           <option value="">Select Role</option>
//           <option value="admin">Admin</option>
//           <option value="hr">HR</option>
//           <option value="employee">Employee</option>
//         </select>
//         {accountErrors.role && (
//           <p className="text-sm text-red-500 mt-1">{accountErrors.role.message}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserAccountCreationForm;
