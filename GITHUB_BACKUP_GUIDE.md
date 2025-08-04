# 🚀 GitHub 備份設置指南

## 當前狀況
您的醫療排班系統已經完成開發，現在需要備份到 GitHub。

## 📋 備份前的重要安全檢查

**⚠️ 重要安全提醒：**
在備份到 GitHub 之前，我們需要確保敏感資訊不會被公開：

### 1. 檢查 `.gitignore` 設定
確保以下敏感檔案已經被忽略：
```
.env.local
healthcare-467709-f06499eaa7a3.json
node_modules/
.next/
```

### 2. 移除敏感檔案
您需要手動刪除或移動以下敏感檔案：
- `healthcare-467709-f06499eaa7a3.json` (Google 服務帳號金鑰)
- `.env.local` 已包含真實憑證

## 🔧 安裝 Git（如果尚未安裝）

### Windows 用戶：
1. 前往 https://git-scm.com/download/win
2. 下載並安裝 Git for Windows
3. 重新啟動命令提示字元或 PowerShell

### 驗證安裝：
```bash
git --version
```

## 📝 備份步驟

### 步驟 1: 初始化 Git 倉庫
```bash
cd "e:\Project\healthcare-scheduling-sheet"
git init
```

### 步驟 2: 設定 Git 用戶資訊
```bash
git config --global user.name "您的名字"
git config --global user.email "您的郵箱"
```

### 步驟 3: 添加檔案到 Git
```bash
git add .
```

### 步驟 4: 建立第一次提交
```bash
git commit -m "🎉 Initial commit: Healthcare Scheduling System with Google Sheets integration

Features:
- ✅ Complete healthcare scheduling system
- ✅ User authentication and role management
- ✅ Schedule viewing and management
- ✅ Google Sheets integration
- ✅ Admin dashboard
- ✅ Database management
- ✅ Responsive UI with Tailwind CSS"
```

### 步驟 5: 在 GitHub 上建立新倉庫
1. 前往 https://github.com/
2. 點擊右上角的 "+" → "New repository"
3. 倉庫名稱：`healthcare-scheduling-system`
4. 描述：`Healthcare staff scheduling system with Google Sheets integration`
5. 選擇 "Private" 或 "Public"（建議選擇 Private 因為包含商業邏輯）
6. 不要勾選 "Add a README file"（我們已經有了）
7. 點擊 "Create repository"

### 步驟 6: 連接到 GitHub 倉庫
```bash
git remote add origin https://github.com/Wolves124/healthcare-scheduling-new.git
```

### 步驟 7: 推送到 GitHub
```bash
git branch -M main
git push -u origin main
```

## 🔐 安全設定

### 1. 設定環境變數檔案模板
建立 `.env.example` 檔案作為範本：
```bash
# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here

# Google Service Account Credentials
GOOGLE_CREDENTIALS=your_google_credentials_json_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=./database/healthcare.db
```

### 2. 更新 README.md
在 README.md 中添加環境變數設定說明。

### 3. 後續更新
每次更新代碼後：
```bash
git add .
git commit -m "描述您的更改"
git push
```

## 📋 檢查清單

在執行備份前，請確認：
- [ ] Git 已安裝
- [ ] 敏感檔案已從倉庫中移除
- [ ] `.gitignore` 設定正確
- [ ] GitHub 倉庫已建立
- [ ] 所有功能都正常運作

## 🆘 如果需要協助

如果在任何步驟中遇到問題：
1. 檢查 Git 是否正確安裝
2. 確認網路連接正常
3. 驗證 GitHub 帳號權限
4. 檢查命令語法是否正確

完成這些步驟後，您的醫療排班系統就會安全地備份到 GitHub 了！
