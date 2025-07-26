// 员工信息类型
export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  avatar?: string;
  hireDate: string;
}

// 排班信息类型
export interface Schedule {
  id: string;
  employeeId: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night' | 'rest';
  startTime?: string;
  endTime?: string;
}

// 考勤记录类型
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  workHours: number;
  status: 'normal' | 'late' | 'early_leave' | 'absent' | 'overtime';
  overtimeHours?: number;
}

// 请假申请类型
export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'other';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  comments?: string;
}

// 部门类型
export interface Department {
  id: string;
  name: string;
  manager?: string;
  description?: string;
}

// 统计数据类型
export interface AttendanceStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  overtimeHours: number;
  leaveRequests: number;
}