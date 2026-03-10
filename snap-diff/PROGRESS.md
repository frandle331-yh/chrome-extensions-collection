# SnapDiff - PROGRESS

## Status

| Step | 内容 | ステータス |
|------|------|-----------|
| — | 初期実装完了（v1.0.0リリース済み） | DONE |

## Current Files

| ファイル | 行数 | 説明 |
|---------|------|------|
| src/manifest.json | 36 | Manifest V3, permissions: activeTab, storage + ExtPay |
| src/background.js | 6 | Service Worker（ExtPay初期化） |
| src/popup.html | 43 | ポップアップUI |
| src/popup.css | 43 | スタイル |
| src/popup.js | 303 | スクリーンショット撮影・比較・ピクセル差分 |
| src/icons/ | — | icon16, icon48, icon128 |
| src/ExtPay.js | — | ExtensionPay決済ライブラリ（gitignore対象） |

## Web Store Status

- **提出日**: 2026-03 (審査中)
- **審査結果**: tabs権限を予防的に削除済み

## Completed Steps Summary

- v1.0.0: スクリーンショット撮影、画像比較、ピクセルレベル差分、ハイライト表示
- フリーミアム: ExtPay統合済み（$6.99 / $1.99/mo）

## Known Issues

- popup.jsが303行（300行上限ギリギリ、機能追加時は分割を検討）
