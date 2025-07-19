# フロントエンド用 Dockerfile
FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci --only=production

# アプリケーションのソースコードをコピー
COPY . .

# Nuxtアプリケーションをビルド
RUN npm run build

# ポート3000を公開
EXPOSE 3000

# アプリケーションを開始
CMD ["npm", "run", "preview"]