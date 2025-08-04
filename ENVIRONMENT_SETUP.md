# 🔧 環境變數設定指南

## 必要環境變數設定

在專案根目錄建立 `.env.local` 文件，並設定以下變數：

```bash
# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here

# Google Service Account Credentials
# 將您的 Google 服務帳號 JSON 憑證壓縮成單行並放在這裡
GOOGLE_CREDENTIALS={"type":"service_account","project_id":"..."}

# NextAuth Configuration  
NEXTAUTH_SECRET=your_super_long_random_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=./database/healthcare.db
```

## 🔐 安全提醒

⚠️ **重要：**
- 請勿將 `.env.local` 檔案提交到 Git
- `.env.local` 已在 `.gitignore` 中被排除
- 請妥善保管您的 Google 服務帳號憑證

## 📝 設定步驟

1. 從 Google Cloud Console 下載服務帳號 JSON 金鑰
2. 將 JSON 內容壓縮成單行
3. 設定到 `GOOGLE_CREDENTIALS` 環境變數
4. 設定您的 Google Sheets ID
5. 生成一個安全的 `NEXTAUTH_SECRET`

## 🚀 啟動系統

設定完成後，執行：
```bash
npm install
npm run dev
```

系統將在 http://localhost:3000 啟動。
