import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLeaveSummary } from "../feature/leave/leaveSlice";
import { getLeaves } from "../api/leave";
import { calculateLeaveSummary } from "../utils/leaveUtils";

export const useEmployeeLeaveStats = (setLoading: (val: boolean) => void, setError: (val: boolean) => void) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(false);

        const leaves = await getLeaves();
        const summary = calculateLeaveSummary(leaves, 18, 12);
        dispatch(setLeaveSummary(summary));
      } catch (err) {
        console.error("Failed to fetch leave stats:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [dispatch, setLoading, setError]);
};
