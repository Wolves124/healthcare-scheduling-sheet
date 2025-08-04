@echo off
echo 🚄 Railway 部署助手
echo.

echo 📋 請按照以下步驟部署到 Railway：
echo.

echo 1️⃣  前往 Railway
echo    網址: https://railway.app/
echo    使用 GitHub 帳號登入
echo.

echo 2️⃣  創建新專案
echo    - 點擊 "New Project"
echo    - 選擇 "Deploy from GitHub repo"
echo    - 選擇 "healthcare-scheduling-new" 倉庫
echo.

echo 3️⃣  設定環境變數
echo    在 Railway Dashboard 的 Variables 頁面添加：
echo.

echo    GOOGLE_SPREADSHEET_ID=1w00sTHsHBgZ4I-b_XIrXIBTI54kOP7G-y9jjICcuNgQ
echo.

echo    GOOGLE_CREDENTIALS=
echo    ^(需要複製您的 Google 憑證 JSON，壓縮成單行^)
echo.

echo    NEXTAUTH_SECRET=healthcare-scheduling-secret-key-2025-very-long-random-string-for-security-purposes
echo.

echo    NEXTAUTH_URL=https://your-app-name.railway.app
echo    ^(部署後更新為實際域名^)
echo.

echo    NODE_ENV=production
echo    PORT=3000
echo.

echo 4️⃣  取得部署域名
echo    - 部署完成後，在 Settings -^> Domains 取得域名
echo    - 更新 NEXTAUTH_URL 環境變數
echo.

echo 5️⃣  測試應用
echo    - 訪問您的 Railway 域名
echo    - 使用 admin/admin123 登入
echo    - 測試 Google Sheets 同步功能
echo.

echo ✅ 部署完成！
echo.

echo 📖 詳細說明請參考 RAILWAY_DEPLOYMENT.md
echo.

pause
