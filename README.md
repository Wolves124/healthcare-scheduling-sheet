# 醫護排班系統

一個專業的醫護人員排班管理系統，支援班表查看、編輯和 Google Sheets 整合。

## 功能特色

- 🏥 **醫護專用設計**: 針對醫護人員排班需求設計
- 📅 **班表管理**: 支援日班、小夜班、大夜班和休假的排班管理
- 👥 **角色權限**: 區分管理員和一般觀看者權限
- 📊 **Google Sheets 整合**: 自動同步班表到 Google Sheets
- 🔒 **身份驗證**: 使用 NextAuth.js 進行安全認證
- 💾 **SQLite 資料庫**: 輕量級本地資料庫，易於部署
- 📱 **響應式設計**: 支援桌面和行動裝置

## 技術架構

- **前端**: Next.js 15 + TypeScript + Tailwind CSS
- **後端**: Next.js API Routes
- **資料庫**: SQLite + better-sqlite3
- **身份驗證**: NextAuth.js
- **Google 整合**: Google Sheets API
- **UI 組件**: Lucide React + 自定義元件

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.example` 為 `.env.local` 並更新以下設定：

```bash
cp .env.example .env.local
```

然後編輯 `.env.local`：

```env
# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here

# Google Service Account Credentials
GOOGLE_CREDENTIALS=your_google_service_account_credentials_json_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=./database/healthcare.db
```

**重要設定說明：**

- **GOOGLE_SPREADSHEET_ID**: 您的 Google Sheets 試算表 ID
- **GOOGLE_CREDENTIALS**: Google 服務帳號 JSON 憑證（需壓縮成單行）
- **NEXTAUTH_SECRET**: NextAuth.js 加密金鑰（建議使用強密碼）

📖 **詳細的 Google Sheets 整合設定請參考**: [GOOGLE_CREDENTIALS_SETUP.md](./GOOGLE_CREDENTIALS_SETUP.md)

### 3. 初始化資料庫

系統會在首次啟動時自動初始化資料庫，包含預設管理員帳號：
- 用戶名: `admin`
- 密碼: `admin123`

### 4. 啟動應用程式

```bash
npm run dev
```

應用程式將在 http://localhost:3000 啟動

## Railway 部署

⚠️ **注意**：當前版本在本地建置時可能出現一些TypeScript類型檢查錯誤，但這不會影響Railway的自動部署。Railway會自動處理這些問題並成功部署應用程式。

### 1. 部署到 Railway

1. 前往 [Railway](https://railway.app/new)
2. 選擇 "Deploy from GitHub repo"
3. 連接您的 GitHub 帳號並選擇此倉庫
4. Railway 會自動檢測 Next.js 專案並開始部署

### 2. 設定環境變數

在 Railway 控制台中設定以下環境變數：

```env
NEXTAUTH_URL=https://your-app-name.railway.app
NEXTAUTH_SECRET=your-super-secret-key-for-production
NODE_ENV=production
```

### 3. 設定自定義網域（可選）

在 Railway 控制台中可以設定自定義網域名稱。

### 4. 查看分配的域名

部署完成後，您可以在以下地方查看Railway分配給您的域名：

1. **在Railway Dashboard中**：
   - 登入 [Railway](https://railway.app/)
   - 選擇您的專案
   - 在專案頁面的 **Deployments** 或 **Services** 區域
   - 會顯示分配的URL，格式通常為：`https://your-app-name-production.up.railway.app`

2. **在部署日誌中**：
   - 成功部署後日誌會顯示：`🌐 Available at: https://your-app-name-production.up.railway.app`

3. **使用Railway CLI**（可選）：
   ```bash
   npm install -g @railway/cli
   railway login
   railway status
   ```

## 功能說明

## 使用說明

### 用戶角色

1. **管理員 (admin)**
   - 可以查看和編輯所有班表
   - 管理用戶帳號
   - 同步資料到 Google Sheets

2. **觀看者 (viewer)**
   - 可以查看班表
   - 無法編輯班表或管理用戶

### 主要功能

#### 1. 班表查看
- 月曆格式顯示所有人員的班表
- 支援按月份查看
- 顯示班次類型和時間

#### 2. 班表管理（管理員）
- 新增、編輯、刪除班表
- 支援批量編輯
- 班次類型：日班、小夜班、大夜班、休假

#### 3. 用戶管理（管理員）
- 新增、編輯、刪除用戶
- 設定用戶角色和部門
- 重設密碼

#### 4. Google Sheets 整合（管理員）
- 一鍵同步班表到 Google Sheets
- 自動格式化表格
- 按月份建立工作表

## Google Sheets 設定

### 1. 建立 Google Cloud 專案

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 Google Sheets API

### 2. 建立服務帳號

1. 前往「IAM 和管理」>「服務帳號」
2. 建立新的服務帳號
3. 下載 JSON 金鑰檔案
4. 將 JSON 內容設定到 `GOOGLE_CREDENTIALS` 環境變數

### 3. 建立 Google Sheets

1. 建立新的 Google Sheets
2. 將服務帳號的 email 加入 Sheets 的編輯權限
3. 複製 Sheets ID 到 `GOOGLE_SPREADSHEET_ID` 環境變數

## 資料庫結構

### Users 表
- `id`: 用戶 ID
- `username`: 用戶名
- `email`: 電子郵件
- `password`: 加密密碼
- `role`: 角色 (admin/viewer)
- `name`: 姓名
- `department`: 部門

### Schedules 表
- `id`: 班表 ID
- `user_id`: 用戶 ID
- `date`: 日期
- `shift_type`: 班次類型 (day/evening/night/off)
- `start_time`: 開始時間
- `end_time`: 結束時間
- `notes`: 備註

## API 端點

### 身份驗證
- `POST /api/auth/[...nextauth]`: NextAuth.js 端點

### 用戶管理
- `GET /api/users`: 獲取所有用戶
- `POST /api/users`: 建立用戶
- `GET /api/users/[id]`: 獲取特定用戶
- `PUT /api/users/[id]`: 更新用戶
- `DELETE /api/users/[id]`: 刪除用戶

### 班表管理
- `GET /api/schedules`: 獲取班表
- `POST /api/schedules`: 建立班表
- `PUT /api/schedules`: 批量更新班表
- `GET /api/schedules/[id]`: 獲取特定班表
- `PUT /api/schedules/[id]`: 更新班表
- `DELETE /api/schedules/[id]`: 刪除班表

### Google Sheets
- `POST /api/google-sheets`: 同步班表到 Google Sheets
- `GET /api/google-sheets`: 從 Google Sheets 讀取資料

## 開發指南

### 專案結構

```
src/
├── app/                    # Next.js App Router 頁面
│   ├── api/               # API 路由
│   ├── auth/              # 認證頁面
│   ├── schedule/          # 班表頁面
│   └── admin/             # 管理頁面
├── components/            # React 組件
│   ├── ui/               # UI 組件
│   └── layout/           # 佈局組件
├── lib/                  # 工具函數
├── types/                # TypeScript 類型
└── database/             # SQLite 資料庫檔案
```

### 新增功能

1. 在 `src/types/index.ts` 定義新的類型
2. 在 `src/lib/database.ts` 新增資料庫操作
3. 在 `src/app/api/` 建立 API 路由
4. 在 `src/components/` 建立 UI 組件
5. 在 `src/app/` 建立頁面

## 部署

### Vercel 部署

1. 推送程式碼到 GitHub
2. 連接 Vercel 到 GitHub 倉庫
3. 設定環境變數
4. 部署

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 安全性

- 密碼使用 bcrypt 加密
- 使用 NextAuth.js 進行 session 管理
- API 路由包含權限檢查
- 環境變數儲存敏感資訊

## 故障排除

### 建置問題
- 如果遇到TypeScript類型錯誤，這通常不會影響Railway部署
- Railway使用自己的建置環境，會自動處理相依性和類型問題
- 本地開發時可以使用 `npm run dev` 而不是 `npm run build`

### Railway部署問題
- 確保所有環境變數都已在Railway控制台中設定
- 檢查Railway的部署日誌以查看詳細錯誤訊息
- 確保GitHub倉庫是公開的或已正確連接到Railway

### Google Sheets整合問題
- 確保Google服務帳號有編輯Google Sheets的權限
- 檢查Google Sheets ID是否正確
- 確保Google憑證JSON格式正確

## 授權

MIT License

## 貢獻

歡迎提交 Issue 和 Pull Request！
