# EnvSwitch - PROGRESS

## Status

| Step | 内容 | ステータス |
|------|------|-----------|
| — | 初期実装完了（v1.0.0リリース済み） | DONE |

## Current Files

| ファイル | 行数 | 説明 |
|---------|------|------|
| src/manifest.json | 41 | Manifest V3, permissions: activeTab, storage, declarativeNetRequest, tabs + ExtPay |
| src/background.js | 123 | Service Worker（環境切り替えルール管理・ExtPay） |
| src/popup.html | 82 | ポップアップUI |
| src/popup.css | 67 | スタイル |
| src/popup.js | 364 | 環境設定管理・URL書き換え・ヘッダー挿入 |
| src/icons/ | — | icon16, icon48, icon128 |
| src/ExtPay.js | — | ExtensionPay決済ライブラリ（gitignore対象） |

## Web Store Status

- **提出日**: 2026-03 (審査中)

## Completed Steps Summary

- v1.0.0: 環境切り替え、URLリライト、ヘッダーインジェクション
- フリーミアム: ExtPay統合済み（$9.99 / $2.99/mo）

## Known Issues

- **popup.jsが364行（300行上限超過）** — 次回機能追加前にリファクタリング必須
