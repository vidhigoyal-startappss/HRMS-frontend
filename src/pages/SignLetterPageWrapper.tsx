// import { useParams } from "react-router-dom";
// import SignLetterPage from "./SignLetterPage";

// const SignLetterPageWrapper = () => {
//   const { filename, userId } = useParams<{
//     filename: string;
//     userId: string;
//   }>();

//   const pdfUrl = `https://hrms1-kappa.vercel.app/uploads/letters/${filename}`;

//   return <SignLetterPage pdfUrl={pdfUrl} userId={userId} />;
// };

// export default SignLetterPageWrapper;












import { useParams } from "react-router-dom";
import SignLetterPage from "./SignLetterPage";
import { useEffect, useState } from "react";

const SignLetterPageWrapper = () => {
  const { filename, userId } = useParams<{ filename: string; userId: string }>();
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const res = await fetch("https://hrms-backend-2-t1l2.onrender.com/api/letters/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename, userId }), 
        });
        const data = await res.json();
        setPdfUrl(data.link);
      } catch (error) {
        console.error("Error fetching letter PDF:", error);
      }
    };
    fetchPdf();
  }, [filename, userId]);

  return <SignLetterPage pdfUrl={pdfUrl} userId={userId} />;
};

export default SignLetterPageWrapper;
