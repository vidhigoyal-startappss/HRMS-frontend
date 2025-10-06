import { useParams } from "react-router-dom";
import SignLetterPage from "./SignLetterPage";

const SignLetterPageWrapper = () => {
  const { filename, userId } = useParams<{
    filename: string;
    userId: string;
  }>();

  const pdfUrl = `http://localhost:3000/uploads/letters/${filename}`;

  return <SignLetterPage pdfUrl={pdfUrl} userId={userId} />;
};

export default SignLetterPageWrapper;
