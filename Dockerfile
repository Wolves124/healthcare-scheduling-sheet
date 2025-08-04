FROM node:18-alpine

WORKDIR /app

# 安裝依賴所需的系統包
RUN apk add --no-cache libc6-compat

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm ci --only=production

# 複製專案檔案
COPY . .

# 建置應用程式
RUN npm run build

# 創建資料庫目錄
RUN mkdir -p /app/database

# 暴露埠號
EXPOSE 3000

# 設定環境變數
ENV NODE_ENV=production
ENV PORT=3000

# 啟動應用程式
CMD ["npm", "start"]
