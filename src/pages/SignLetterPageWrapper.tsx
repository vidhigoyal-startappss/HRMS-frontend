import { useParams } from "react-router-dom";
import SignLetterPage from "./SignLetterPage";

const SignLetterPageWrapper = () => {
  const { filename, userId } = useParams<{
    filename: string;
    userId: string;
  }>();

  const pdfUrl = `https://hrms-backend-2-t1l2.onrender.com/uploads/letters/${filename}`;

  return <SignLetterPage pdfUrl={pdfUrl} userId={userId} />;
};

export default SignLetterPageWrapper;
