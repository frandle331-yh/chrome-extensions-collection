# JSONView - PROGRESS

## Status

| Step | 内容 | ステータス |
|------|------|-----------|
| — | 初期実装完了（v1.0.0リリース済み） | DONE |

## Current Files

| ファイル | 行数 | 説明 |
|---------|------|------|
| src/manifest.json | 19 | Manifest V3, permissions: なし, content_scripts: all_urls |
| src/content.js | 253 | JSON検出・整形・ハイライト |
| src/popup.html | 34 | ポップアップUI |

## Web Store Status

- **提出日**: 2026-03 (審査中)
- **審査結果**: 初回リジェクト（未使用activeTab権限）→ 権限削除済み → 再提出待ち

## Completed Steps Summary

- v1.0.0: JSON自動検出、シンタックスハイライト、折り畳み、検索、コピー

## Known Issues

- なし
