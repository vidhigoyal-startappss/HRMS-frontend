import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const validationSchema = Yup.object({
  basicDetails: Yup.object({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    phone: Yup.string().required(),
    dob: Yup.string().required(),
    gender: Yup.string().required(),
    address: Yup.string().required(),
    city: Yup.string().required(),
    state: Yup.string().required(),
    zipCode: Yup.string().required(),
    country: Yup.string().required(),
    joiningDate: Yup.string().required(),
    designation: Yup.string().required(),
    department: Yup.string().required(),
    employmentType: Yup.string().required(),
  }),
  bankDetails: Yup.object({
    bankName: Yup.string().required(),
    accountNumber: Yup.string().required(),
    ifscCode: Yup.string().required(),
    branchName: Yup.string().required(),
    accountHolderName: Yup.string().required(),
    aadharNumber: Yup.string().required(),
    panNumber: Yup.string().required(),
  }),
  educationDetails: Yup.object({
    highestQualification: Yup.string().required(),
    university: Yup.string().required(),
    yearOfPassing: Yup.number().required(),
    grade: Yup.string().required(),
  }),
});

const Profile: React.FC = () => {
  const userId = useParams<{ userId: string }>();
  // const userId = "REPLACE_WITH_USER_ID"; // replace with actual user ID
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    // Fetch user data from the API
    axios.get(`http://localhost:3000/api/users/${userId}`).then((res) => {
      // Reset form with fetched data to populate the fields with existing values
      reset(res.data);
    });
  }, [reset, userId]);

  const onSubmit = async (data: any) => {
    try {
      await axios.put(`http://localhost:3000/api/users/${userId}`, data);
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
        {...register(name)}
        type={type}
        disabled={!isEditing}
        className={`w-full px-3 py-2 border rounded ${
          !isEditing ? "bg-gray-100" : "bg-white"
        }`}
      />
    </div>
  );
  console.log(userId);
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Details */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Basic Details</h3>
          <div className="grid grid-cols-3 gap-6">
            {renderField("First Name", "basicDetails.firstName")}
            {renderField("Last Name", "basicDetails.lastName")}
            {renderField("Phone", "basicDetails.phone")}
            {renderField("Date of Birth", "basicDetails.dob", "date")}
            {renderField("Gender", "basicDetails.gender")}
            {renderField("Address", "basicDetails.address")}
            {renderField("City", "basicDetails.city")}
            {renderField("State", "basicDetails.state")}
            {renderField("Zip Code", "basicDetails.zipCode")}
            {renderField("Country", "basicDetails.country")}
            {renderField("Joining Date", "basicDetails.joiningDate", "date")}
            {renderField("Designation", "basicDetails.designation")}
            {renderField("Department", "basicDetails.department")}
            {renderField("Employment Type", "basicDetails.employmentType")}
          </div>
        </div>

        {/* Bank Details */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Bank Details</h3>
          <div className="grid grid-cols-3 gap-6">
            {renderField("Bank Name", "bankDetails.bankName")}
            {renderField("Account Number", "bankDetails.accountNumber")}
            {renderField("IFSC Code", "bankDetails.ifscCode")}
            {renderField("Branch Name", "bankDetails.branchName")}
            {renderField(
              "Account Holder Name",
              "bankDetails.accountHolderName"
            )}
            {renderField("Aadhar Number", "bankDetails.aadharNumber")}
            {renderField("PAN Number", "bankDetails.panNumber")}
          </div>
        </div>

        {/* Education Details */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Education Details</h3>
          <div className="grid grid-cols-3 gap-6">
            {renderField(
              "Highest Qualification",
              "educationDetails.highestQualification"
            )}
            {renderField("University", "educationDetails.university")}
            {renderField(
              "Year of Passing",
              "educationDetails.yearOfPassing",
              "number"
            )}
            {renderField("Grade", "educationDetails.grade")}
          </div>
        </div>

        {isEditing && (
          <div className="text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
