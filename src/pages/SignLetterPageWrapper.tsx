import { useParams } from "react-router-dom";
import SignLetterPage from "./SignLetterPage";

const SignLetterPageWrapper = () => {
  const { filename } = useParams<{ filename: string }>();
  const pdfUrl = `http://localhost:3000/uploads/letters/${filename}`;

  return <SignLetterPage pdfUrl={pdfUrl} />;
};

export default SignLetterPageWrapper;
