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
import { useEffect, useState } from "react";
import SignLetterPage from "./SignLetterPage";

const SignLetterPageWrapper = () => {
  const { filename, userId } = useParams<{ filename: string; userId: string }>();
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(
          "https://hrms-backend-2-t1l2.onrender.com/api/letters/generate",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }), // or whatever data you send
          }
        );

        const result = await response.json();
        if (result?.link) {
          setPdfUrl(result.link); // ✅ Cloudinary public URL
        }
      } catch (error) {
        console.error("Error fetching letter PDF:", error);
      }
    };

    if (userId) {
      fetchPdf();
    }
  }, [userId]);

  return <SignLetterPage pdfUrl={pdfUrl} userId={userId} />;
};

export default SignLetterPageWrapper;
