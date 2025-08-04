@echo off
echo 🚀 Vercel 一鍵部署助手
echo.

echo 📋 準備部署到 Vercel（免費且更穩定的替代方案）
echo.

echo 1️⃣  推送最新代碼到 GitHub
echo    確保所有變更都已上傳...
git add .
git commit -m "🚀 Ready for Vercel deployment - optimized configuration"
git push origin clean-main

echo.
echo 2️⃣  前往 Vercel 部署
echo    網址: https://vercel.com/new
echo    或點擊一鍵部署按鈕：
echo    https://vercel.com/new/clone?repository-url=https://github.com/Wolves124/healthcare-scheduling-sheet^&env=GOOGLE_SPREADSHEET_ID,GOOGLE_CREDENTIALS,NEXTAUTH_SECRET,NEXTAUTH_URL
echo.

echo 3️⃣  設定環境變數
echo    在 Vercel Project Settings 中添加：
echo.
echo    GOOGLE_SPREADSHEET_ID=1w00sTHsHBgZ4I-b_XIrXIBTI54kOP7G-y9jjICcuNgQ
echo.
echo    GOOGLE_CREDENTIALS=^(複製您的完整 Google 憑證 JSON^)
echo.
echo    NEXTAUTH_SECRET=healthcare-scheduling-secret-key-2025-very-long-random-string-for-security-purposes
echo.
echo    NEXTAUTH_URL=https://your-vercel-domain.vercel.app
echo    ^(部署後更新為實際域名^)
echo.

echo 4️⃣  部署完成後
echo    - 取得 Vercel 域名
echo    - 更新 NEXTAUTH_URL 環境變數
echo    - 測試登入：admin/admin123
echo    - 測試 Google Sheets 同步
echo.

echo ✅ Vercel 優勢：
echo    - 免費方案更慷慨
echo    - 對 Next.js 原生支援
echo    - 部署速度極快
echo    - 自動 HTTPS 和 CDN
echo.

echo ⚠️  注意：資料庫會在每次部署時重置（SQLite 限制）
echo    如需持久化資料，可考慮升級到 Vercel KV 或 Postgres
echo.

echo 📖 詳細說明請參考 VERCEL_DEPLOYMENT.md
echo.

echo 🔗 一鍵部署連結已複製，請前往瀏覽器打開：
echo https://vercel.com/new/clone?repository-url=https://github.com/Wolves124/healthcare-scheduling-sheet

pause
