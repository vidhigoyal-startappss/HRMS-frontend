import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";

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
    adharNumber: Yup.string().required(),
    panNumber: Yup.string().required(),
  }),
  educationDetails: Yup.object({
    qualification: Yup.string().required(),
    institution: Yup.string().required(),
    yearOfPassing: Yup.number().required(),
    grade: Yup.string().required(),
  }),
});

const UserUpdateProfile: React.FC = () => {
  const userId = "REPLACE_WITH_USER_ID";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    axios.get(`http://localhost:3000/api/users/${userId}`).then((res) => {
      reset(res.data);
    });
  }, [reset, userId]);

  const onSubmit = async (data: any) => {
  try {
    const flattenedData = {
      ...data.basicDetails,
      ...data.bankDetails,
      ...data.educationDetails,
    };

    await axios.put(`http://localhost:3000/api/users/${userId}`, flattenedData);
    toast.success("Profile updated successfully");
  } catch (error) {
    console.error("Update Employee Error:", error);
    toast.error("Failed to update profile");
  }
};


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-white shadow rounded-xl max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold">Basic Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="First Name"
          {...register("basicDetails.firstName")}
        />
        <input placeholder="Last Name" {...register("basicDetails.lastName")} />
        <input placeholder="Phone" {...register("basicDetails.phone")} />
        <input
          type="date"
          placeholder="DOB"
          {...register("basicDetails.dob")}
        />
        <input placeholder="Gender" {...register("basicDetails.gender")} />
        <input placeholder="Address" {...register("basicDetails.address")} />
        <input placeholder="City" {...register("basicDetails.city")} />
        <input placeholder="State" {...register("basicDetails.state")} />
        <input placeholder="Zip Code" {...register("basicDetails.zipCode")} />
        <input placeholder="Country" {...register("basicDetails.country")} />
        <input
          type="date"
          placeholder="Joining Date"
          {...register("basicDetails.joiningDate")}
        />
        <input
          placeholder="Designation"
          {...register("basicDetails.designation")}
        />
        <input
          placeholder="Department"
          {...register("basicDetails.department")}
        />
        <input
          placeholder="Employment Type"
          {...register("basicDetails.employmentType")}
        />
      </div>

      <h2 className="text-2xl font-bold mt-8">Bank Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <input placeholder="Bank Name" {...register("bankDetails.bankName")} />
        <input
          placeholder="Account Number"
          {...register("bankDetails.accountNumber")}
        />
        <input placeholder="IFSC Code" {...register("bankDetails.ifscCode")} />
        <input
          placeholder="Branch Name"
          {...register("bankDetails.branchName")}
        />
        <input
          placeholder="Account Holder Name"
          {...register("bankDetails.accountHolderName")}
        />
        <input
          placeholder="Aadhar Number"
          {...register("bankDetails.adharNumber")}
        />
        <input
          placeholder="PAN Number"
          {...register("bankDetails.panNumber")}
        />
      </div>

      <h2 className="text-2xl font-bold mt-8">Education Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="Highest Qualification"
          {...register("educationDetails.qualification")}
        />
        <input
          placeholder="University"
          {...register("educationDetails.institution")}
        />
        <input
          placeholder="Year of Passing"
          type="number"
          {...register("educationDetails.yearOfPassing")}
        />
        <input placeholder="Grade" {...register("educationDetails.grade")} />
      </div>

      <button
        type="submit"
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
};

export default UserUpdateProfile;
