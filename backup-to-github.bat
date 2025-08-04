@echo off
echo 🚀 Healthcare Scheduling System - GitHub Backup
echo.

echo ⚠️  請確認您已經：
echo - 在 GitHub 建立了 healthcare-scheduling-new 倉庫
echo - 安裝了 Git for Windows
echo.
pause

cd /d "e:\Project\healthcare-scheduling-sheet"

echo 🧹 清理敏感檔案...
if exist "healthcare-467709-f06499eaa7a3.json" del "healthcare-467709-f06499eaa7a3.json"
if exist ".env.local" (
    copy ".env.local" ".env.local.backup" >nul
    del ".env.local"
)

echo 📦 初始化 Git 倉庫...
git init

echo ⚙️  設定 Git 配置...
git config --global user.name "Wolves124"
set /p email="請輸入您的 Email: "
git config --global user.email %email%

echo 📁 添加檔案...
git add .

echo 💾 建立提交...
git commit -m "🎉 Initial commit: Healthcare Scheduling System with Google Sheets integration"

echo 🔗 連接到 GitHub...
git remote add origin https://github.com/Wolves124/healthcare-scheduling-new.git

echo 🚀 推送到 GitHub...
git branch -M main
git push -u origin main

echo ✅ 備份完成！

echo 🔄 恢復環境變數...
if exist ".env.local.backup" (
    copy ".env.local.backup" ".env.local" >nul
    del ".env.local.backup"
)

echo.
echo 🎉 備份成功完成！
echo 📂 GitHub 倉庫: https://github.com/Wolves124/healthcare-scheduling-system
pause
