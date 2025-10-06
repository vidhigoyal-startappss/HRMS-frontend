// import React, { useEffect, useState } from "react";
// import API, { updateEmployee } from "../api/auth";
// import { toast } from "react-toastify";
// import { RootState } from "../store/store";
// import { useSelector } from "react-redux";
// import { Edit, X } from "lucide-react";
// import { useParams } from "react-router-dom";
// import { set } from "react-hook-form";
// import { updateProfile } from "../feature/user/userSlice";
// import jsPDF from "jspdf";
// import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
// import { PDFString } from "pdf-lib";

// const maskedFields = ["adharNumber", "panNumber", "accountNumber", "ifscCode"];

// const editableFields = [
//   "firstName",
//   "lastName",
//   "phone",
//   "dob",
//   "gender",
//   "address",
//   "city",
//   "state",
//   "zipCode",
//   "country",
//   "joiningDate",
//   "designation",
//   "department",
//   "employmentType",
//   "emergencyContactPersonName",
//   "emergencyContactEmail",
//   "currentAddress",
//   "permanentAddress",
//   "ctc",
//   "bankName",
//   "accountNumber",
//   "ifscCode",
//   "branchName",
//   "accountHolderName",
//   "adharNumber",
//   "panNumber",
//   "qualification",
//   "institution",
//   "yearOfPassing",
//   "grade",
// ];

// const Profile: React.FC = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [profile, setProfile] = useState<any>({});
//   const { user } = useSelector((state: RootState) => state.user);
//   const { id } = useParams();
//   const userId = id || user?.userId;
//   const userRole = user?.role;
//   const isSuperAdmin = userRole === "SuperAdmin";
//   const isOwnProfile = userId === user?.userId;
//   const canEdit = isSuperAdmin;
//   const canEditOwnProfile = isSuperAdmin && isOwnProfile;
//   const isHR = userRole === "HR";
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [fullNameForDownload, setFullNameForDownload] = useState<string>("");
//   const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
//   const [letterStatus, setLetterStatus] = useState<
//     "idle" | "generated" | "sent"
//   >("idle");
//   const [signedLetterUrl, setSignedLetterUrl] = useState(null);
//   // const [letterStatus, setLetterStatus] = useState("idle");
//   useEffect(() => {
//     API.get(`/api/users/employee/${userId}?archived=true`)
//       .then((res) => setProfile(res.data))

//       .catch(() => toast.error("Failed to load profile"));
//   }, [userId]);

//   const fillPdfFields = (form, fieldMap, data) => {
//     for (const [key, fieldNames] of Object.entries(fieldMap)) {
//       const value = data[key] || "";
//       fieldNames.forEach((fieldName) => {
//         const allFields = form.getFields();
//         allFields.forEach((f) => console.log(f.getName()));
//         const matchingFields = allFields.filter(
//           (field) => field.getName() === fieldName
//         );

//         if (matchingFields.length === 0) {
//           console.warn(`Field "${fieldName}" not found in PDF form.`);
//         }

//         matchingFields.forEach((field) => {
//           try {
//             field.setText(value);
//           } catch (err) {
//             console.warn(`Could not set text for field "${fieldName}":`, err);
//           }
//         });
//       });
//     }
//   };

//   const handleGenerateReport = async () => {
//     try {
//       const res = await fetch(
//         "/templates/Offer_Letter_Ishan_Shrivastava (4).pdf"
//       );
//       if (!res.ok) throw new Error("Template PDF not found");

//       const existingPdfBytes = await res.arrayBuffer();
//       const pdfDoc = await PDFDocument.load(existingPdfBytes);
//       const helveticaBoldFont = await pdfDoc.embedFont(
//         StandardFonts.HelveticaBold
//       );
//       const form = pdfDoc.getForm();

//       const fullName = `${profile.firstName || ""} ${
//         profile.lastName || ""
//       }`.trim();
//       const joiningDate = profile.joiningDate
//         ? new Date(profile.joiningDate).toLocaleDateString("en-GB")
//         : "";
//       const ctc = profile.ctc || "";
//       const location = `${profile.city || ""}, ${profile.state || ""}, ${
//         profile.country || ""
//       }`;
//       const designation = profile.designation || "";
//       const department = profile.department || "";
//       const phoneNumber = profile.phone || "";

//       const pdfFieldMap = {
//         fullName: [
//           "Text26",
//           "Text46",
//           "Text35",
//           "Text37",
//           "Text40",
//           "Text43",
//           "Text32",
//           "Text34",
//           "Text36",
//         ],
//         joiningDate: ["Text44", "Text31", "Text38"],
//         designation: ["Text30", "Text45"],
//         department: ["Text41"],
//         phoneNumber: ["Text33"],
//         ctc: [
//           "Text29",
//           "Text42",
//           "Text27",
//           "Text39",
//           "Text28",
//           "Text47",
//           "Text48",
//         ],
//       };

//       const data = {
//         fullName,
//         joiningDate,
//         ctc,
//         designation,
//         department,
//         phoneNumber,
//         location,
//       };

//       fillPdfFields(form, pdfFieldMap, data);
//       form.updateFieldAppearances(helveticaBoldFont);
//       //  form.flatten();
//       try {
//         form.flatten();
//       } catch (e) {
//         console.error("Error flattening PDF:", e);
//       }

//       const pdfBytes = await pdfDoc.save();
//       const blob = new Blob([pdfBytes], { type: "application/pdf" });
//       const blobUrl = URL.createObjectURL(blob);

//       setPdfBlob(blob);
//       setLetterStatus("generated");
//       setFullNameForDownload(fullName);
//       toast.success("PDF Generated Successfully");
//     } catch (error) {
//       console.error("Error generating PDF report:", error);
//       toast.error("Failed to generate PDF");
//     }
//   };

//   const handleSendPdfLink = async () => {
//     if (!pdfBlob) {
//       toast.error("PDF not generated yet.");
//       return;
//     }

//     if (!profile?.email) {
//       toast.error("Employee email is missing.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append(
//       "file",
//       pdfBlob,
//       `${fullNameForDownload || "appointment"}.pdf`
//     );
//     formData.append("email", profile.email);

//     try {
//       const res = await fetch("http://localhost:3000/api/letters/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await res.json();

//       if (res.ok) {
//         toast.success("Appointment letter sent to employee!");
//         setLetterStatus("sent");
//         console.log("Public link to letter:", result.link);
//       } else {
//         console.error(result);
//         toast.error("Failed to send appointment letter.");
//       }
//     } catch (error) {
//       console.error("Error sending PDF:", error);
//       toast.error("Something went wrong while sending the email.");
//     }
//   };

//   const uploadSignedLetter = async (file: File, userId: string) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("userId", userId);

//     const response = await fetch("/api/letters/upload-signed", {
//       method: "POST",
//       body: formData,
//     });

//     const data = await response.json();
//     console.log("Upload response:", data);
//   };

//   useEffect(() => {
//     const fetchSignedLetter = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:3000/api/letters/signed/${userId}`
//         );
//         if (!res.ok) throw new Error("No signed letter found");
//         const result = await res.json();
//         setSignedLetterUrl(result.link);
//       } catch (err) {
//         console.log("Signed letter not found yet", err);
//       }
//     };

//     if (userId) fetchSignedLetter();
//   }, [userId]);

//   const handleProfileUpdate = async (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setSelectedImage(file);

//     setProfile((prev: any) => ({
//       ...prev,
//       profileImage: URL.createObjectURL(file),
//     }));
//   };

//   const handleImageSave = async () => {
//     if (!selectedImage) return;
//     const formData = new FormData();
//     formData.append("file", selectedImage);
//     try {
//       await API.post(`/api/users/upload-profile/${userId}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast.success("Profile image updated successfully");
//       setSelectedImage(null);
//       const updatedProfile = await API.get(
//         `/api/users/employee/${userId}?archived=true`
//       );
//       setProfile(updatedProfile.data);
//     } catch (error) {
//       toast.error("Failed to update profile image");
//     }
//   };

//   const maskValue = (value: string, type?: string) => {
//     if (!value) return "";
//     const len = value.length;
//     if (type === "ifsc") {
//       return len <= 3 ? "X".repeat(len) : "X".repeat(len - 3) + value.slice(-3);
//     }
//     return len <= 4 ? "X".repeat(len) : "X".repeat(len - 4) + value.slice(-4);
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toISOString().split("T")[0];
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     if (name === "phone") {
//       const phonePattern = /^[0-9]{0,10}$/;
//       if (!phonePattern.test(value)) return;
//     }
//     setProfile((prev: any) => ({ ...prev, [name]: value }));
//   };

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (profile.phone && profile.phone.length !== 10) {
//       toast.error("Phone number must be 10 digits");
//       return;
//     }

//     const structuredPayload = {
//       basicDetails: {
//         firstName: profile.firstName || "",
//         lastName: profile.lastName || "",
//         phone: profile.phone || "",
//         dob: profile.dob || "",
//         gender: profile.gender || "",
//         address: profile.address || "",
//         city: profile.city || "",
//         state: profile.state || "",
//         zipCode: profile.zipCode || "",
//         country: profile.country || "",
//         joiningDate: profile.joiningDate || "",
//         designation: profile.designation || "",
//         department: profile.department || "",
//         employmentType: profile.employmentType || "",
//         emergencyContactPersonName: profile.emergencyContactPersonName || "",
//         emergencyContactEmail: profile.emergencyContactEmail || "",
//         currentAddress: profile.currentAddress || "",
//         permanentAddress: profile.permanentAddress || "",
//         ctc: profile.ctc || "",
//       },
//       bankDetails: {
//         bankName: profile.bankName || "",
//         accountNumber: profile.accountNumber || "",
//         ifscCode: profile.ifscCode || "",
//         branchName: profile.branchName || "",
//         accountHolderName: profile.accountHolderName || "",
//         adharNumber: profile.adharNumber || "",
//         panNumber: profile.panNumber || "",
//       },
//       educationDetails: {
//         qualification: profile.qualification || "",
//         institution: profile.institution || "",
//         yearOfPassing: profile.yearOfPassing || "",
//         grade: profile.grade || "",
//       },
//     };
//     try {
//       await updateEmployee(userId, structuredPayload);
//       console.log("Payload is being:", structuredPayload);
//       toast.success("Profile updated successfully");
//       setIsEditing(false);
//     } catch (error) {
//       toast.error("Failed to update profile");
//     }
//   };

//   const renderField = (
//     label: string,
//     name: string,
//     type: string = "text",
//     maskType?: string
//   ) => {
//     const isMasked = maskedFields.includes(name);
//     const isDateField = type === "date";
//     const value = profile[name];
//     const formattedValue = isDateField && value ? formatDate(value) : value;

//     const isEditableField =
//       isEditing && canEdit && editableFields.includes(name);
//     return (
//       <div key={name}>
//         <label className="block mb-1 text-sm font-semibold text-[#113F67]">
//           {label}
//         </label>

//         {isEditableField ? (
//           <input
//             type={type}
//             name={name}
//             value={formattedValue || ""}
//             onChange={handleInputChange}
//             className="w-full min-h-[40px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#113F67]"
//           />
//         ) : (
//           <div className="w-full min-h-[40px] px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-md text-gray-700">
//             {isMasked ? maskValue(value, maskType) : formattedValue || "-"}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="max-w-8xl mx-auto px-6 py-2 bg-white rounded-2xl">
//       <div className="flex justify-end items-center pb-2">
//         <div className="flex flex-col sm:flex-row items-center justify-between w-full bg-[#113F67] p-4 sm:p-6 gap-4 sm:gap-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
//           <div className="flex flex-col sm:flex-col md:flex-row items-center gap-4 w-full md:w-auto">
//             <div className="relative items-center">
//               <img
//                 src={
//                   selectedImage
//                     ? URL.createObjectURL(selectedImage)
//                     : profile.profileImage
//                     ? profile.profileImage.startsWith("http")
//                       ? profile.profileImage
//                       : `${import.meta.env.VITE_APP_BASE_URL}/${
//                           profile.profileImage
//                         }`
//                     : "/default-avatar.png"
//                 }
//                 alt="Profile"
//                 className="w-16 h-16 sm:w-18 sm:h-15 md:w-22 md:h-22 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full border-4 border-gray-200 object-cover"
//               />

//               {canEdit && (
//                 <div className="absolute top-26 right-6 flex flex-col item-end ">
//                   <>
//                     {!selectedImage ? (
//                       <>
//                         <label
//                           htmlFor="profileImageInput"
//                           className="text-[10px] px-2 py-1 bg-[#fff] text-[#113F67] rounded-full cursor-pointer transition"
//                         >
//                           Edit Photo
//                         </label>
//                         <input
//                           type="file"
//                           id="profileImageInput"
//                           accept="image/*"
//                           onChange={handleProfileUpdate}
//                           className="hidden"
//                         />
//                       </>
//                     ) : (
//                       <button
//                         onClick={handleImageSave}
//                         className="text-[10px] px-2 py-1 bg-[#008000] text-[#fff] rounded-full cursor-pointer transition"
//                       >
//                         Save Image
//                       </button>
//                     )}
//                   </>
//                 </div>
//               )}
//             </div>

//             <div className="flex flex-col items-center md:items-start gap-0 sm:gap-1">
//               <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white leading-tight text-center md:text-left">
//                 {profile?.firstName + " " + profile?.lastName}
//               </h3>
//               <p className="text-sm sm:text-base md:text-lg text-gray-300 text-center md:text-left">
//                 {profile?.designation}
//               </p>
//               {/* <p className=" grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 Employee ID: {profile?.employeeId || "-"}
//               </p> */}
//             </div>
//           </div>
//           {canEdit && (
//             <button
//               type="button"
//               onClick={() => setIsEditing((prev) => !prev)}
//               className="bg-white text-[#113F67] px-3 py-1 rounded-md text-sm font-semibold hover:bg-gray-100 transition"
//             >
//               {isEditing ? "Cancel" : "Edit Profile"}
//             </button>
//           )}

//           {isHR && !isOwnProfile && (
//             <div>
//               {letterStatus === "idle" && (
//                 <button
//                   type="button"
//                   onClick={handleGenerateReport}
//                   className="bg-white text-[#113F67] px-3 py-1 rounded-md text-sm font-semibold  transition ml-2"
//                 >
//                   Generate Appointment Letter
//                 </button>
//               )}

//               {letterStatus === "generated" && (
//                 <button
//                   type="button"
//                   onClick={handleSendPdfLink}
//                   className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition ml-2"
//                 >
//                   Send to Employee
//                 </button>
//               )}

//               {/* {letterStatus === "sent" && !signedLetterUrl && (
//                 <button
//                   type="button"
//                   disabled
//                   className="bg-gray-400 text-white px-3 py-1 rounded-md cursor-not-allowed transition ml-2"
//                 >
//                   Sent Successfully
//                 </button>
//               )} */}

//               {signedLetterUrl ? (
//                 <a
//                   href={signedLetterUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition ml-2"
//                 >
//                   View Appointment Letter
//                 </a>
//               ) : letterStatus === "sent" ? (
//                 <button
//                   type="button"
//                   disabled
//                   className="bg-gray-400 text-white px-3 py-1 rounded-md cursor-not-allowed transition ml-2"
//                 >
//                   Sent Successfully
//                 </button>
//               ) : null}
//             </div>
//           )}

//           {signedLetterUrl && (
//             <div className="mt-6 p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50">
//               <h3 className="text-lg font-semibold text-[#113F67] mb-2">
//                 Signed Appointment Letter
//               </h3>
//               <div className="flex items-center justify-between">
//                 <p className="text-sm text-gray-700 truncate max-w-[70%]">
//                   {signedLetterUrl}
//                 </p>

//                 <a
//                   href={signedLetterUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
//                 >
//                   View PDF
//                 </a>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <form onSubmit={onSubmit} className="space-y-12">
//         <section>
//           <h3 className="text-xl font-extrabold text-black mb-6">
//             Basic Details
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {renderField("Employee ID", "employeeId")}

//             {renderField("First Name", "firstName")}
//             {renderField("Last Name", "lastName")}
//             {renderField("Phone", "phone")}
//             {renderField("Date of Birth", "dob", "date")}
//             {renderField("Gender", "gender")}
//             {renderField("Address", "address")}
//             {renderField("City", "city")}
//             {renderField("State", "state")}
//             {renderField("Zip Code", "zipCode")}
//             {renderField("Country", "country")}
//             {renderField("Joining Date", "joiningDate", "date")}
//             {renderField("Designation", "designation")}
//             {renderField("Department", "department")}
//             {renderField("Employment Type", "employmentType")}

//             {renderField(
//               "emergency Contact PersonName",
//               "emergencyContactPersonName"
//             )}
//             {renderField("emergency Contact Email", "emergencyContactEmail")}
//             {renderField("currentAddress", "currentAddress")}
//             {renderField("permanentAddress", "permanentAddress")}
//             {renderField("ctc", "ctc")}
//           </div>
//         </section>

//         <section>
//           <h3 className="text-xl font-extrabold text-black mb-6">
//             Bank Details
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {renderField("Bank Name", "bankName")}
//             {renderField("Account Number", "accountNumber", "text", "account")}
//             {renderField("IFSC Code", "ifscCode", "text", "ifsc")}
//             {renderField("Branch Name", "branchName")}
//             {renderField("Account Holder Name", "accountHolderName")}
//             {renderField("Aadhar Number", "adharNumber", "text", "aadhar")}
//             {renderField("PAN Number", "panNumber", "text", "pan")}
//           </div>
//         </section>

//         <section>
//           <h3 className="text-xl font-extrabold text-black mb-6">
//             Educational Details
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {renderField("Highest Qualification", "qualification")}
//             {renderField("University/Institution", "institution")}
//             {renderField("Year of Passing", "yearOfPassing", "number")}
//             {renderField("Grade/CGPA", "grade")}
//           </div>
//         </section>
//         {isEditing && canEdit && (
//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="bg-[#113F67] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#0d2e4f] transition"
//             >
//               Save Changes
//             </button>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default Profile;

import React, { useEffect, useState } from "react";
import API, { updateEmployee } from "../api/auth";
import { toast } from "react-toastify";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { Edit, X } from "lucide-react";
import { useParams } from "react-router-dom";
import { set } from "react-hook-form";
import { updateProfile } from "../feature/user/userSlice";
import jsPDF from "jspdf";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { PDFString } from "pdf-lib";

const maskedFields = ["adharNumber", "panNumber", "accountNumber", "ifscCode"];

const editableFields = [
  "firstName",
  "lastName",
  "phone",
  "dob",
  "gender",
  "address",
  "city",
  "state",
  "zipCode",
  "country",
  "joiningDate",
  "designation",
  "department",
  "employmentType",
  "emergencyContactPersonName",
  "emergencyContactEmail",
  "currentAddress",
  "permanentAddress",
  "ctc",
  "bankName",
  "accountNumber",
  "ifscCode",
  "branchName",
  "accountHolderName",
  "adharNumber",
  "panNumber",
  "qualification",
  "institution",
  "yearOfPassing",
  "grade",
  "basicFixedMonthly",
  "basicFixedYearly",
  "hraFixedMonthly",
  "hraFixedYearly",
  "conveyanceMonthly",
  "conveyanceYearly",
  "dearnessAllowancesMonthly",
  "dearnessAllowancesYearly",
  "otherAllowancesMonthly",
  "otherAllowancesYearly",
  "annualGrossSalaryMonthly",
  "annualGrossSalaryYearly",
  "employerPFMonthly",
  "employerPFYearly",
  "totalFixedPayMonthly",
  "totalFixedPayYearly",
  "individualVariablePayMonthly",
  "individualVariablePayYearly",
  "totalCTCMonthly",
  "totalCTCYearly",
];

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [profile, setProfile] = useState<any>({});
  const { user } = useSelector((state: RootState) => state.user);
  const { id } = useParams();
  const userId = id || user?.userId;
  const userRole = user?.role;
  const isHR = userRole === "HR";
  const isSuperAdmin = userRole === "SuperAdmin";
  const isOwnProfile = userId === user?.userId;
  const canEdit = isSuperAdmin || isHR;
  const canEditOwnProfile = isSuperAdmin && isOwnProfile;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fullNameForDownload, setFullNameForDownload] = useState<string>("");
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [letterStatus, setLetterStatus] = useState<
    "idle" | "generated" | "sent"
  >("idle");
  const [signedLetterUrl, setSignedLetterUrl] = useState(null);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  // const userId = query.get("userId");
  useEffect(() => {
    API.get(`/api/users/employee/${userId}?archived=true`)
      .then((res) => {
        setProfile(res.data);
        console.log("Fetched Profile:", res.data);
      })
      .catch(() => toast.error("Failed to load profile"));
  }, [userId]);

  const handleGenerateLetter = async () => {
    const res = await fetch("http://localhost:3000/api/letters/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    const result = await res.json();

    if (res.ok) {
      setGeneratedPdfUrl(result.link);

      const pdfRes = await fetch(result.link);
      const blob = await pdfRes.blob();
      setPdfBlob(blob);

      setFullNameForDownload(`${profile.firstName}_${profile.lastName}`);
      setLetterStatus("generated");

      toast.success("Letter generated successfully!");
    } else {
      toast.error("Letter generation failed.");
    }
  };

  const handleSendPdfLink = async () => {
    if (!pdfBlob) {
      toast.error("PDF not generated yet.");
      return;
    }

    if (!profile?.email || !(profile.userId || profile.id || profile._id)) {
      toast.error("Missing email or user ID.");
      console.log("Email:", profile?.email);
      console.log("User ID:", profile?.userId, profile?.id, profile?._id);
      return;
    }

    const formData = new FormData();
    formData.append(
      "file",
      pdfBlob,
      `${fullNameForDownload || "appointment"}.pdf`
    );
    formData.append("email", profile.email);
    const finalUserId = profile.userId || profile.id || profile._id;
    formData.append("userId", finalUserId);

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const res = await fetch("http://localhost:3000/api/letters/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Appointment letter sent to employee!");
        setLetterStatus("sent");
        console.log("Public link to letter:", result.link);
      } else {
        console.error(result);
        toast.error("Failed to send appointment letter.");
      }
    } catch (error) {
      console.error("Error sending PDF:", error);
      toast.error("Something went wrong while sending the email.");
    }
  };

  const uploadSignedLetter = async (file: File, userId: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    console.log("Sending email to:", profile.email);
    console.log("User ID being sent:", profile.userId);
    const response = await fetch("/api/letters/upload-signed", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Upload response:", data);
  };

  useEffect(() => {
    const fetchSignedLetter = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/letters/signed/${userId}`
        );
        if (!res.ok) throw new Error("No signed letter found");
        const result = await res.json();
        setSignedLetterUrl(result.link);
      } catch (err) {
        console.log("Signed letter not found yet", err);
      }
    };

    if (userId) fetchSignedLetter();
  }, [userId]);

  const handleProfileUpdate = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);

    setProfile((prev: any) => ({
      ...prev,
      profileImage: URL.createObjectURL(file),
    }));
  };

  const handleImageSave = async () => {
    if (!selectedImage) return;
    const formData = new FormData();
    formData.append("file", selectedImage);
    try {
      await API.post(`/api/users/upload-profile/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile image updated successfully");
      setSelectedImage(null);
      const updatedProfile = await API.get(
        `/api/users/employee/${userId}?archived=true`
      );
      setProfile(updatedProfile.data);
    } catch (error) {
      toast.error("Failed to update profile image");
    }
  };

  const maskValue = (value: string, type?: string) => {
    if (!value) return "";
    const len = value.length;
    if (type === "ifsc") {
      return len <= 3 ? "X".repeat(len) : "X".repeat(len - 3) + value.slice(-3);
    }
    return len <= 4 ? "X".repeat(len) : "X".repeat(len - 4) + value.slice(-4);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const phonePattern = /^[0-9]{0,10}$/;
      if (!phonePattern.test(value)) return;
    }
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.phone && profile.phone.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    const structuredPayload = {
      basicDetails: {
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        dob: profile.dob || "",
        gender: profile.gender || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        zipCode: profile.zipCode || "",
        country: profile.country || "",
        joiningDate: profile.joiningDate || "",
        designation: profile.designation || "",
        department: profile.department || "",
        employmentType: profile.employmentType || "",
        emergencyContactPersonName: profile.emergencyContactPersonName || "",
        emergencyContactEmail: profile.emergencyContactEmail || "",
        currentAddress: profile.currentAddress || "",
        permanentAddress: profile.permanentAddress || "",
        ctc: profile.ctc || "",
      },
      bankDetails: {
        bankName: profile.bankName || "",
        accountNumber: profile.accountNumber || "",
        ifscCode: profile.ifscCode || "",
        branchName: profile.branchName || "",
        accountHolderName: profile.accountHolderName || "",
        adharNumber: profile.adharNumber || "",
        panNumber: profile.panNumber || "",
      },
      educationDetails: {
        qualification: profile.qualification || "",
        institution: profile.institution || "",
        yearOfPassing: profile.yearOfPassing || "",
        grade: profile.grade || "",
      },
      salaryDetails: {
        basicFixedMonthly: profile.salaryDetails?.basicFixedMonthly || 0,
        basicFixedYearly: profile.salaryDetails?.basicFixedYearly || 0,

        hraFixedMonthly: profile.salaryDetails?.hraFixedMonthly || 0,
        hraFixedYearly: profile.salaryDetails?.hraFixedYearly || 0,

        conveyanceMonthly: profile.salaryDetails?.conveyanceMonthly || 0,
        conveyanceYearly: profile.salaryDetails?.conveyanceYearly || 0,

        dearnessAllowancesMonthly: profile.salaryDetails?.dearnessAllowancesMonthly || 0,
        dearnessAllowancesYearly: profile.salaryDetails?.dearnessAllowancesYearly || 0,

        otherAllowancesMonthly: profile.salaryDetails?.otherAllowancesMonthly || 0,
        otherAllowancesYearly: profile.salaryDetails?.otherAllowancesYearly || 0,

        annualGrossSalaryMonthly: profile.salaryDetails?.annualGrossSalaryMonthly || 0,
        annualGrossSalaryYearly: profile.salaryDetails?.annualGrossSalaryYearly || 0,

        employerPFMonthly: profile.salaryDetails?.employerPFMonthly || 0,
        employerPFYearly: profile.salaryDetails?.employerPFYearly || 0,

        totalFixedPayMonthly: profile.salaryDetails?.totalFixedPayMonthly || 0,
        totalFixedPayYearly: profile.salaryDetails?.totalFixedPayYearly || 0,

        individualVariablePayMonthly: profile.salaryDetails?.individualVariablePayMonthly || 0,
        individualVariablePayYearly: profile.salaryDetails?.individualVariablePayYearly || 0,

        totalCTCMonthly: profile.salaryDetails?.totalCTCMonthly || 0,
        totalCTCYearly: profile.salaryDetails?.totalCTCYearly || 0,
      },
    };
    try {
      await updateEmployee(userId, structuredPayload);
      console.log("Payload is being:", structuredPayload);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const renderField = (
    label: string,
    name: string,
    type: string = "text",
    maskType?: string
  ) => {
    const isMasked = maskedFields.includes(name);
    const isDateField = type === "date";
 const value = name.split('.').reduce((obj, key) => obj?.[key], profile);

    const formattedValue = isDateField && value ? formatDate(value) : value;

    const isEditableField =
      isEditing && canEdit && editableFields.includes(name);
    return (
      <div key={name}>
        <label className="block mb-1 text-sm font-semibold text-[#113F67]">
          {label}
        </label>

        {isEditableField ? (
          <input
            type={type}
            name={name}
            value={formattedValue || ""}
            onChange={handleInputChange}
            className="w-full min-h-[40px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#113F67]"
          />
        ) : (
          <div className="w-full min-h-[40px] px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-md text-gray-700">
            {isMasked ? maskValue(value, maskType) : formattedValue || "-"}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-8xl mx-auto px-6 py-2 bg-white rounded-2xl">
      <div className="flex justify-end items-center pb-2">
        <div className="flex flex-col sm:flex-row items-center justify-between w-full bg-[#113F67] p-4 sm:p-6 gap-4 sm:gap-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col sm:flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative items-center">
              <img
                src={
                  selectedImage
                    ? URL.createObjectURL(selectedImage)
                    : profile.profileImage
                    ? profile.profileImage.startsWith("http")
                      ? profile.profileImage
                      : `${import.meta.env.VITE_APP_BASE_URL}/${
                          profile.profileImage
                        }`
                    : "/default-avatar.png"
                }
                alt="Profile"
                className="w-16 h-16 sm:w-18 sm:h-15 md:w-22 md:h-22 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full border-4 border-gray-200 object-cover"
              />

              {canEdit && (
                <div className="absolute top-26 right-6 flex flex-col item-end ">
                  <>
                    {!selectedImage ? (
                      <>
                        <label
                          htmlFor="profileImageInput"
                          className="text-[10px] px-2 py-1 bg-[#fff] text-[#113F67] rounded-full cursor-pointer transition "
                        >
                          Edit Photo
                        </label>
                        <input
                          type="file"
                          id="profileImageInput"
                          accept="image/*"
                          onChange={handleProfileUpdate}
                          className="hidden"
                        />
                      </>
                    ) : (
                      <button
                        onClick={handleImageSave}
                        className="text-[10px] px-2 py-1 bg-[#008000] text-[#fff] rounded-full cursor-pointer transition"
                      >
                        Save Image
                      </button>
                    )}
                  </>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center md:items-start gap-0 sm:gap-1">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white leading-tight text-center md:text-left">
                {profile?.firstName + " " + profile?.lastName}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 text-center md:text-left">
                {profile?.designation}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 ml-auto items-end justify-start">
            {isHR && !isOwnProfile && (
              <>
                {!signedLetterUrl && (
                  <>
                    {letterStatus === "idle" && (
                      <button
                        type="button"
                        onClick={handleGenerateLetter}
                        className="bg-white text-[#113F67] px-3 py-1 rounded-md text-sm font-semibold transition mb-13"
                      >
                        Generate Appointment Letter
                      </button>
                    )}

                    {letterStatus === "generated" && (
                      <button
                        type="button"
                        onClick={handleSendPdfLink}
                        className="bg-white text-[#113F67] px-3 py-1 rounded-md text-sm font-semibold transition mb-13"
                      >
                        Send to Employee
                      </button>
                    )}
                  </>
                )}

                {signedLetterUrl && (
                  <a
                    href={signedLetterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-[#113F67] px-3 py-1 rounded-md text-sm font-semibold transition mb-13"
                  >
                    View Signed PDF
                  </a>
                )}
              </>
            )}

            {canEdit && (
              <button
                type="button"
                onClick={() => setIsEditing((prev) => !prev)}
                className="bg-white text-[#113F67] px-3 py-1 rounded-md text-sm font-semibold hover:bg-gray-100 transition"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            )}
          </div>
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-12">
        <section>
          <h3 className="text-xl font-extrabold text-black mb-6">
            Basic Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderField("Employee ID", "employeeId")}

            {renderField("First Name", "firstName")}
            {renderField("Last Name", "lastName")}
            {renderField("Phone", "phone")}
            {renderField("Date of Birth", "dob", "date")}
            {renderField("Gender", "gender")}
            {renderField("Address", "address")}
            {renderField("City", "city")}
            {renderField("State", "state")}
            {renderField("Zip Code", "zipCode")}
            {renderField("Country", "country")}
            {renderField("Joining Date", "joiningDate", "date")}
            {renderField("Designation", "designation")}
            {renderField("Department", "department")}
            {renderField("Employment Type", "employmentType")}

            {renderField(
              "emergency Contact PersonName",
              "emergencyContactPersonName"
            )}
            {renderField("emergency Contact Email", "emergencyContactEmail")}
            {renderField("currentAddress", "currentAddress")}
            {renderField("permanentAddress", "permanentAddress")}
            {renderField("ctc", "ctc")}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-extrabold text-black mb-6">
            Bank Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderField("Bank Name", "bankName")}
            {renderField("Account Number", "accountNumber", "text", "account")}
            {renderField("IFSC Code", "ifscCode", "text", "ifsc")}
            {renderField("Branch Name", "branchName")}
            {renderField("Account Holder Name", "accountHolderName")}
            {renderField("Aadhar Number", "adharNumber", "text", "aadhar")}
            {renderField("PAN Number", "panNumber", "text", "pan")}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-extrabold text-black mb-6">
            Educational Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderField("Highest Qualification", "qualification")}
            {renderField("University/Institution", "institution")}
            {renderField("Year of Passing", "yearOfPassing", "number")}
            {renderField("Grade/CGPA", "grade")}
          </div>
        </section>
        <section>
  <h3 className="text-xl font-extrabold text-black mb-6">
    Salary Details
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {renderField("Basic Fixed Monthly", "salaryDetails.basicFixedMonthly")}
    {renderField("Basic Fixed Yearly", "salaryDetails.basicFixedYearly")}

    {renderField("HRA Fixed Monthly", "salaryDetails.hraFixedMonthly")}
    {renderField("HRA Fixed Yearly", "salaryDetails.hraFixedYearly")}

    {renderField("Conveyance Monthly", "salaryDetails.conveyanceMonthly")}
    {renderField("Conveyance Yearly", "salaryDetails.conveyanceYearly")}

    {renderField(
      "Dearness Allowance Monthly",
      "salaryDetails.dearnessAllowancesMonthly"
    )}
    {renderField(
      "Dearness Allowance Yearly",
      "salaryDetails.dearnessAllowancesYearly"
    )}

    {renderField(
      "Other Allowances Monthly",
      "salaryDetails.otherAllowancesMonthly"
    )}
    {renderField(
      "Other Allowances Yearly",
      "salaryDetails.otherAllowancesYearly"
    )}

    {renderField(
      "Annual Gross Salary Monthly",
      "salaryDetails.annualGrossSalaryMonthly"
    )}
    {renderField(
      "Annual Gross Salary Yearly",
      "salaryDetails.annualGrossSalaryYearly"
    )}

    {renderField("Employer PF Monthly", "salaryDetails.employerPFMonthly")}
    {renderField("Employer PF Yearly", "salaryDetails.employerPFYearly")}

    {renderField(
      "Total Fixed Pay Monthly",
      "salaryDetails.totalFixedPayMonthly"
    )}
    {renderField(
      "Total Fixed Pay Yearly",
      "salaryDetails.totalFixedPayYearly"
    )}

    {renderField(
      "Individual Variable Pay Monthly",
      "salaryDetails.individualVariablePayMonthly"
    )}
    {renderField(
      "Individual Variable Pay Yearly",
      "salaryDetails.individualVariablePayYearly"
    )}

    {renderField("Total CTC Monthly", "salaryDetails.totalCTCMonthly")}
    {renderField("Total CTC Yearly", "salaryDetails.totalCTCYearly")}
  </div>
</section>

        {isEditing && canEdit && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#113F67] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#0d2e4f] transition"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
