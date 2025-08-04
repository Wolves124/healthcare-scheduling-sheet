# 🎉 Google Sheets 整合設定完成！

## ✅ 憑證已成功設定

您的 Google 服務帳號憑證已經成功設定到系統中：

- **服務帳號**: `sheets-service-account@healthcare-467709.iam.gserviceaccount.com`
- **Private Key ID**: `f06499eaa7a3c0a4a64db2410dcc90bbfc96cb30`
- **Client ID**: `112017500293714277966`

## 🔧 最後一個重要步驟

**請確保您的 Google Sheets 已經與服務帳號共用：**

1. **開啟您的 Google Sheets**：
   https://docs.google.com/spreadsheets/d/1w00sTHsHBgZ4I-b_XIrXIBTI54kOP7G-y9jjICcuNgQ/edit

2. **點擊右上角的「共用」按鈕**

3. **新增服務帳號**：
   - 在「新增人員和群組」欄位中輸入：
     ```
     sheets-service-account@healthcare-467709.iam.gserviceaccount.com
     ```
   - 設定權限為：**編輯者**
   - 點擊「傳送」

## 🚀 測試整合功能

完成共用設定後，您可以立即測試：

1. **前往系統**: http://localhost:3000
2. **登入管理員帳號**: `admin` / `admin123`
3. **前往**: **管理** > **Google Sheets 整合**
4. **點擊**: **同步當月班表**

如果設定正確，您應該會看到成功訊息，並且班表數據會同步到 Google Sheets！

## 🎯 功能說明

現在您可以：
- ✅ **同步班表到 Google Sheets**: 將系統中的班表數據導出到 Google Sheets
- ✅ **查看線上班表**: 在 Google Sheets 中查看格式化的班表
- ✅ **分享班表**: 與團隊成員分享 Google Sheets 連結
- ✅ **即時更新**: 隨時同步最新的班表數據

## 🔄 如果遇到問題

如果同步時出現錯誤：

1. **檢查試算表權限**: 確認服務帳號已添加為編輯者
2. **檢查 API 權限**: 確認 Google Sheets API 已啟用
3. **查看錯誤訊息**: 檢查瀏覽器開發者工具和伺服器日誌

恭喜！您已經完成了完整的 Google Sheets 整合設定！🎊
