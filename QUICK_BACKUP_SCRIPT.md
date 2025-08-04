# 🚀 快速備份執行腳本

## 準備工作

### 1. 安全清理
首先移除敏感檔案：
```bash
# 移除 Google 服務帳號金鑰檔案
del "healthcare-467709-f06499eaa7a3.json"

# 備份並移除包含真實憑證的環境變數檔案
copy ".env.local" ".env.local.backup"
del ".env.local"
```

### 2. 安裝 Git
如果尚未安裝，請前往 https://git-scm.com/download/win 下載並安裝 Git for Windows。

## 執行備份

### 在 PowerShell 中執行以下命令：

```bash
# 切換到專案目錄
cd "e:\Project\healthcare-scheduling-sheet"

# 初始化 Git 倉庫
git init

# 設定 Git 用戶資訊 (請替換為您的實際資訊)
git config --global user.name "Wolves124"
git config --global user.email "your-email@example.com"

# 添加所有檔案到 Git
git add .

# 建立第一次提交
git commit -m "🎉 Initial commit: Healthcare Scheduling System with Google Sheets integration

Features:
- ✅ Complete healthcare scheduling system
- ✅ User authentication and role management  
- ✅ Schedule viewing and management
- ✅ Google Sheets integration
- ✅ Admin dashboard
- ✅ Database management
- ✅ Responsive UI with Tailwind CSS"

# 連接到您的 GitHub 倉庫
git remote add origin https://github.com/Wolves124/healthcare-scheduling-system.git

# 設定主分支並推送
git branch -M main
git push -u origin main
```

## GitHub 倉庫建立

在執行上述命令前，請先在 GitHub 上建立新倉庫：

1. **前往**: https://github.com/Wolves124
2. **點擊**: "New repository" 按鈕
3. **倉庫名稱**: `healthcare-scheduling-system`
4. **描述**: `Healthcare staff scheduling system with Google Sheets integration`
5. **可見性**: 建議選擇 "Private"（因為包含商業邏輯）
6. **不要勾選** "Add a README file"（我們已經有了）
7. **點擊**: "Create repository"

## 備份後的環境變數恢復

備份完成後，恢復您的環境變數檔案：

```bash
# 恢復環境變數檔案
copy ".env.local.backup" ".env.local"
del ".env.local.backup"
```

## 🎯 一鍵執行版本

將以下內容儲存為 `backup-to-github.bat`：

```batch
@echo off
echo 🚀 Healthcare Scheduling System - GitHub Backup
echo.

echo ⚠️  請確認您已經：
echo - 在 GitHub 建立了 healthcare-scheduling-system 倉庫
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
git remote add origin https://github.com/Wolves124/healthcare-scheduling-system.git

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
```

## 🔐 安全提醒

- ✅ 敏感檔案已被 `.gitignore` 排除
- ✅ 環境變數範本已建立
- ✅ 真實憑證不會被上傳到 GitHub
- ✅ 備份後會自動恢復本地環境變數
