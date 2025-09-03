import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLeaveSummary } from "../feature/leave/leaveSlice";
import { getLeaves } from "../api/leave";
import { calculateLeaveSummary } from "../utils/leaveUtils";

export const useEmployeeLeaveStats = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetch = async () => {
      const leaves = await getLeaves();
      const summary = calculateLeaveSummary(leaves, 18, 12);
            dispatch(setLeaveSummary(summary));
    };

    fetch();
  }, [dispatch]);

  return {};
};