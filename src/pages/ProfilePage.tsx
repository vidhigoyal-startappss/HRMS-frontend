import React, { useEffect, useState } from "react";
import API, { updateEmployee } from "../api/auth";
import { toast } from "react-toastify";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { Edit, X } from "lucide-react";
import { useParams } from "react-router-dom";

const editableFields = ["firstName", "lastName", "phone"];
const maskedFields = ["adharNumber", "panNumber", "accountNumber", "ifscCode"];

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>({});
  const { user } = useSelector((state: RootState) => state.user);
  const { id } = useParams();
  const userId = id || user?.userId;

  useEffect(() => {
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

    const structuredPayload = {
      basicDetails: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        dob: profile.dob,
        gender: profile.gender,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        zipCode: profile.zipCode,
        country: profile.country,
        joiningDate: profile.joiningDate,
        designation: profile.designation,
        department: profile.department,
        employmentType: profile.employmentType,
        leaves: profile.leaves,
      },
      bankDetails: {
        bankName: profile.bankName,
        accountNumber: profile.accountNumber,
        ifscCode: profile.ifscCode,
        branchName: profile.branchName,
        accountHolderName: profile.accountHolderName,
        adharNumber: profile.adharNumber,
        panNumber: profile.panNumber,
      },
      educationDetails: {
        qualification: profile.qualification,
        institution: profile.institution,
        yearOfPassing: profile.yearOfPassing,
        grade: profile.grade,
      },
    };

    try {
      await updateEmployee(userId, structuredPayload);
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
    const isEditable = isEditing && editableFields.includes(name);
    const isMasked = maskedFields.includes(name);
    const isDateField = type === "date";
    const value = profile[name];
    const formattedValue = isDateField && value ? formatDate(value) : value;

    return (
      <div key={name}>
        <label className="block mb-1 text-sm font-semibold text-[#113F67]">
          {label}
        </label>
        {isEditable ? (
          <input
            name={name}
            type={type}
            value={formattedValue || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#87C0CD] text-sm"
          />
        ) : (
          <div className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-md text-gray-700">
            {isMasked ? maskValue(value, maskType) : formattedValue || "-"}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-8xl mx-auto px-6 py-2 bg-white rounded-2xl">
      <div className="flex justify-end items-center pb-2">
        <div className="flex items-center w-full justify-between bg-[#113F67] p-4 rounded-lg shadow-md hover:shadow-lg transition">
      <div className="flex  items-center gap-4">
        <img
  src={
    profile.profileImage
      ? profile.profileImage.startsWith("http")
        ? profile.profileImage
        : `${import.meta.env.VITE_APP_BASE_URL}/${profile.profileImage}`
      : "/default-avatar.png"
  }
  alt="Profile"
  className="w-24 h-24 rounded-full border-4 border-gray-200"
/>
<div className="flex flex-col gap-1 items-start">
          <h3 className="md:text-2xl font-semibold text-white">{profile?.firstName + " " + profile?.lastName}</h3>
          <p className="md:text-lg text-gray-300">{profile?.designation}</p>
        </div>
</div>
        
         <button
          type="button"
          onClick={() => setIsEditing((prev) => !prev)}
          className="text-sm flex gap-2 items-center cursor-pointer font-medium text-white px-4 py-2 rounded-md transition hover:text-gray-100"
        >
          {isEditing ? <X /> : <Edit />}
        </button>
      </div>

       
      </div>

      <form onSubmit={onSubmit} className="space-y-12">
        <section>
          <h3 className="text-xl font-extrabold text-black mb-6">Basic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </section>

        <section>
          <h3 className="text-xl font-extrabold text-black mb-6">Bank Details</h3>
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
          <h3 className="text-xl font-extrabold text-black mb-6">Educational Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderField("Highest Qualification", "qualification")}
            {renderField("University/Institution", "institution")}
            {renderField("Year of Passing", "yearOfPassing", "number")}
            {renderField("Grade/CGPA", "grade")}
          </div>
        </section>

        {isEditing && (
          <div className="text-right pt-6">
            <button
              type="submit"
              className="bg-[#113F67] text-white text-sm font-semibold px-6 py-2 rounded-md shadow-md transition hover:bg-[#226597]"
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