# Railway 部署指南

## 📋 Railway 部署步驟

### 1. 準備 Railway 帳號
1. 前往 https://railway.app/
2. 使用 GitHub 帳號登入
3. 連接您的 GitHub 倉庫

### 2. 創建新專案
1. 點擊 "New Project"
2. 選擇 "Deploy from GitHub repo"
3. 選擇 `healthcare-scheduling-new` 倉庫
4. Railway 會自動檢測到 Dockerfile 並開始部署

### 3. 設定環境變數
在 Railway Dashboard 中設定以下環境變數：

```bash
# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=1w00sTHsHBgZ4I-b_XIrXIBTI54kOP7G-y9jjICcuNgQ

# Google Service Account Credentials (壓縮成單行)
GOOGLE_CREDENTIALS={"type":"service_account","project_id":"healthcare-467709"...}

# NextAuth Configuration
NEXTAUTH_SECRET=healthcare-scheduling-secret-key-2025-very-long-random-string-for-security-purposes
NEXTAUTH_URL=https://your-app-name.railway.app

# Database Configuration (Railway 會自動處理)
DATABASE_URL=./database/healthcare.db

# Production Settings
NODE_ENV=production
PORT=3000
```

### 4. 部署域名設定
1. 在 Railway Dashboard 中，前往 "Settings" -> "Domains"
2. 生成一個 Railway 域名 (例如: `healthcare-scheduling-abcd1234.railway.app`)
3. 更新 `NEXTAUTH_URL` 環境變數為新的域名

### 5. 資料庫處理
- SQLite 資料庫會在容器中自動創建
- 首次訪問時會自動初始化
- 預設管理員帳號：admin / admin123

## 🔧 部署後設定

### 更新 NEXTAUTH_URL
部署成功後，記得更新環境變數：
```bash
NEXTAUTH_URL=https://your-actual-domain.railway.app
```

### 檢查 Google Sheets 權限
確保您的 Google Service Account 有存取指定 Google Sheets 的權限。

## 🚀 自動部署
- 每次推送到 GitHub main 分支時，Railway 會自動重新部署
- 可在 Railway Dashboard 查看部署日誌

## 📱 訪問應用
部署完成後，您可以通過 Railway 提供的 URL 訪問您的應用：
- 主頁：https://your-domain.railway.app
- 管理面板：https://your-domain.railway.app/admin
- 預設登入：admin / admin123

## ⚠️ 注意事項
1. Railway 免費方案有使用限制
2. SQLite 資料在容器重啟時會重置（可考慮升級到 PostgreSQL）
3. 確保環境變數正確設定
4. 定期備份重要資料
