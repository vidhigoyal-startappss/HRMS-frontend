import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { ArrowLeft } from "lucide-react";
import { popFromHistory } from "../../../feature/navigation/navigationSlice";

const BackButton = ({ fallbackPath = "/", label = "Go Back" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const history = useSelector((state: RootState) => state.navigation.history);
  const handleBack = () => {
    if (window.history.length > 1) {

      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center justify-center gap-2 cursor-pointer text-sm text-[#113F67] hover:text-gray-500"
    >
      <ArrowLeft size={18} className="mr-1" />
    </button>
  );
};

export default BackButton;
