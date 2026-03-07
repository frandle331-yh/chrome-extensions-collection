# Chrome Extensions Collection

Chrome Web Store向けの拡張機能コレクション。開発者・クリエイター・一般ユーザー向けの実用的なツールを提供。

## 拡張機能一覧

### 1. MarkdownCopy
**Webページのテキストをマークダウン形式でコピー**

- テキスト選択 → 右クリック → 「Copy as Markdown」
- 対応: 見出し、太字/斜体、リンク、リスト、コード、テーブル、画像、引用
- ターゲット: Obsidian / Notion / GitHub ユーザー

### 2. PageMeta - OGP & Meta Tag Viewer
**ページのメタ情報をワンクリックで確認**

- Basic Info (title, description, canonical, charset, lang)
- Open Graph (OGP) プレビュー付き
- Twitter Card
- 見出し構造 (h1-h4)
- 全metaタグ一覧
- クリックでコピー対応
- ターゲット: Web開発者 / SEO担当者

### 3. SelectTools - Text Utilities
**右クリックメニューからテキスト変換・解析**

- 文字数カウント / 単語数カウント
- 大文字・小文字変換 (UPPER / lower / Title / camelCase / snake_case / kebab-case)
- Base64 エンコード/デコード
- URL エンコード/デコード
- ハッシュ生成 (MD5, SHA-1, SHA-256)
- JSON整形 / 圧縮
- テキスト反転 / トリム / 重複行削除 / 行ソート
- ターゲット: 開発者 / テクニカルライター

### 4. JSONView - Beautiful JSON Formatter
**JSONレスポンスをブラウザで自動整形**

- ダークテーマのシンタックスハイライト
- 折りたたみ可能なツリービュー
- キー・値の検索機能
- Raw表示切り替え
- ワンクリックコピー
- ターゲット: API開発者 / バックエンドエンジニア

### 5. QuickNote - Notes for Any Page
**URLに紐付いたクイックメモ**

- 任意のWebページにメモを残せる
- 自動保存（300ms debounce）
- 全メモ一覧表示
- Markdown形式でエクスポート
- chrome.storage.local で安全に保存
- ターゲット: リサーチャー / 開発者 / 学生

### 6. RegexPlayground - Live Regex Tester
**リアルタイム正規表現テスター**

- リアルタイムマッチングとハイライト
- キャプチャグループ表示
- フラグ設定 (g, i, m, s)
- チートシート内蔵
- マッチ結果コピー
- ターゲット: 開発者 / データアナリスト

### 7. ColorPeek - Page Color Palette Extractor
**Webページのカラーパレットを抽出**

- ページ内の全色をスキャン・抽出
- HEX / RGB / HSL 形式切り替え
- 使用頻度順にソート
- CSS変数としてコピー
- ワンクリックで個別コピー
- ターゲット: デザイナー / フロントエンド開発者

### 8. ResponsePeek - HTTP Header Viewer
**HTTPレスポンスヘッダーを確認**

- セキュリティヘッダーの診断（スコア表示）
- キャッシュ設定の確認
- 全ヘッダー一覧（ソート済み）
- ステータスコード表示
- ワンクリックコピー
- ターゲット: Web開発者 / セキュリティエンジニア

## 開発

### ローカルで動作確認
1. Chrome で `chrome://extensions` を開く
2. 「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」で各フォルダを選択

### Chrome Web Store への公開
1. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) にアクセス
2. 初回は$5の登録料が必要
3. ZIPファイルにパッケージして提出
4. 審査は通常数日

### アイコンについて
各拡張機能の `manifest.json` の `icons` フィールドにアイコンを設定する必要があります。
必要サイズ: 16x16, 32x32, 48x48, 128x128 (PNG形式)

## ビジネスモデル

- **Freemium**: 基本機能は無料、プレミアム機能は有料
- **決済**: ExtensionPay または Stripe連携
- **目標**: 月$20以上の収益（Claude サブスクリプション費用をカバー）

## 技術スタック

- Manifest V3 (Chrome拡張の最新仕様)
- Vanilla JavaScript (フレームワーク不使用で軽量化)
- Chrome APIs: contextMenus, activeTab, scripting, tabs, storage, webRequest
