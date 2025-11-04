import React from "react";
import { useParams } from "react-router-dom";
import SignLetterPage from "./SignLetterPage";
import { useEffect, useState } from "react";

const SignLetterPageWrapper = () => {
  const { filename, userId } = useParams<{
    filename: string;
    userId: string;
  }>();
  const [pdfUrl, setPdfUrl] = useState<string>("");
  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const res = await fetch(
          "https://hrms-backend-2-t1l2.onrender.com/api/letters/generate",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstName: "John",
              lastName: "Doe",
              designation: "Software Engineer",
              joiningDate: "2025-11-04",
              ctc: 500000,
              phoneNumber: "9876543210",
              salaryDetails: {
                basicFixedMonthly: 20000,
                basicFixedYearly: 240000,
                hraFixedMonthly: 8000,
                hraFixedYearly: 96000,
                conveyanceMonthly: 1000,
                conveyanceYearly: 12000,
                otherAllowancesMonthly: 2000,
                otherAllowancesYearly: 24000,
                totalCTCMonthly: 31000,
                totalCTCYearly: 372000,
              },
            }),
          }
        );

        const data = await res.json();
        if (res.ok) {
          setPdfUrl(data.link);
        } else {
          console.error("Error generating PDF:", data);
        }
      } catch (error) {
        console.error("Error fetching letter PDF:", error);
      }
    };
    fetchPdf();
  }, [filename, userId]);

  return <SignLetterPage pdfUrl={pdfUrl} userId={userId} />;
};

export default SignLetterPageWrapper;
