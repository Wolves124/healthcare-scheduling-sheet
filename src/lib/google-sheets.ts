import { google, sheets_v4 } from 'googleapis';
import { GoogleSheetsConfig, Schedule, User } from '@/types';

export class GoogleSheetsService {
  private sheets: sheets_v4.Sheets;
  private spreadsheetId: string;

  constructor(config: GoogleSheetsConfig) {
    this.spreadsheetId = config.spreadsheetId;
    
    // 設定 Google API 認證
    const auth = new google.auth.GoogleAuth({
      credentials: config.credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    console.log('Google Sheets service initialized');
  }

  // 讀取工作表數據
  async readSheet(range: string): Promise<any[][]> {
    try {
      console.log(`Reading sheet range: ${range}`);
      
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: range,
      });

      return response.data.values || [];
    } catch (error) {
      console.error('Error reading sheet:', error);
      throw error;
    }
  }

  // 寫入工作表數據
  async writeSheet(range: string, values: any[][]): Promise<boolean> {
    try {
      console.log(`Writing to sheet range: ${range}, values count: ${values.length}`);
      
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: range,
        valueInputOption: 'RAW',
        requestBody: {
          values: values,
        },
      });

      return true;
    } catch (error) {
      console.error('Error writing to sheet:', error);
      throw error;
    }
  }

  // 清除工作表數據
  async clearSheet(range: string): Promise<boolean> {
    try {
      console.log(`Clearing sheet range: ${range}`);
      
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: range,
      });

      return true;
    } catch (error) {
      console.error('Error clearing sheet:', error);
      throw error;
    }
  }

  // 創建月度班表工作表
  async createMonthlyScheduleSheet(
    year: number,
    month: number,
    scheduleData: Schedule[]
  ): Promise<boolean> {
    try {
      console.log(`Creating monthly schedule sheet for ${year}-${month}, data count: ${scheduleData.length}`);
      
      const sheetName = `${year}年${month}月班表`;
      
      // 首先嘗試創建新的工作表
      try {
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          requestBody: {
            requests: [{
              addSheet: {
                properties: {
                  title: sheetName,
                }
              }
            }]
          }
        });
        console.log(`Created new sheet: ${sheetName}`);
      } catch (error) {
        // 工作表可能已存在，繼續
        console.log(`Sheet ${sheetName} may already exist, continuing...`);
      }

      // 建立表頭
      const headers = ['日期', '姓名', '班別', '開始時間', '結束時間', '備註'];
      
      // 準備數據
      const values = [headers];
      
      // 引入用戶操作來獲取用戶信息
      const { userOperations } = await import('@/lib/database');
      
      scheduleData.forEach(schedule => {
        // 查找用戶信息
        const user = userOperations.getUserById(schedule.user_id);
        const userName = user ? user.name : `用戶${schedule.user_id}`;
        
        // 班別中文化
        const shiftTypeMap = {
          'day': '白班',
          'evening': '晚班', 
          'night': '夜班',
          'off': '休假'
        };
        
        values.push([
          schedule.date,
          userName,
          shiftTypeMap[schedule.shift_type] || schedule.shift_type,
          schedule.start_time || '',
          schedule.end_time || '',
          schedule.notes || ''
        ]);
      });

      // 如果沒有班表數據，至少顯示表頭
      if (scheduleData.length === 0) {
        values.push(['無班表數據', '', '', '', '', '']);
      }

      // 寫入數據
      await this.writeSheet(`${sheetName}!A1:F${values.length}`, values);
      
      console.log(`Successfully created schedule sheet for ${year}-${month}`);
      return true;
    } catch (error) {
      console.error('Error creating monthly schedule sheet:', error);
      throw error;
    }
  }
}

// 創建 Google Sheets 服務實例的工廠函數
export function createGoogleSheetsService(config: GoogleSheetsConfig): GoogleSheetsService {
  return new GoogleSheetsService(config);
}

// 用於環境變數中的 Google 憑證配置
export function getGoogleCredentials(): any {
  try {
    const credentialsJson = process.env.GOOGLE_CREDENTIALS;
    if (!credentialsJson) {
      console.warn('GOOGLE_CREDENTIALS environment variable not set');
      return null;
    }
    
    const credentials = JSON.parse(credentialsJson);
    
    // 檢查是否為測試憑證
    if (credentials.private_key_id === 'test123' || 
        credentials.private_key.includes('TEST_PRIVATE_KEY_PLACEHOLDER')) {
      console.warn('Using test Google credentials. Please replace with actual credentials.');
      return null;
    }
    
    return credentials;
  } catch (error) {
    console.error('Error parsing Google credentials:', error);
    return null;
  }
}
