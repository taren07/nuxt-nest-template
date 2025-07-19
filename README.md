# Nuxt Nest Template

NestJS + Nuxt.js でのフルスタックCRUDテンプレートアプリケーション

## 🐳 Docker での起動方法

### 開発環境

```bash
# 開発環境を起動
docker-compose -f docker-compose.dev.yml up --build

# バックグラウンドで起動
docker-compose -f docker-compose.dev.yml up -d --build

# 停止
docker-compose -f docker-compose.dev.yml down
```

### 本番環境

```bash
# 本番環境を起動
docker-compose up --build

# バックグラウンドで起動
docker-compose up -d --build

# 停止
docker-compose down
```

## 📝 アクセス先

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:3001
- **PostgreSQL**: localhost:5432

## 🛠️ 技術スタック

### フロントエンド
- Nuxt.js 3
- Vue 3
- Vuetify 3
- Pinia

### バックエンド
- NestJS
- TypeORM
- PostgreSQL
- Jest (テスト)

## 🏗️ プロジェクト構成

```
nuxt-nest-template/
├── frontend (Nuxt.js)
│   ├── pages/
│   ├── components/
│   ├── stores/
│   └── composables/
└── backend/ (NestJS)
    └── src/
        └── user/
            ├── controllers/
            ├── services/
            ├── usecases/
            ├── repositories/
            └── entities/
```

## 🧪 テスト実行

### バックエンドテスト

```bash
# コンテナ内でテスト実行
docker-compose -f docker-compose.dev.yml exec backend npm test

# E2Eテスト
docker-compose -f docker-compose.dev.yml exec backend npm run test:e2e

# カバレッジ付きテスト
docker-compose -f docker-compose.dev.yml exec backend npm run test:coverage
```

## 🚀 ローカル開発（Docker無し）

### セットアップ

```bash
# フロントエンド
npm install

# バックエンド
cd backend
npm install
```

### 開発サーバー起動

```bash
# フロントエンド（ポート3000）
npm run dev

# バックエンド（ポート3001）
cd backend
npm run start:dev
```
