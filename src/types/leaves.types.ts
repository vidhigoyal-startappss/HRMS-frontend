export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface Leave {
  id: string;
  type: string;
  from: string;
  to: string;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
}

export interface LeaveBalance {
  type: string;
  remaining: number;
  total: number;
}
