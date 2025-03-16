# LeadAgent - 営業リスト処理システム

## 概要

LeadAgent は、営業リストを効率的に処理し、AI を活用して営業文面を自動生成するシステムです。Excel やスプレッドシートの営業リストをアップロードすると、データを構造化し、各企業に合わせた営業文面を生成します。

## 主な機能

- **ファイルアップロード**: Excel/CSV 形式の営業リストをアップロード
- **データ構造化**: カラム名の自動認識と正規化
- **AI 営業文面生成**: 企業情報に基づいた営業文面の自動生成
- **リアルタイム処理**: Server-Sent Events (SSE)によるリアルタイム更新
- **データエクスポート**: 処理結果を CSV/Excel 形式でエクスポート

## スクリーンショット

（スクリーンショットを追加）

## 技術スタック

### バックエンド

- **FastAPI**: 高速な API フレームワーク
- **Pandas**: データ処理ライブラリ
- **Google Gemini API**: AI 文章生成

### フロントエンド

- **Next.js**: React フレームワーク
- **TypeScript**: 型安全な開発
- **TanStack Table**: データテーブル管理
- **Shadcn UI**: モダン UI コンポーネント

## セットアップ

### 前提条件

- Python 3.9+
- Node.js 16+
- npm または yarn

### バックエンドのセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/mugu1108/Lead.git
cd Lead/Back

# 仮想環境を作成（オプション）
python -m venv venv
source venv/bin/activate  # Linuxの場合
# または
venv\Scripts\activate  # Windowsの場合

# 依存パッケージのインストール
pip install -r requirements.txt

# .envファイルの作成
# 以下の内容を.envファイルに追加
# GEMINI_API_KEY=your_api_key_here
# ENVIRONMENT=development

# サーバーの起動
uvicorn app.main:app --reload
```

### フロントエンドのセットアップ

```bash
# フロントエンドディレクトリに移動
cd ../Front

# 依存パッケージのインストール
npm install
# または
yarn install

#
npm install next react react-dom

# .env.localファイルの作成
# 以下の内容を.env.localファイルに追加
# NEXT_PUBLIC_API_URL=http://localhost:8000

# 開発サーバーの起動
npm run dev
# または
yarn dev
```

## 使用方法

1. ブラウザで http://localhost:3000 にアクセス
2. 「ファイルをアップロード」ボタンをクリックするか、ファイルをドラッグ＆ドロップ
3. アップロードが完了すると、データが表形式で表示される
4. 「営業文面生成」ボタンをクリックすると、AI が各企業に合わせた営業文面を生成
5. 「エクスポート」ボタンで処理結果をダウンロード可能

## システム構成

### ディレクトリ構造

```
LeadAgent/
├── Back/                      # バックエンド（FastAPI）
│   ├── app/
│   │   ├── main.py            # メインアプリケーション
│   │   ├── config.py          # 設定ファイル
│   │   ├── routers/           # APIルーター
│   │   └── services/          # ビジネスロジック
│   ├── uploads/               # アップロードファイル保存ディレクトリ
│   ├── requirements.txt       # 依存パッケージリスト
│   └── .env                   # 環境変数設定
└── Front/                     # フロントエンド（Next.js）
    ├── components/            # UIコンポーネント
    ├── app/                   # ページコンポーネント
    └── .env.local             # フロントエンド環境変数
```

### API 仕様

#### ファイルアップロード

- **エンドポイント**: `/api/upload`
- **メソッド**: POST
- **Content-Type**: multipart/form-data

#### ファイル処理

- **エンドポイント**: `/api/process`
- **メソッド**: POST
- **Content-Type**: application/json

#### 営業文面生成

- **エンドポイント**: `/api/sales-text-stream`
- **メソッド**: GET
- **Content-Type**: text/event-stream

#### データエクスポート

- **エンドポイント**: `/api/export`
- **メソッド**: GET
- **クエリパラメータ**: format=csv|excel

## 依存関係

### バックエンド

```
fastapi==0.95.1
uvicorn==0.22.0
pydantic==2.3.0
pydantic-settings==2.0.3
pandas==2.0.1
openpyxl==3.1.2
python-multipart==0.0.6
aiofiles==23.2.1
python-dotenv==1.0.0
google-generativeai==0.3.1
```

### フロントエンド

- Next.js
- React
- TanStack Table
- Shadcn UI
- Lucide Icons

## 今後の開発予定

- データベース連携
- ユーザー認証
- 高度なデータ処理機能
- UI/UX の改善
- エラーハンドリングの強化
- テストの充実

## ライセンス

MIT

## 貢献

プルリクエストやイシューの報告は大歓迎です。大きな変更を加える前には、まずイシューを開いて議論してください。
