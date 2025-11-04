import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignLetterPage: React.FC<{
  pdfUrl: string;
  userId: string;
  loading: boolean;
}> = ({ pdfUrl, userId, loading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleUploadPdf = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("No file selected");
      return;
    }
    if (!userId) {
      console.log("No userId - exiting");
      toast.error("User ID missing");
      return;
    }

  
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("userId", userId);

      const response = await fetch(
        "https://hrms-backend-2-t1l2.onrender.com/api/letters/signed-upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Signed PDF uploaded!");
        navigate("/Signed-Sucess");
      } else {
        toast.error("Upload failed");
        console.error("Upload failed:", result);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfUrl) {
      toast.error("PDF not ready yet.");
      return;
    }

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `Appointment_Letter.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-tr from-blue-50 via-indigo-100 to-purple-100 p-8 max-w-8xl mx-auto shadow-lg rounded-xl">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center drop-shadow-md">
        Sign Your Appointment Letter
      </h2>

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl space-y-6">
        <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
          How to complete the signing process
        </h3>

        <ol className="list-decimal list-inside space-y-4 text-gray-700 leading-relaxed text-lg">
          <li>
            <strong>View Your Letter:</strong> Click the{" "}
            <span className="italic font-semibold text-indigo-600">
              View Letter PDF
            </span>{" "}
            button below to open your appointment letter in a new tab.
          </li>
          <li>
            <strong>Download or Print:</strong> Save the letter to your device
            or print a physical copy.
          </li>
          <li>
            <strong>Sign the Letter:</strong> Physically sign the printed letter
            or digitally sign it using a PDF editor.
          </li>
          <li>
            <strong>Scan or Save Signed Copy:</strong> If you signed physically,
            scan or take a clear photo of the signed letter and save it as a
            PDF.
          </li>
          <li>
            <strong>Upload the Signed Letter:</strong> Use the{" "}
            <span className="italic font-semibold text-green-600">
              Submit Signed PDF
            </span>{" "}
            button below to upload your signed document.
          </li>
        </ol>

        <p className="text-sm text-gray-500 italic mt-4">
          Make sure the uploaded file is clear and fully legible. The accepted
          format is PDF only.
        </p>

        <div>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleUploadPdf}
            className="mt-2 border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-center space-x-6 mt-6">
        <button
          onClick={downloadPdf}
          disabled={loading}
          className={`px-8 py-4 text-white font-bold text-lg rounded-lg shadow-lg transition duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800"
          }`}
        >
          {loading ? "Generating..." : "Download Appointment Letter"}
        </button>

        <button
          onClick={handleSubmit}
          disabled={uploading}
          className={`px-8 py-4 font-bold text-lg rounded-lg shadow-lg text-white transition duration-300 ease-in-out drop-shadow-md ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
          }`}
        >
          {uploading ? "Uploading..." : "Submit Signed PDF"}
        </button>
      </div>
    </div>
  );
};

export default SignLetterPage;
