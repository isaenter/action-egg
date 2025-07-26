import { create } from 'zustand';
import dayjs from 'dayjs';
import type { Employee, Schedule, AttendanceRecord, LeaveRequest, Department } from '../types';

// 生成模拟排班数据
const generateMockSchedules = (): Schedule[] => {
  const schedules: Schedule[] = [];
  const employeeIds = ['1', '2', '3'];
  const shifts = ['morning', 'afternoon', 'night', 'rest'] as const;
  
  // 生成未来30天的排班
  for (let i = 0; i < 30; i++) {
    const date = dayjs().add(i, 'day').format('YYYY-MM-DD');
    employeeIds.forEach((employeeId, index) => {
      const shiftIndex = (i + index) % shifts.length;
      const shift = shifts[shiftIndex];
      
      schedules.push({
        id: `schedule-${employeeId}-${i}`,
        employeeId,
        date,
        shift,
        startTime: shift === 'rest' ? undefined : shift === 'morning' ? '08:00' : shift === 'afternoon' ? '16:00' : '00:00',
        endTime: shift === 'rest' ? undefined : shift === 'morning' ? '16:00' : shift === 'afternoon' ? '24:00' : '08:00'
      });
    });
  }
  
  return schedules;
};

// 生成模拟考勤记录
const generateMockAttendanceRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const employeeIds = ['1', '2', '3'];
  
  // 生成过去30天的考勤记录
  for (let i = 1; i <= 30; i++) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
    // 跳过周末
    if (dayjs().subtract(i, 'day').day() === 0 || dayjs().subtract(i, 'day').day() === 6) continue;
    
    employeeIds.forEach(employeeId => {
      const random = Math.random();
      let status: AttendanceRecord['status'] = 'normal';
      let checkInTime = '09:00';
      let checkOutTime = '18:00';
      let workHours = 8;
      let overtimeHours = 0;

      if (random < 0.1) {
        status = 'late';
        checkInTime = '09:30';
      } else if (random < 0.15) {
        status = 'early_leave';
        checkOutTime = '17:30';
        workHours = 7.5;
      } else if (random < 0.2) {
        status = 'overtime';
        checkOutTime = '20:00';
        workHours = 10;
        overtimeHours = 2;
      } else if (random < 0.25) {
        status = 'absent';
        checkInTime = undefined as string | undefined;
        checkOutTime = undefined as string | undefined;
        workHours = 0;
      }

      records.push({
        id: `record-${employeeId}-${date}`,
        employeeId,
        date,
        checkInTime: checkInTime as string | undefined,
        checkOutTime: checkOutTime as string | undefined,
        workHours,
        status,
        overtimeHours
      });
    });
  }
  
  return records;
};

// 生成模拟请假记录
const generateMockLeaveRequests = (): LeaveRequest[] => {
  const requests: LeaveRequest[] = [];
  const employeeIds = ['1', '2', '3'];
  const leaveTypes = ['annual', 'sick', 'personal'] as const;
  const statuses = ['pending', 'approved', 'rejected'] as const;
  
  // 生成一些请假记录
  for (let i = 0; i < 8; i++) {
    const employeeId = employeeIds[i % employeeIds.length];
    const type = leaveTypes[i % leaveTypes.length];
    const status = statuses[i % statuses.length];
    const startDate = dayjs().subtract(Math.floor(Math.random() * 30), 'day');
    const days = Math.floor(Math.random() * 5) + 1;
    const endDate = startDate.add(days - 1, 'day');
    
    requests.push({
      id: `leave-${i + 1}`,
      employeeId,
      type,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      days,
      reason: `${type === 'annual' ? '年假休息' : type === 'sick' ? '身体不适需要休息' : '家庭事务处理'}`,
      status,
      appliedAt: startDate.subtract(Math.floor(Math.random() * 7), 'day').toISOString(),
      approvedBy: status !== 'pending' ? '管理员' : undefined,
      approvedAt: status !== 'pending' ? startDate.subtract(Math.floor(Math.random() * 5), 'day').toISOString() : undefined,
      comments: status === 'approved' ? '批准休假' : status === 'rejected' ? '当前工作繁忙，暂不批准' : undefined
    });
  }
  
  return requests;
};

interface AppState {
  // 员工管理
  employees: Employee[];
  departments: Department[];
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  // 排班管理
  schedules: Schedule[];
  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (id: string, schedule: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  
  // 考勤记录
  attendanceRecords: AttendanceRecord[];
  addAttendanceRecord: (record: AttendanceRecord) => void;
  updateAttendanceRecord: (id: string, record: Partial<AttendanceRecord>) => void;
  
  // 请假管理
  leaveRequests: LeaveRequest[];
  addLeaveRequest: (request: LeaveRequest) => void;
  updateLeaveRequest: (id: string, request: Partial<LeaveRequest>) => void;
  approveLeaveRequest: (id: string, approvedBy: string, comments?: string) => void;
  rejectLeaveRequest: (id: string, approvedBy: string, comments?: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // 初始数据
  employees: [
    {
      id: '1',
      name: '张三',
      employeeId: 'EMP001',
      department: '技术部',
      position: '前端工程师',
      phone: '13800138001',
      email: 'zhangsan@company.com',
      status: 'active',
      hireDate: '2023-01-15'
    },
    {
      id: '2',
      name: '李四',
      employeeId: 'EMP002',
      department: '技术部',
      position: '后端工程师',
      phone: '13800138002',
      email: 'lisi@company.com',
      status: 'active',
      hireDate: '2023-02-01'
    },
    {
      id: '3',
      name: '王五',
      employeeId: 'EMP003',
      department: '产品部',
      position: '产品经理',
      phone: '13800138003',
      email: 'wangwu@company.com',
      status: 'active',
      hireDate: '2023-03-10'
    }
  ],
  
  departments: [
    { id: '1', name: '技术部', manager: '张三', description: '负责产品技术开发' },
    { id: '2', name: '产品部', manager: '王五', description: '负责产品规划设计' },
    { id: '3', name: '运营部', description: '负责产品运营推广' },
    { id: '4', name: '人事部', description: '负责人力资源管理' }
  ],
  
  schedules: generateMockSchedules(),
  attendanceRecords: generateMockAttendanceRecords(),
  leaveRequests: generateMockLeaveRequests(),
  
  // 员工管理方法
  addEmployee: (employee) => set((state) => ({
    employees: [...state.employees, employee]
  })),
  
  updateEmployee: (id, updatedEmployee) => set((state) => ({
    employees: state.employees.map(emp => 
      emp.id === id ? { ...emp, ...updatedEmployee } : emp
    )
  })),
  
  deleteEmployee: (id) => set((state) => ({
    employees: state.employees.filter(emp => emp.id !== id)
  })),
  
  // 排班管理方法
  addSchedule: (schedule) => set((state) => ({
    schedules: [...state.schedules, schedule]
  })),
  
  updateSchedule: (id, updatedSchedule) => set((state) => ({
    schedules: state.schedules.map(schedule =>
      schedule.id === id ? { ...schedule, ...updatedSchedule } : schedule
    )
  })),
  
  deleteSchedule: (id) => set((state) => ({
    schedules: state.schedules.filter(schedule => schedule.id !== id)
  })),
  
  // 考勤记录方法
  addAttendanceRecord: (record) => set((state) => ({
    attendanceRecords: [...state.attendanceRecords, record]
  })),
  
  updateAttendanceRecord: (id, updatedRecord) => set((state) => ({
    attendanceRecords: state.attendanceRecords.map(record =>
      record.id === id ? { ...record, ...updatedRecord } : record
    )
  })),
  
  // 请假管理方法
  addLeaveRequest: (request) => set((state) => ({
    leaveRequests: [...state.leaveRequests, request]
  })),
  
  updateLeaveRequest: (id, updatedRequest) => set((state) => ({
    leaveRequests: state.leaveRequests.map(request =>
      request.id === id ? { ...request, ...updatedRequest } : request
    )
  })),
  
  approveLeaveRequest: (id, approvedBy, comments) => set((state) => ({
    leaveRequests: state.leaveRequests.map(request =>
      request.id === id ? {
        ...request,
        status: 'approved',
        approvedBy,
        approvedAt: new Date().toISOString(),
        comments
      } : request
    )
  })),
  
  rejectLeaveRequest: (id, approvedBy, comments) => set((state) => ({
    leaveRequests: state.leaveRequests.map(request =>
      request.id === id ? {
        ...request,
        status: 'rejected',
        approvedBy,
        approvedAt: new Date().toISOString(),
        comments
      } : request
    )
  })),
}));