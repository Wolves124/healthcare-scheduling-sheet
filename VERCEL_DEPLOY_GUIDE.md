# 🚀 Vercel 部署指南 - 簡化版

## 步驟 1：前往 Vercel 網站
直接在瀏覽器打開：**https://vercel.com**

## 步驟 2：登入並導入專案
1. 使用 GitHub 帳號登入
2. 點擊 **"Add New..."** → **"Project"**
3. 選擇 **"Import Git Repository"**
4. 搜尋或輸入：`Wolves124/healthcare-scheduling-sheet`
5. 點擊 **"Import"**

## 步驟 3：配置專案設定
在配置頁面設定：

```
Framework Preset: Next.js
Root Directory: ./ (留空)
Build Command: npm run build
Output Directory: (留空)
Install Command: npm install
```

## 步驟 4：添加環境變數
點擊 **"Environment Variables"** 並添加以下 4 個變數：

### 🔑 必要的環境變數：

1. **GOOGLE_SPREADSHEET_ID**
   - 值：`1w00sTHsHBgZ4I-b_XIrXIBTI54kOP7G-y9jjICcuNgQ`

2. **GOOGLE_CREDENTIALS**
   - 值：從您本地 `.env.local` 檔案複製完整的 JSON 字串

3. **NEXTAUTH_SECRET**
   - 值：從您本地 `.env.local` 檔案複製

4. **NEXTAUTH_URL**
   - 值：`https://你的專案名稱.vercel.app`
   - ⚠️ 先設定一個臨時值，部署後再更新為實際域名

## 步驟 5：部署
1. 點擊 **"Deploy"**
2. 等待部署完成（約 2-3 分鐘）

## 步驟 6：更新 NEXTAUTH_URL
1. 部署完成後，複製您的 Vercel 域名
2. 前往 **Settings** → **Environment Variables**
3. 編輯 `NEXTAUTH_URL` 為實際域名
4. 在 **Deployments** 頁面觸發重新部署

## 🧪 測試部署
部署完成後訪問您的網站：
- 測試帳號：`admin` / `admin123`
- 檢查 Google Sheets 整合是否正常

## ❌ 如果部署失敗
嘗試以下設定：
- Framework Preset 改為 **"Other"**
- Output Directory 設為 **".next"**

---
📍 **GitHub 倉庫**：https://github.com/Wolves124/healthcare-scheduling-sheet
📍 **Vercel Dashboard**：https://vercel.com/dashboard
