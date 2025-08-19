import React, { useEffect, useState } from "react";
import API, { updateEmployee } from "../api/auth";
import { toast } from "react-toastify";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { Edit, X } from "lucide-react";
import { useParams } from "react-router-dom";
// const editableFields = ["firstName", "lastName", "phone"];
const maskedFields = ["adharNumber", "panNumber", "accountNumber", "ifscCode"];
// const basicEditableFields = [
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
// ];

// const fullEditableFields = [
//   ...basicEditableFields,
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

const Profile: React.FC = () => {
  // const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>({});
  const { user } = useSelector((state: RootState) => state.user);
  const { id } = useParams();
  const userId = id || user?.userId;
  const userRole = user?.role;
  // const canEditAll = ["HR", "Admin", "SuperAdmin"].includes(userRole);

  useEffect(() => {
    console.log("not coming", userId);
    API.get(`/api/users/employee/${userId}`)

      .then((res) => setProfile(res.data))

      .catch(() => toast.error("Failed to load profile"));
  }, [userId]);

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
    //   const handleProfileUpdate = async (
    //     e: React.ChangeEvent<HTMLInputElement>
    //   ) => {
    //     const file = e.target.files?.[0];
    //     if (!file) return;

    //     const formData = new FormData();
    //     formData.append("profileImage", file);
    //     try {
    //       await API.post(`/api/users/employee/${userId}/upload`, formData, {
    //         headers: {
    //           "Content-Type": "multipart/form-data",
    //         },
    //       });
    //       setProfile((prev: any) => ({
    //         ...prev,
    //         profileImage: URL.createObjectURL(file),
    //       }));
    //       toast.success("Profile image updated successfully");
    //     } catch (error) {
    //       toast.error("Failed to update profile image");
    //     }
    //   };
    //   const structuredPayload = {
    //     basicDetails: {
    //       firstName: profile.firstName,
    //       lastName: profile.lastName,
    //       phone: profile.phone,
    //       dob: profile.dob,
    //       gender: profile.gender,
    //       address: profile.address,
    //       city: profile.city,
    //       state: profile.state,
    //       zipCode: profile.zipCode,
    //       country: profile.country,
    //       joiningDate: profile.joiningDate,
    //       designation: profile.designation,
    //       department: profile.department,
    //       employmentType: profile.employmentType,
    //       emergencyContactPersonName: profile.emergencyContactPersonName,
    //       emergencyContactEmail: profile.emergencyContactEmail,
    //       currentAddress: profile.currentAddress,
    //       permanentAddress: profile.permanentAddress,
    //       ctc: profile.ctc,
    //       // leaves: profile.leaves,
    //       // leaves: profile.leaves,
    //     },
    //     bankDetails: {
    //       bankName: profile.bankName,
    //       accountNumber: profile.accountNumber,
    //       ifscCode: profile.ifscCode,
    //       branchName: profile.branchName,
    //       accountHolderName: profile.accountHolderName,
    //       adharNumber: profile.adharNumber,
    //       panNumber: profile.panNumber,
    //     },
    //     educationDetails: {
    //       qualification: profile.qualification,
    //       institution: profile.institution,
    //       yearOfPassing: profile.yearOfPassing,
    //       grade: profile.grade,
    //     },
    //   };

    //   try {
    //     await updateEmployee(userId, structuredPayload);
    //     toast.success("Profile updated successfully");
    //     setIsEditing(false);
    //   } catch (error) {
    //     toast.error("Failed to update profile");
    //   }
  };

  const renderField = (
    label: string,
    name: string,
    type: string = "text",
    maskType?: string
  ) => {
    const isMasked = maskedFields.includes(name);
    const isDateField = type === "date";
    const value = profile[name];
    const formattedValue = isDateField && value ? formatDate(value) : value;

    return (
      <div key={name}>
        <label className="block mb-1 text-sm font-semibold text-[#113F67]">
          {label}
        </label>

        <div className="w-full min-h-[40px] px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-md text-gray-700">
          {isMasked ? maskValue(value, maskType) : formattedValue || "-"}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-8xl mx-auto px-6 py-2 bg-white rounded-2xl">
      <div className="flex justify-end items-center pb-2">
        <div className="flex flex-col sm:flex-row items-center justify-between w-full bg-[#113F67] p-4 sm:p-6 gap-4 sm:gap-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col sm:flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <img
              src={
                profile.profileImage
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

            {/* <>
                <label
                  htmlFor="profileImageInput"
                  className="mt-2 text-xs px-3 py-1 bg[#87C0CD] text-white rounded-full cursor-pointer transition hover:bg-[#113F67]"
                >
                  Edit Photo
                </label>
                <input
                  type="file"
                  id="profileImageInput"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </> */}

            <div className="flex flex-col items-center md:items-start gap-0 sm:gap-1">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white leading-tight text-center md:text-left">
                {profile?.firstName + " " + profile?.lastName}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 text-center md:text-left">
                {profile?.designation}
              </p>
              {/* <p className=" grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                Employee ID: {profile?.employeeid || "-"}
              </p> */}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-12">
        <section>
          <h3 className="text-xl font-extrabold text-black mb-6">
            Basic Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderField("Employee ID", "employeeid")}

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
      </form>
    </div>
  );
};

export default Profile;
