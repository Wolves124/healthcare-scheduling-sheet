'use client';

import { useState, useEffect } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/Loading';

interface Schedule {
  id: number;
  user_id: number;
  date: string;
  shift_type: 'day' | 'evening' | 'night' | 'off';
  start_time?: string;
  end_time?: string;
  notes?: string;
  user_name: string;
  department?: string;
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  useEffect(() => {
    fetchSchedules();
  }, [year, month]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/schedules?year=${year}&month=${month}`);
      const data = await response.json();
      
      if (data.success) {
        setSchedules(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const getShiftDisplay = (shift: Schedule) => {
    const shiftNames = {
      day: '白班',
      evening: '小夜',
      night: '大夜',
      off: '休假'
    };

    const name = shiftNames[shift.shift_type];
    if (shift.start_time && shift.end_time && shift.shift_type !== 'off') {
      return `${name}\n${shift.start_time}-${shift.end_time}`;
    }
    return name;
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  if (loading) {
    return <LoadingPage message="載入班表中..." />;
  }

  const daysInMonth = getDaysInMonth(year, month);
  const users = Array.from(new Set(schedules.map(s => s.user_name)))
    .sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-6">
      {/* 標題和導航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">班表查看</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={goToPreviousMonth}>
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-800 min-w-[120px] text-center">
            {year}年{month}月
          </h2>
          <Button variant="outline" onClick={goToNextMonth}>
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 班表表格 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                  姓名/科室
                </th>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <th key={i + 1} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    {i + 1}日
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={daysInMonth + 1} className="px-6 py-8 text-center text-gray-500">
                    本月暫無班表資料
                  </td>
                </tr>
              ) : (
                users.map((userName) => {
                  const userSchedules = schedules.filter(s => s.user_name === userName);
                  const userDepartment = userSchedules[0]?.department;
                  
                  return (
                    <tr key={userName} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{userName}</div>
                          {userDepartment && (
                            <div className="text-sm text-gray-500">{userDepartment}</div>
                          )}
                        </div>
                      </td>
                      {Array.from({ length: daysInMonth }, (_, i) => {
                        const day = i + 1;
                        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                        const schedule = userSchedules.find(s => s.date === dateStr);
                        
                        return (
                          <td key={day} className="px-3 py-4 text-center text-sm">
                            {schedule ? (
                              <div className={`
                                inline-block px-2 py-1 rounded text-xs font-medium whitespace-pre-line
                                ${schedule.shift_type === 'day' ? 'bg-blue-100 text-blue-800' : ''}
                                ${schedule.shift_type === 'evening' ? 'bg-orange-100 text-orange-800' : ''}
                                ${schedule.shift_type === 'night' ? 'bg-purple-100 text-purple-800' : ''}
                                ${schedule.shift_type === 'off' ? 'bg-gray-100 text-gray-800' : ''}
                              `}>
                                {getShiftDisplay(schedule)}
                              </div>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 圖例 */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">班次說明</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 rounded"></div>
            <span className="text-sm text-gray-700">白班 (日班)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-100 rounded"></div>
            <span className="text-sm text-gray-700">小夜班</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-100 rounded"></div>
            <span className="text-sm text-gray-700">大夜班</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <span className="text-sm text-gray-700">休假</span>
          </div>
        </div>
      </div>
    </div>
  );
}
