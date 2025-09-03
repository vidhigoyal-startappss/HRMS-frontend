interface LeaveRecord {
  startDate: string;
  endDate: string | null;
  noOfDays: number;
  dayType: "fullday" | "halfday";
  leaveType: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface LeaveSummary {
  paidUsed: number;
  unpaidUsed: number;
  paidLeft: number;
  wfhLeft: number;
  totalPaidYearly: number;
  totalWfhYearly: number;
  totalPaidMonthly: number;
  totalWfhMonthly: number;
  monthlyApplied: number;
  approvedCount: number;
  pendingCount: number;
  earnedLeavesTillNow: number;
}

export function calculateLeaveSummary(
  leaves: LeaveRecord[],
  plLeftInitial: number,
  wfhLeftInitial: number
): LeaveSummary {
  let paidUsedAllTime = 0;
  let paidUsedThisMonth = 0;
  let unpaidUsedThisMonth = 0;
  let wfhUsedAllTime = 0;
  let wfhUsedThisMonth = 0;
  let monthlyApplied = 0;
  let approvedCount = 0;
  let pendingCount = 0;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthlyPlCap = 1.5;

  for (const leave of leaves) {
    const leaveDate = new Date(leave.startDate);
    const leaveMonth = leaveDate.getMonth();
    const leaveYear = leaveDate.getFullYear();
    const leaveDays = leave.dayType === "halfday" ? 0.5 : leave.noOfDays;

    if (leaveMonth === currentMonth && leaveYear === currentYear) {
      monthlyApplied += 1;
    }

    if (leave.status === "Approved") approvedCount++;
    if (leave.status === "Pending") pendingCount++;

    if (leave.status !== "Approved") continue;

    if (leave.leaveType === "work") {
      wfhUsedAllTime += leaveDays;
      if (leaveMonth === currentMonth && leaveYear === currentYear) {
        wfhUsedThisMonth += leaveDays;
      }
    } else {
      paidUsedAllTime += leaveDays;

      if (leaveMonth === currentMonth && leaveYear === currentYear) {
        const availableThisMonth = monthlyPlCap - paidUsedThisMonth;
        if (availableThisMonth >= leaveDays) {
          paidUsedThisMonth += leaveDays;
        } else {
          paidUsedThisMonth += availableThisMonth;
          unpaidUsedThisMonth += leaveDays - availableThisMonth;
        }
      }
    }
  }

  const startYear =
    leaves.length > 0
      ? new Date(leaves[0].startDate).getFullYear()
      : now.getFullYear();
  const startMonth =
    leaves.length > 0
      ? new Date(leaves[0].startDate).getMonth()
      : now.getMonth();
  const endYear = now.getFullYear();
  const endMonth = now.getMonth();

  function* monthGenerator(
    startY: number,
    startM: number,
    endY: number,
    endM: number
  ) {
    let y = startY;
    let m = startM;
    while (y < endY || (y === endY && m <= endM)) {
      yield { year: y, month: m };
      m++;
      if (m > 11) {
        m = 0;
        y++;
      }
    }
  }

  let carryForward = 0;

  for (const { year, month } of monthGenerator(
    startYear,
    startMonth,
    endYear,
    endMonth
  )) {
    const monthlyPaidLeaves = leaves.filter(
      (leave) =>
        leave.status === "Approved" &&
        leave.leaveType !== "work" &&
        new Date(leave.startDate).getFullYear() === year &&
        new Date(leave.startDate).getMonth() === month
    );

    const used = monthlyPaidLeaves.reduce((sum, leave) => {
      const days = leave.dayType === "halfday" ? 0.5 : leave.noOfDays;
      return sum + days;
    }, 0);

    carryForward = Math.max(carryForward + monthlyPlCap - used, 0);
  }

  const earnedLeavesTillNow = parseFloat(carryForward.toFixed(2));
  const paidLeft = Math.max(plLeftInitial - paidUsedAllTime, 0);

  return {
    paidUsed: parseFloat(paidUsedThisMonth.toFixed(2)),
    unpaidUsed: parseFloat(unpaidUsedThisMonth.toFixed(2)),
    paidLeft: parseFloat(paidLeft.toFixed(2)),
    wfhLeft: Math.max(
      parseFloat((wfhLeftInitial - wfhUsedAllTime).toFixed(2)),
      0
    ),
    totalPaidYearly: parseFloat(paidUsedAllTime.toFixed(2)),
    totalWfhYearly: parseFloat(wfhUsedAllTime.toFixed(2)),
    totalPaidMonthly: parseFloat(paidUsedThisMonth.toFixed(2)),
    totalWfhMonthly: parseFloat(wfhUsedThisMonth.toFixed(2)),
    monthlyApplied,
    approvedCount,
    pendingCount,
    earnedLeavesTillNow,
  };
}
