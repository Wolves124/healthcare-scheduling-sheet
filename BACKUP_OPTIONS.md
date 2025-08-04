# 🎯 立即備份選項

由於您的系統目前沒有安裝 Git，這裡提供兩個備份選項：

## 選項 1: 安裝 Git 後使用 GitHub （推薦）

### 1. 安裝 Git
1. 前往 https://git-scm.com/download/win
2. 下載並安裝 Git for Windows
3. 安裝完成後重新啟動 PowerShell

### 2. 執行備份
安裝 Git 後，按照 `GITHUB_BACKUP_GUIDE.md` 的步驟進行備份。

## 選項 2: 手動壓縮備份 （立即可用）

如果您希望立即備份，可以使用以下步驟：

### 1. 清理敏感檔案
在壓縮前，請先刪除或移動這些敏感檔案：
- `healthcare-467709-f06499eaa7a3.json`
- `.env.local`

### 2. 手動壓縮專案
1. 在檔案總管中前往 `e:\Project\`
2. 右鍵點擊 `healthcare-scheduling-sheet` 資料夾
3. 選擇「傳送到」→「壓縮的資料夾」
4. 重新命名為：`healthcare-scheduling-system-backup-20250803.zip`

### 3. 雲端備份選項
將壓縮檔案上傳到：
- Google Drive
- OneDrive  
- Dropbox
- 或其他雲端儲存服務

## 🔐 備份前的安全檢查清單

請在備份前確認以下項目：

- [ ] 已移除 `healthcare-467709-f06499eaa7a3.json` 檔案
- [ ] 已移除 `.env.local` 檔案
- [ ] 保留 `.env.example` 檔案作為範本
- [ ] 檢查沒有其他敏感資訊

## 📋 備份後的部署說明

### 重新部署時需要：
1. 重新建立 `.env.local` 檔案
2. 從備份的 Google 服務帳號金鑰重新設定憑證
3. 執行 `npm install` 安裝依賴
4. 執行 `npm run dev` 啟動系統

### 記住的重要資訊：
- **Google Sheets ID**: `1w00sTHsHBgZ4I-b_XIrXIBTI54kOP7G-y9jjICcuNgQ`
- **服務帳號**: `sheets-service-account@healthcare-467709.iam.gserviceaccount.com`
- **管理員帳號**: `admin` / `admin123`

## 🚀 推薦的完整解決方案

為了最佳的版本控制和協作體驗，建議：

1. **安裝 Git** 並使用 GitHub 進行版本控制
2. **設定自動化 CI/CD** 管道
3. **使用環境變數管理** 敏感配置
4. **設定定期備份** 排程

這樣可以確保：
- ✅ 版本歷史完整保存
- ✅ 安全的敏感資訊管理
- ✅ 團隊協作支援
- ✅ 自動化部署
