import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import React from "react";

type Role = "admin" | "employee" | "hr";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  accountType: string;
}

interface Education {
  degree: string;
  fieldOfStudy: string;
  university: string;
  passingYear: string;
  grade: string;
}

interface ProfileFormValues {
  profileImage?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  dateOfBirth: string;
  gender: string;
  address: Address;
  bankDetails: BankDetails;
  educationalDetails: Education[];
}

interface ProfileFormProps {
  role: Role;
}

export default function ProfileForm({ role }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm<ProfileFormValues>({
    defaultValues: {
      profileImage: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      designation: "",
      dateOfBirth: "",
      gender: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      bankDetails: {
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        branch: "",
        accountType: "",
      },
      educationalDetails: [
        {
          degree: "",
          fieldOfStudy: "",
          university: "",
          passingYear: "",
          grade: "",
        },
      ],
    },
  });

  const [isEditing, setIsEditing] = useState<boolean>(role !== "employee");
  const profileImage = watch("profileImage");

  const onSubmit: SubmitHandler<ProfileFormValues> = (data) => {
    alert(
      role === "employee"
        ? "Profile updated successfully!"
        : "Profile saved by Admin/HR!"
    );
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("profileImage", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-6">
      {/* Profile Card */}
      <div className="w-full md:w-1/4 bg-white rounded-xl shadow-md p-6 flex flex-col items-center sticky top-6 h-fit">
        <div className="relative w-32 h-32 mb-4">
          <img
            src={profileImage || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2">
          {`${getValues("firstName")} ${getValues("lastName")}` ||
            "Employee Name"}
        </h3>
        <p className="text-gray-600 mb-2">
          {getValues("designation") || "Designation"}
        </p>
        <div className="text-sm text-gray-500 space-y-1 text-center">
          <p>
            <strong>Email:</strong> {getValues("email") || "email@example.com"}
          </p>
          <p>
            <strong>Phone:</strong> {getValues("phone") || "000-000-0000"}
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {`${getValues("address")?.city || "City"}, ${
              getValues("address")?.state || "State"
            }`}
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-3/4 overflow-x-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="min-w-[600px] space-y-8"
        >
          {/* Basic Details */}
          <Section title="Basic Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                disabled={!isEditing}
                error={errors.firstName}
                {...register("firstName", { required: true })}
              />
              <Input
                label="Last Name"
                disabled={!isEditing}
                error={errors.lastName}
                {...register("lastName", { required: true })}
              />
              <Input
                label="Email"
                disabled={!isEditing}
                type="email"
                error={errors.email}
                {...register("email", { required: true })}
              />
              <Input
                label="Phone"
                disabled={!isEditing}
                error={errors.phone}
                {...register("phone", { required: true })}
              />
              <Input
                label="Designation"
                disabled={!isEditing}
                error={errors.designation}
                {...register("designation", { required: true })}
              />
              <Input
                label="Date of Birth"
                disabled={!isEditing}
                type="date"
                error={errors.dateOfBirth}
                {...register("dateOfBirth", { required: true })}
              />
              <div>
                <label className="block mb-1 font-semibold">Gender</label>
                <select
                  {...register("gender", { required: true })}
                  disabled={!isEditing}
                  className="w-full border rounded-lg p-2 disabled:bg-gray-100"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm">Gender is required</p>
                )}
              </div>
            </div>

            {/* Address */}
            <h3 className="text-lg font-semibold mt-6 mb-2">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Street"
                disabled={!isEditing}
                error={errors?.address?.street}
                {...register("address.street", { required: true })}
              />
              <Input
                label="City"
                disabled={!isEditing}
                error={errors?.address?.city}
                {...register("address.city", { required: true })}
              />
              <Input
                label="State"
                disabled={!isEditing}
                error={errors?.address?.state}
                {...register("address.state", { required: true })}
              />
              <Input
                label="Zip Code"
                disabled={!isEditing}
                error={errors?.address?.zipCode}
                {...register("address.zipCode", { required: true })}
              />
              <Input
                label="Country"
                disabled={!isEditing}
                error={errors?.address?.country}
                {...register("address.country", { required: true })}
              />
            </div>
          </Section>

          {/* Bank Details */}
          <Section title="Bank Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Account Holder Name"
                disabled={!isEditing}
                error={errors?.bankDetails?.accountHolderName}
                {...register("bankDetails.accountHolderName", {
                  required: true,
                })}
              />
              <Input
                label="Bank Name"
                disabled={!isEditing}
                error={errors?.bankDetails?.bankName}
                {...register("bankDetails.bankName", { required: true })}
              />
              <Input
                label="Account Number"
                disabled={!isEditing}
                error={errors?.bankDetails?.accountNumber}
                {...register("bankDetails.accountNumber", { required: true })}
              />
              <Input
                label="IFSC Code"
                disabled={!isEditing}
                error={errors?.bankDetails?.ifscCode}
                {...register("bankDetails.ifscCode", { required: true })}
              />
              <Input
                label="Branch"
                disabled={!isEditing}
                error={errors?.bankDetails?.branch}
                {...register("bankDetails.branch", { required: true })}
              />
              <Input
                label="Account Type"
                disabled={!isEditing}
                error={errors?.bankDetails?.accountType}
                {...register("bankDetails.accountType", { required: true })}
              />
            </div>
          </Section>

          {/* Educational Details */}
          <Section title="Educational Details">
            {getValues("educationalDetails").map((_, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Degree"
                    disabled={!isEditing}
                    {...register(`educationalDetails.${index}.degree`, {
                      required: true,
                    })}
                  />
                  <Input
                    label="Field of Study"
                    disabled={!isEditing}
                    {...register(`educationalDetails.${index}.fieldOfStudy`, {
                      required: true,
                    })}
                  />
                  <Input
                    label="University"
                    disabled={!isEditing}
                    {...register(`educationalDetails.${index}.university`, {
                      required: true,
                    })}
                  />
                  <Input
                    label="Passing Year"
                    disabled={!isEditing}
                    {...register(`educationalDetails.${index}.passingYear`, {
                      required: true,
                    })}
                  />
                  <Input
                    label="Grade"
                    disabled={!isEditing}
                    {...register(`educationalDetails.${index}.grade`, {
                      required: true,
                    })}
                  />
                </div>
              </div>
            ))}
          </Section>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            {!isEditing && role === "employee" && (
              <button
                type="button"
                onClick={handleEditClick}
                className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg shadow-md"
              >
                Update
              </button>
            )}
            {isEditing && (
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
              >
                {role === "employee" ? "Update Profile" : "Save Profile"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
