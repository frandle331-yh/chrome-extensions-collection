# chrome-dev

Chrome拡張開発部門。AIエージェントによる自律開発プラットフォーム。

## 現状

Chrome拡張コレクション（10拡張）の開発・マネタイゼーション。
CLAUDE.mdによるエージェント統治、Stepサイクルによる開発フロー、エージェント間連携（escalation）を運用中。

| 拡張 | 種別 | 状況 | 備考 |
|---|---|---|---|
| JSONView | Free | v1.0.0 審査中 | JSON自動整形 |
| ResponsePeek | Free | v1.0.0 審査中 | HTTPヘッダー表示 |
| ColorPeek | Free | v1.0.0 審査中 | カラーパレット抽出 |
| PageMeta | Free | v1.0.0 審査中 | OGP・メタタグ表示 |
| MarkdownCopy | Free | v1.0.0 審査中 | Markdown変換コピー |
| QuickNote | Free | v1.0.0 審査中 | URL紐付けメモ |
| RegexPlayground | Free | v1.0.0 審査中 | 正規表現テスター |
| SelectTools | Free | v1.0.0 審査中 | 右クリックテキスト変換 |
| EnvSwitch | Freemium | v1.0.0 審査中 | 環境切り替え（ExtPay） |
| SnapDiff | Freemium | v1.0.0 審査中 | ビジュアル差分（ExtPay） |

## ディレクトリ構成

```
chrome-dev/
├── CLAUDE.md              ← 全拡張共通ルール（250行上限）
├── README.md              ← このファイル
├── build-zips.ps1         ← ZIP生成スクリプト
├── docs/                  ← GitHub Pages（LP・特定商取引法・プライバシーポリシー）
├── {extension}/
│   ├── PROGRESS.md        ← 現状・ファイル構成・Web Storeステータス
│   ├── SPEC.md            ← 未実装の仕様のみ
│   ├── archive/           ← 完了済みStep（参照用）
│   └── src/               ← 拡張ソースコード（ZIP・Load Unpacked対象）
```

## 汎用化の位置付け

本ディレクトリはL2（部門管理）+L1（開発実行）統合環境。roblox-devと同じ設計思想を継承。

| CLAUDE.md セクション | 内容 | 汎用性 |
|---|---|---|
| 1. コード構造 | 300行上限、目次、区切り | 完全に汎用 |
| 2. 共通化 | 2回で関数化、水平展開 | 完全に汎用 |
| 3. Chrome固有 | Manifest V3、権限最小化、CSP | Chrome固有 |
| 4. パフォーマンス | content script軽量化、storage | Chrome固有 |
| 5. UI設計 | popup制約、CSS分離 | 一部Chrome固有 |
| 6. プロジェクト構成 | src/配下がsource of truth | ほぼ汎用 |
| 7. 開発フロー | Stepサイクル、テスト→承認 | 完全に汎用 |
| 8. git運用 | コミットタイミング | 完全に汎用 |
| 9. ドキュメント管理 | SPEC/PROGRESS同期 | 完全に汎用 |
| 10. エージェント間連携 | escalation、役割分離 | 完全に汎用 |

## 技術スタック

- **Manifest V3** — Chrome拡張の最新仕様
- **Vanilla JavaScript** — フレームワーク不使用で軽量
- **Chrome APIs** — contextMenus, activeTab, scripting, storage, webRequest, declarativeNetRequest
- **ExtensionPay** — フリーミアム決済（Stripe連携）
- **GitHub Pages** — LP・法的ページ配信
