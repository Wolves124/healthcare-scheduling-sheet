// import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, Schedule, ScheduleFormData, UserRegistrationData } from '@/types';

// 暫時使用記憶體儲存，之後可改為真實資料庫
// 使用 globalThis 來防止 Next.js 開發模式下的模組重載造成資料遺失
declare global {
  var memoryDB: {
    users: User[];
    schedules: Schedule[];
    nextUserId: number;
    nextScheduleId: number;
    initialized: boolean;
  } | undefined;
}

const memoryDB = globalThis.memoryDB ?? {
  users: [] as User[],
  schedules: [] as Schedule[],
  nextUserId: 1,
  nextScheduleId: 1,
  initialized: false
};

if (process.env.NODE_ENV === 'development') {
  globalThis.memoryDB = memoryDB;
}

// 初始化資料庫
export function initDatabase() {
  if (!memoryDB.initialized) {
    console.log('Memory database initialized successfully');
    memoryDB.initialized = true;
  }
}

// 用戶相關操作
export const userOperations = {
  // 創建用戶
  async createUser(userData: UserRegistrationData): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const newUser: User = {
      id: memoryDB.nextUserId++,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      name: userData.name,
      department: userData.department,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    memoryDB.users.push(newUser);
    return newUser;
  },

  // 根據 ID 獲取用戶
  getUserById(id: number): User | null {
    return memoryDB.users.find(user => user.id === id) || null;
  },

  // 根據用戶名獲取用戶
  getUserByUsername(username: string): User | null {
    return memoryDB.users.find(user => user.username === username) || null;
  },

  // 根據 email 獲取用戶
  getUserByEmail(email: string): User | null {
    return memoryDB.users.find(user => user.email === email) || null;
  },

  // 獲取所有用戶
  getAllUsers(): User[] {
    return [...memoryDB.users].sort((a, b) => a.name.localeCompare(b.name));
  },

  // 驗證密碼
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  // 更新用戶
  updateUser(id: number, updates: Partial<User>): boolean {
    const userIndex = memoryDB.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    memoryDB.users[userIndex] = {
      ...memoryDB.users[userIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return true;
  },

  // 刪除用戶
  deleteUser(id: number): boolean {
    const userIndex = memoryDB.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    memoryDB.users.splice(userIndex, 1);
    // 同時刪除該用戶的所有班表
    memoryDB.schedules = memoryDB.schedules.filter(schedule => schedule.user_id !== id);
    return true;
  }
};

// 班表相關操作
export const scheduleOperations = {
  // 創建班表
  createSchedule(scheduleData: ScheduleFormData): Schedule {
    const newSchedule: Schedule = {
      id: memoryDB.nextScheduleId++,
      user_id: scheduleData.user_id,
      date: scheduleData.date,
      shift_type: scheduleData.shift_type,
      start_time: scheduleData.start_time,
      end_time: scheduleData.end_time,
      notes: scheduleData.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    memoryDB.schedules.push(newSchedule);
    return newSchedule;
  },

  // 根據 ID 獲取班表
  getScheduleById(id: number): Schedule | null {
    return memoryDB.schedules.find(schedule => schedule.id === id) || null;
  },

  // 獲取用戶的班表
  getSchedulesByUser(userId: number, startDate?: string, endDate?: string): Schedule[] {
    let results = memoryDB.schedules.filter(schedule => schedule.user_id === userId);
    
    if (startDate) {
      results = results.filter(schedule => schedule.date >= startDate);
    }
    
    if (endDate) {
      results = results.filter(schedule => schedule.date <= endDate);
    }
    
    return results.sort((a, b) => a.date.localeCompare(b.date));
  },

  // 獲取特定日期範圍的所有班表
  getSchedulesByDateRange(startDate: string, endDate: string): (Schedule & { user_name: string; department?: string })[] {
    const results = memoryDB.schedules
      .filter(schedule => schedule.date >= startDate && schedule.date <= endDate)
      .map(schedule => {
        const user = memoryDB.users.find(u => u.id === schedule.user_id);
        return {
          ...schedule,
          user_name: user?.name || 'Unknown',
          department: user?.department
        };
      });
    
    return results.sort((a, b) => a.date.localeCompare(b.date) || a.user_name.localeCompare(b.user_name));
  },

  // 獲取特定月份的班表
  getMonthlySchedules(year: number, month: number): (Schedule & { user_name: string; department?: string })[] {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
    
    return this.getSchedulesByDateRange(startDate, endDate);
  },

  // 更新班表
  updateSchedule(id: number, updates: Partial<ScheduleFormData>): boolean {
    const scheduleIndex = memoryDB.schedules.findIndex(schedule => schedule.id === id);
    if (scheduleIndex === -1) return false;

    memoryDB.schedules[scheduleIndex] = {
      ...memoryDB.schedules[scheduleIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return true;
  },

  // 創建或更新班表（Upsert）
  upsertSchedule(scheduleData: ScheduleFormData): Schedule {
    const existingIndex = memoryDB.schedules.findIndex(
      schedule => schedule.user_id === scheduleData.user_id && schedule.date === scheduleData.date
    );
    
    if (existingIndex !== -1) {
      this.updateSchedule(memoryDB.schedules[existingIndex].id, scheduleData);
      return memoryDB.schedules[existingIndex];
    } else {
      return this.createSchedule(scheduleData);
    }
  },

  // 刪除班表
  deleteSchedule(id: number): boolean {
    const scheduleIndex = memoryDB.schedules.findIndex(schedule => schedule.id === id);
    if (scheduleIndex === -1) return false;

    memoryDB.schedules.splice(scheduleIndex, 1);
    return true;
  },

  // 刪除用戶的特定日期班表
  deleteScheduleByUserAndDate(userId: number, date: string): boolean {
    const scheduleIndex = memoryDB.schedules.findIndex(
      schedule => schedule.user_id === userId && schedule.date === date
    );
    if (scheduleIndex === -1) return false;

    memoryDB.schedules.splice(scheduleIndex, 1);
    return true;
  }
};

// 初始化資料庫並創建預設管理員用戶
export async function setupDatabase() {
  initDatabase();

  // 檢查是否已有管理員用戶，如果沒有就創建
  const adminExists = userOperations.getUserByUsername('admin');
  
  if (!adminExists) {
    console.log('Creating default admin user...');
    // 創建預設管理員用戶
    await userOperations.createUser({
      username: 'admin',
      email: 'admin@hospital.com',
      password: 'admin123',
      role: 'admin',
      name: '系統管理員',
      department: 'IT'
    });
    
    console.log('Default admin user created: admin/admin123');
  } else {
    console.log('Admin user already exists');
  }
  
  memoryDB.initialized = true;
  console.log('Database setup completed. Total users:', memoryDB.users.length);
}

// 關閉資料庫連接（記憶體版本不需要）
export function closeDatabase() {
  console.log('Memory database closed');
}

export default memoryDB;
