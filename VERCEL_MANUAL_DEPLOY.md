# 🔧 Vercel 手動部署指南

## 問題解決方案：No Output Directory "public" found

如果您遇到此錯誤，請按照以下步驟手動配置：

### 步驟 1：前往 Vercel Dashboard
1. 登入 https://vercel.com
2. 點擊 "Add New..." → "Project"

### 步驟 2：導入 GitHub 倉庫
1. 選擇 "Import Git Repository"
2. 輸入：`https://github.com/Wolves124/healthcare-scheduling-sheet`
3. 點擊 "Import"

### 步驟 3：配置項目設置
在項目配置頁面中：

**Framework Preset**: Next.js
**Root Directory**: `./` (保持空白或 ./)
**Build Command**: `npm run build`
**Output Directory**: 留空（讓 Next.js 自動檢測）
**Install Command**: `npm install`

### 步驟 4：設置環境變數
點擊 "Environment Variables" 並添加以下變數（請使用您本地 .env.local 文件中的實際值）：

#### 必要的環境變數：
- `GOOGLE_SPREADSHEET_ID`: 您的 Google Sheets ID
- `GOOGLE_CREDENTIALS`: 您的 Google Service Account JSON 憑證（完整字符串）
- `NEXTAUTH_SECRET`: 用於 NextAuth.js 的密鑰
- `NEXTAUTH_URL`: https://your-app-name.vercel.app

⚠️ **重要提醒**：請從您本地的 .env.local 文件複製實際的環境變數值，不要使用示例值！

### 步驟 5：部署
1. 點擊 "Deploy"
2. 等待部署完成
3. 獲取域名後，更新 `NEXTAUTH_URL` 環境變數

### 步驟 6：部署後設置
1. 前往項目的 Settings → Environment Variables
2. 編輯 `NEXTAUTH_URL` 為您的實際域名
3. 觸發重新部署（Settings → Deployments → 最新部署 → Redeploy）

## 🧪 測試
部署完成後：
- 使用測試帳號登入：admin / admin123
- 測試所有功能是否正常

## 🔧 如果還是失敗
嘗試在項目設置中：
1. Framework Preset 改為 "Other"
2. Build Command: `npm run build`
3. Output Directory: `.next`
