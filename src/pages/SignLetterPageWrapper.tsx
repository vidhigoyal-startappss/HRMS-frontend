import { useParams } from "react-router-dom";
import SignLetterPage from "./SignLetterPage";
import { useEffect, useState } from "react";

interface SalaryDetails {
  basicFixedMonthly: string;
  basicFixedYearly: string;
  hraFixedMonthly: string;
  hraFixedYearly: string;
  conveyanceMonthly: string;
  conveyanceYearly: string;
  dearnessAllowancesMonthly: string;
  dearnessAllowancesYearly: string;
  otherAllowancesMonthly: string;
  otherAllowancesYearly: string;
  annualGrossSalaryMonthly: string;
  annualGrossSalaryYearly: string;
  employerPFMonthly: string;
  employerPFYearly: string;
  totalFixedPayMonthly: string;
  totalFixedPayYearly: string;
  individualVariablePayMonthly: string;
  individualVariablePayYearly: string;
  totalCTCMonthly: string;
  totalCTCYearly: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  designation: string;
  joiningDate: string;
  ctc: number;
  phoneNumber: string;
  salaryDetails: SalaryDetails;
}

const SignLetterPageWrapper = () => {
  const { userId } = useParams<{ userId: string }>();
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch user profile and salary details dynamically
        const res = await fetch(`https://hrms-backend-2-t1l2.onrender.com/api/users/${userId}`);
        const data: UserProfile = await res.json();
        setProfile(data);

        // Once profile is fetched, generate the PDF
        const pdfRes = await fetch(
          "https://hrms-backend-2-t1l2.onrender.com/api/letters/generate",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );

        const pdfData = await pdfRes.json();
        setPdfUrl(pdfData.link);
      } catch (error) {
        console.error("Error fetching profile or generating PDF:", error);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  return <SignLetterPage pdfUrl={pdfUrl} userId={userId} />;
};

export default SignLetterPageWrapper;
