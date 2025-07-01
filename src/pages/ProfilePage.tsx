import React, { useEffect, useState } from "react";
import API from "../api/auth";
import { toast } from "react-toastify";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { updateEmployee } from "../api/auth";
import { Edit } from "lucide-react";

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>({});
  const { user } = useSelector((state: RootState) => state.user);
  const userId = user?.userId;

  useEffect(() => {
    API
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
      <label className="block mb-1 text-l font-bold text-black">{label}</label>
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
    <div className="max-w-6xl mx-auto px-8 py-10 bg-white rounded-2xl">
  {/* Header */}
  <div className="flex justify-between items-center mb-10  pb-4">
    <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
    <button
      type="button"
      onClick={() => setIsEditing((prev) => !prev)}
      className="text-sm flex gap-2 items-center cursor-pointer font-medium text-blue-600 border border-blue-600 px-4 py-2 rounded-md transition hover:bg-blue-50"
    >
      {isEditing ? <>Cancel Edit</>: <>Edit Profile<Edit/></>}
    </button>
  </div>

  <form onSubmit={onSubmit} className="space-y-12">
    {/* Basic Information */}
    <section>
      <h3 className="text-xl font-extrabold text-black mb-6">Basic Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </section>

    {/* Bank Details */}
    <section>
      <h3 className="text-xl font-extrabold text-black mb-6">Bank Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderField("Bank Name", "bankName")}
        {renderField("Account Number", "accountNumber")}
        {renderField("IFSC Code", "ifscCode")}
        {renderField("Branch Name", "branchName")}
        {renderField("Account Holder Name", "accountHolderName")}
        {renderField("Aadhar Number", "adharNumber")}
        {renderField("PAN Number", "panNumber")}
      </div>
    </section>

    {/* Education Details */}
    <section>
      <h3 className="text-xl font-extrabold text-black mb-6">Educational Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderField("Highest Qualification", "qualification")}
        {renderField("University/Institution", "institution")}
        {renderField("Year of Passing", "yearOfPassing", "number")}
        {renderField("Grade/CGPA", "grade")}
      </div>
    </section>

    {/* Submit Button */}
    {isEditing && (
      <div className="text-right pt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white text-sm font-medium px-6 py-2 rounded-md transition hover:bg-blue-700"
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
