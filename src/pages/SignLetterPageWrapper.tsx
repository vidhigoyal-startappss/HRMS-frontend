import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SignLetterPage from "./SignLetterPage";
import toast from "react-hot-toast";

const SignLetterPageWrapper = () => {
  const { filename, userId } = useParams<{
    filename: string;
    userId: string;
  }>();
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPdf = async () => {
      setLoading(true);
      try {
        const userRes = await fetch(
          `https://hrms-backend-2-t1l2.onrender.com/api/users/employee/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const userData = await userRes.json();

        if (!userRes.ok || !userData) {
          toast.error("Failed to fetch user details");
          setLoading(false);
          return;
        }

        const {
          firstName,
          lastName,
          designation,
          joiningDate,
          phoneNumber,
          ctc,
          salaryDetails,
        } = userData;

        const res = await fetch(
          "https://hrms-backend-2-t1l2.onrender.com/api/letters/generate",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstName,
              lastName,
              designation,
              joiningDate,
              ctc: Number(ctc),
              phoneNumber,
              salaryDetails,
            }),
          }
        );

        const data = await res.json();
        if (res.ok) {
          setPdfUrl(data.link);
        } else {
          console.error("Error generating PDF:", data);
          toast.error("Failed to generate letter.");
        }
      } catch (error) {
        console.error("Error fetching letter PDF:", error);
        toast.error("Error generating PDF.");
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();
  }, [userId]);

  return <SignLetterPage pdfUrl={pdfUrl} userId={userId} loading={loading} />;
};

export default SignLetterPageWrapper;
