import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { ArrowLeft } from "lucide-react";
import { popFromHistory } from "../../../feature/navigation/navigationSlice";

const BackButton = ({ fallbackPath = "/dashboard", label = "Go Back" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const history = useSelector((state: RootState) => state.navigation.history);

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); 
      const previousPath = newHistory[newHistory.length - 1];

      dispatch(popFromHistory());
      navigate(previousPath);
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
