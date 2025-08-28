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
];

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [profile, setProfile] = useState<any>({});
  const { user } = useSelector((state: RootState) => state.user);
  const { id } = useParams();
  const userId = id || user?.userId;
  const userRole = user?.role;

  const isSuperAdmin = userRole === "SuperAdmin";
  const isOwnProfile = userId === user?.userId;
  const canEdit = isSuperAdmin;
  const canEditOwnProfile = isSuperAdmin && isOwnProfile;
  const isHR = userRole === "HR";
  useEffect(() => {
    console.log("not coming", userId);
    API.get(`/api/users/employee/${userId}?archived=true`)
      .then((res) => setProfile(res.data))

      .catch(() => toast.error("Failed to load profile"));
  }, [userId]);

 
  const handleGenerateReport = async () => {
    try {
      const res = await fetch(
        "/templates/Offer_Letter_Ishan_Shrivastava (3).pdf"
      );
      if (!res.ok) throw new Error("Template PDF not found");

      const existingPdfBytes = await res.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const form = pdfDoc.getForm();

      form.getFields().forEach((field) => {
        console.log("Field Name:", field.getName());
        try {
          console.log("Field Value:", field.getText());
        } catch {}
      });

      const fullName = `${profile.firstName || ""} ${
        profile.lastName || ""
      }`.trim();
      const joiningDate = profile.joiningDate
        ? new Date(profile.joiningDate).toLocaleDateString()
        : "-";
      const designation = profile.designation || "-";
      const ctc = profile.ctc || "-";

      form.getTextField("Text1").setText(fullName);
      form.getTextField("Text2").setText(designation);
      form.getTextField("Text5").setText(joiningDate);
      form.getTextField("Text6").setText(ctc);

      form.updateFieldAppearances(helveticaFont);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${fullName}_Appointment_Letter.pdf`;
      link.click();
    } catch (error) {
      console.error("Error generating PDF report:", error);
      toast.error("Failed to generate PDF");
    }
  };

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
    const value = profile[name];
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
                          className="text-[10px] px-2 py-1 bg-[#fff] text-[#113F67] rounded-full cursor-pointer transition"
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
              {/* <p className=" grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                Employee ID: {profile?.employeeId || "-"}
              </p> */}
            </div>
          </div>
          {canEdit && (
            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              className="bg-white text-[#113F67] px-3 py-1 rounded-md text-sm font-semibold hover:bg-gray-100 transition"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          )}
          {isHR && (
            <button
              type="button"
              onClick={handleGenerateReport}
              className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-green-700 transition ml-2"
            >
              Generate
            </button>
          )}
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
