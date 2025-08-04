# 🚀 Vercel 部署指南（免費替代方案）

## 為什麼選擇 Vercel？
- ✅ 對 Next.js 應用原生支援
- ✅ 免費方案更慷慨
- ✅ 自動 HTTPS 和 CDN
- ✅ 零配置部署

## 📋 部署步驟

### 1. 準備 Vercel 帳號
1. 前往 https://vercel.com/
2. 使用 GitHub 帳號登入
3. 授權 Vercel 存取您的倉庫

### 2. 部署專案
1. 在 Vercel Dashboard 點擊 "New Project"
2. 選擇 `healthcare-scheduling-new` 倉庫
3. Vercel 會自動檢測到 Next.js 專案
4. 點擊 "Deploy"

### 3. 設定環境變數
在 Project Settings → Environment Variables 添加：

```bash
# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=1w00sTHsHBgZ4I-b_XIrXIBTI54kOP7G-y9jjICcuNgQ

# Google Service Account Credentials
GOOGLE_CREDENTIALS={"type":"service_account",...}

# NextAuth Configuration
NEXTAUTH_SECRET=healthcare-scheduling-secret-key-2025-very-long-random-string-for-security-purposes
NEXTAUTH_URL=https://your-vercel-domain.vercel.app

# Database Configuration (Vercel 會自動處理)
DATABASE_URL=./database/healthcare.db
```

## ⚠️ Vercel 特殊考量

### SQLite 限制
Vercel 的 serverless 環境不適合 SQLite，建議：

1. **使用 Vercel KV（推薦）**
   - Redis-based key-value store
   - 免費方案包含足夠使用量

2. **使用 Vercel Postgres**
   - 完全託管的 PostgreSQL
   - 免費方案適合小型應用

3. **保持 SQLite（臨時）**
   - 每次部署會重置資料
   - 僅適合測試

## 🔧 資料庫遷移選項

### 選項 A: 改用 Vercel KV（簡單）
```typescript
// 使用 Redis 作為簡單 key-value 存儲
import { kv } from '@vercel/kv';

// 存儲用戶
await kv.set('user:admin', { username: 'admin', ... });

// 存儲班表
await kv.set('schedule:2025-08', scheduleData);
```

### 選項 B: 改用 Vercel Postgres（功能完整）
```typescript
// 使用完整的 PostgreSQL 資料庫
import { sql } from '@vercel/postgres';

await sql`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    ...
  );
`;
```

## 🚀 快速部署命令

如果您想保持當前的 SQLite 架構（資料會重置）：

```bash
# 1. 確保代碼已推送到 GitHub
git add .
git commit -m "Ready for Vercel deployment"
git push

# 2. 直接在 Vercel 部署
# 前往 https://vercel.com/new
# 選擇您的 GitHub 倉庫
```

## 📱 部署後設定

1. **取得 Vercel 域名**
   - 通常是 `your-project-name.vercel.app`

2. **更新環境變數**
   ```bash
   NEXTAUTH_URL=https://your-actual-domain.vercel.app
   ```

3. **測試功能**
   - 用戶認證：admin/admin123
   - Google Sheets 同步
   - 班表管理

## 💡 Vercel vs Railway 比較

| 功能 | Vercel | Railway |
|------|--------|---------|
| Next.js 支援 | 原生優秀 | 需要配置 |
| 免費方案 | 慷慨 | 受限 |
| 資料庫 | 需要外部 | 支援 SQLite |
| 部署速度 | 極快 | 較慢 |
| 配置複雜度 | 簡單 | 中等 |

## 🎯 建議

**立即解決方案：**
1. 先在 Vercel 部署（保持 SQLite，接受資料重置）
2. 測試所有功能是否正常
3. 如需持久化資料，考慮升級到 Vercel KV/Postgres

**您想要我協助：**
- 🚀 立即部署到 Vercel（保持現有架構）
- 🔄 遷移到 Vercel KV/Postgres（需要修改代碼）
- 💰 回到 Railway 並升級付費方案

請告訴我您的選擇！
