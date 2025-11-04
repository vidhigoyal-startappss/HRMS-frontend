import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignLetterPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pdfUrl, userId } = location.state as { pdfUrl: string; userId: string };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUploadPdf = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return toast.error("No file selected");
    if (!userId) return toast.error("User ID missing");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("userId", userId);

      const res = await fetch(
        "https://hrms-backend-2-t1l2.onrender.com/api/letters/signed-upload",
        { method: "POST", body: formData }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Signed PDF uploaded!");
        navigate("/Signed-Success");
      } else {
        toast.error("Upload failed");
        console.error(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  };

  const viewPdf = () => {
    if (!pdfUrl) return toast.error("PDF not ready yet");
    const newTab = window.open(pdfUrl, "_blank", "noopener,noreferrer");
    if (newTab) newTab.focus();
    else toast.error("Please allow popups for this site.");
  };

  const copyToClipboard = () => {
    if (!pdfUrl) return toast.error("PDF URL not available");
    navigator.clipboard.writeText(pdfUrl);
    toast.success("PDF URL copied to clipboard!");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Sign Your Appointment Letter</h1>

      {pdfUrl && (
        <div className="mb-6 bg-gray-100 p-4 rounded">
          <p className="mb-2 font-semibold text-gray-700">Your Generated PDF Link:</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={pdfUrl}
              readOnly
              className="flex-1 border border-gray-300 rounded p-2"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      <div className="flex space-x-4 mb-6">
        <button
          onClick={viewPdf}
          className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          View Letter PDF
        </button>
      </div>

      <div className="mb-4">
        <input type="file" accept="application/pdf" onChange={handleUploadPdf} />
      </div>
      <button
        onClick={handleSubmit}
        disabled={uploading}
        className={`px-6 py-3 rounded text-white ${
          uploading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {uploading ? "Uploading..." : "Submit Signed PDF"}
      </button>
    </div>
  );
};

export default SignLetterPage;
