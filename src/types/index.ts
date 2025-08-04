// 用戶類型定義
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'viewer';
  name: string;
  department?: string;
  created_at: string;
  updated_at: string;
}

// 班表類型定義
export interface Schedule {
  id: number;
  user_id: number;
  date: string;
  shift_type: 'day' | 'evening' | 'night' | 'off';
  start_time?: string;
  end_time?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// 班表統計類型
export interface ScheduleStats {
  user_id: number;
  user_name: string;
  department?: string;
  total_shifts: number;
  day_shifts: number;
  evening_shifts: number;
  night_shifts: number;
  off_days: number;
}

// 月度班表查看類型
export interface MonthlySchedule {
  year: number;
  month: number;
  schedules: (Schedule & { user_name: string; department?: string })[];
}

// API 回應類型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 班表表單類型
export interface ScheduleFormData {
  user_id: number;
  date: string;
  shift_type: 'day' | 'evening' | 'night' | 'off';
  start_time?: string;
  end_time?: string;
  notes?: string;
}

// 用戶註冊表單類型
export interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
  name: string;
  department?: string;
  role: 'admin' | 'viewer';
}

// 用戶登入表單類型
export interface UserLoginData {
  username: string;
  password: string;
}

// Google Sheets 配置類型
export interface GoogleSheetsConfig {
  spreadsheetId: string;
  range: string;
  apiKey?: string;
  credentials?: any;
}

// 班表過濾選項
export interface ScheduleFilter {
  startDate?: string;
  endDate?: string;
  userId?: number;
  department?: string;
  shiftType?: 'day' | 'evening' | 'night' | 'off';
}
