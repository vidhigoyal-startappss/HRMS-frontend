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

  
const { userId, filename } = useParams<{ userId: string; filename: string }>();
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
      console.log("PDF API Response:", data);
      setPdfUrl(data.link || data.url);
    } catch (err) {
      console.error(err);
    }
  };
  fetchPdf();
}, [filename, userId]);

  if (!pdfUrl) {
    return <div className="text-center mt-20 text-gray-600">Generating your letter...</div>;
  }
  return <SignLetterPage pdfUrl={pdfUrl} userId={userId} />;
};

export default SignLetterPageWrapper;
