import * as yup from "yup";

export const LeaveRequestSchema = yup.object().shape({
  leaveType: yup.string().required("Leave type is required"),
  dayType: yup.string().required("Day type is required"),
  startDate: yup
    .date()
    .required("Start date is required")
    .min(new Date(Date.now()), "Start date must be after today"),
  endDate: yup
    .date()
    .required("End date is required")
    .test("valid-range", "End date must be after start date and include weekdays", function (value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return false;

      const start = new Date(startDate);
      const end = new Date(value);

      if (end <= start) {
        return this.createError({ message: "End date must be after start date" });
      }

      // Count weekdays
      let current = new Date(start);
      let workingDays = 0;
      while (current <= end) {
        const day = current.getDay();
        if (day !== 0 && day !== 6) {
          workingDays++;
        }
        current.setDate(current.getDate() + 1);
      }

      if (workingDays <= 0) {
        return this.createError({ message: "No weekdays in the selected range" });
      }

      return true;
    }),
  reason: yup.string().required("Reason is required").min(5, "Reason too short"),
});
