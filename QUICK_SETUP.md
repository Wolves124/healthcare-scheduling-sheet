# 🚀 快速設置指南

## 🔧 環境變數設置

### 1. 創建 `.env.local` 文件
在專案根目錄創建 `.env.local` 文件並添加以下內容：

```env
# Google Sheets 配置
GOOGLE_SPREADSHEET_ID=your_google_sheet_id_here
GOOGLE_CREDENTIALS=your_google_service_account_credentials_json_here

# NextAuth 配置
NEXTAUTH_SECRET=your_very_long_secret_key_here
NEXTAUTH_URL=http://localhost:3000
```

### 2. Google 憑證設置
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 創建新專案或選擇現有專案
3. 啟用 Google Sheets API
4. 創建服務帳號
5. 下載 JSON 憑證文件
6. 將 JSON 內容壓縮成單行並複製到 `GOOGLE_CREDENTIALS`

### 3. Google Sheets 設置
1. 創建新的 Google Sheets
2. 複製 Sheet ID（URL 中的長字串）
3. 將 Sheet ID 設置為 `GOOGLE_SPREADSHEET_ID`
4. 與服務帳號電子郵件共享該 Sheet（編輯權限）

## 🎯 預設登入帳號
- **用戶名**: admin
- **密碼**: admin123

## 🚀 啟動應用
```bash
npm install
npm run dev
```

應用將在 http://localhost:3000 啟動。

## 📚 更多資訊
請參考專案根目錄的其他文檔文件了解詳細設置步驟。
