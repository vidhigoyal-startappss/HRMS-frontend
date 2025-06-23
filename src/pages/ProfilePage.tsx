import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { updateEmployee } from "../api/auth";

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>({});
  const { user } = useSelector((state: RootState) => state.user);
  const userId = user?.userId;

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/users/employee/${userId}`)
      .then((res) => setProfile(res.data))
      .catch((err) => toast.error("Failed to load profile"));
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  const renderField = (label: string, name: string, type = "text") => (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <input
        name={name}
        type={type}
        value={profile[name] || ""}
        onChange={handleInputChange}
        disabled={!isEditing}
        className={`w-full px-3 py-2 border rounded ${
          !isEditing ? "bg-gray-100" : "bg-white"
        }`}
      />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-xl relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Profile</h2>
        <button
          type="button"
          onClick={() => setIsEditing((prev) => !prev)}
          className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Basic Details */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Basic Details</h3>
          <div className="grid grid-cols-3 gap-6">
            {renderField("First Name", "firstName")}
            {renderField("Last Name", "lastName")}
            {renderField("Phone", "phone")}
            {renderField("Date of Birth", "dob")}
            {renderField("Gender", "gender")}
            {renderField("Address", "address")}
            {renderField("City", "city")}
            {renderField("State", "state")}
            {renderField("Zip Code", "zipCode")}
            {renderField("Country", "country")}
            {renderField("Joining Date", "joiningDate")}
            {renderField("Designation", "designation")}
            {renderField("Department", "department")}
            {renderField("Employment Type", "employmentType")}
          </div>
        </div>

        {/* Bank Details */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Bank Details</h3>
          <div className="grid grid-cols-3 gap-6">
            {renderField("Bank Name", "bankName")}
            {renderField("Account Number", "accountNumber")}
            {renderField("IFSC Code", "ifscCode")}
            {renderField("Branch Name", "branchName")}
            {renderField("Account Holder Name", "accountHolderName")}
            {renderField("Aadhar Number", "adharNumber")}
            {renderField("PAN Number", "panNumber")}
          </div>
        </div>

        {/* Education Details */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Education Details</h3>
          <div className="grid grid-cols-3 gap-6">
            {renderField("Highest Qualification", "qualification")}
            {renderField("University", "institution")}
            {renderField("Year of Passing", "yearOfPassing", "number")}
            {renderField("Grade", "grade")}
          </div>
        </div>

        {isEditing && (
          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Update Profile
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
