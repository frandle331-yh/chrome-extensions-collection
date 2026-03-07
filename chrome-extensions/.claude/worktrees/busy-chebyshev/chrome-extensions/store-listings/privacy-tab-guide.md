# Chrome Web Store「プライバシーへの取り組み」タブ 記入ガイド

各拡張機能ごとにコピペ用の記入内容をまとめています。

---

## 共通回答（全8拡張機能で同じ）

### リモートコードの使用
> **「いいえ」を選択**
>
> すべての拡張機能はリモートコードを使用しません。すべてのコードはパッケージ内にバンドルされています。

### データ使用ポリシーへの準拠（チェックボックス）
> 以下すべてにチェック：
> - ユーザーデータの販売をしない
> - 本来の目的とは無関係な目的でのユーザーデータの使用や転送をしない
> - 信用力の判定や融資目的でのユーザーデータの使用や転送をしない

---

## 1. Color Peek

### 単一用途の説明（Single Purpose）
```
Extract and display all colors (HEX, RGB, HSL) used on the current webpage with one-click copy.
```

### activeTab の権限理由
```
activeTab is required to access the current webpage's DOM and extract all CSS color values (background colors, text colors, border colors, etc.) when the user clicks the extension icon. No data is accessed without user action.
```

### scripting の権限理由
```
The scripting permission is required to programmatically inject a content script into the active tab that scans the page's computed styles and extracts all color values. This runs only when the user explicitly clicks the extension icon.
```

---

## 2. JSON View

### 単一用途の説明（Single Purpose）
```
Automatically detect and format JSON responses in the browser with syntax highlighting, collapsible tree view, and search.
```

### activeTab の権限理由
```
activeTab is required to detect whether the current page contains a JSON response and to format it with syntax highlighting and a collapsible tree view.
```

### host_permissions / content_scripts 理由（<all_urls>）
```
Content scripts run on all URLs to automatically detect JSON responses and format them. This is necessary because JSON responses can come from any domain, and the extension needs to check the page content type to determine if formatting should be applied.
```

---

## 3. Markdown Copy

### 単一用途の説明（Single Purpose）
```
Copy selected webpage content as clean Markdown format, preserving headings, links, lists, and tables.
```

### activeTab の権限理由
```
activeTab is required to read the user's text selection on the current webpage and convert the selected HTML content into Markdown format when the user triggers the copy action via right-click context menu.
```

### contextMenus の権限理由
```
contextMenus is required to add a "Copy as Markdown" option to the right-click context menu, allowing users to quickly copy selected content as Markdown.
```

---

## 4. Page Meta

### 単一用途の説明（Single Purpose）
```
Display OGP tags, meta tags, heading structure, and page information for the current webpage.
```

### activeTab の権限理由
```
activeTab is required to read the current webpage's meta tags, Open Graph Protocol (OGP) tags, and heading structure (H1-H6) when the user clicks the extension icon. No data is collected or transmitted.
```

---

## 5. Quick Note

### 単一用途の説明（Single Purpose）
```
Take quick notes linked to the current webpage URL, with automatic saving and restoration on revisit.
```

### activeTab の権限理由
```
activeTab is required to get the current page's URL so that notes can be associated with and automatically restored for that specific webpage.
```

### storage の権限理由
```
The storage permission is required to save user's notes locally in Chrome's storage so they persist across browser sessions and are restored when the user revisits the same page.
```

---

## 6. Regex Playground

### 単一用途の説明（Single Purpose）
```
Test regular expressions in real-time with live pattern matching, capture group highlighting, and a built-in cheat sheet.
```

### 権限理由
> **権限なし** — この拡張機能は権限を一切要求しません。
> フォームに権限理由の入力欄が表示されなければ記入不要です。

---

## 7. Response Peek

### 単一用途の説明（Single Purpose）
```
View HTTP response headers, security headers, caching information, and server details for the current webpage.
```

### activeTab の権限理由
```
activeTab is required to identify the current tab's URL and display the corresponding HTTP response headers to the user when they click the extension icon.
```

### scripting の権限理由
```
The scripting permission is required to inject a script that collects page-level network information from the active tab to complement the response header data shown to the user.
```

### webRequest の権限理由
```
The webRequest permission is required to intercept and read HTTP response headers (such as Content-Type, Cache-Control, CSP, HSTS, X-Frame-Options) for the pages the user visits. This is the core functionality of the extension.
```

### host_permissions (<all_urls>) の理由
```
Host permissions for all URLs are required because the extension needs to read HTTP response headers from any website the user visits. Response headers vary by domain and cannot be accessed without this permission. No data is collected, stored, or transmitted — headers are only displayed to the user in the extension popup.
```

---

## 8. Select Tools

### 単一用途の説明（Single Purpose）
```
Right-click selected text to count characters, convert case, encode/decode Base64 and URLs, and generate hashes.
```

### activeTab の権限理由
```
activeTab is required to read the user's selected text on the current webpage when the user triggers a text utility action via the right-click context menu.
```

### contextMenus の権限理由
```
contextMenus is required to add text utility options (character count, case conversion, Base64 encode/decode, URL encode/decode, hash generation) to the right-click context menu for quick access.
```

---

## 連絡先メールアドレス

> ⚠️ **「アカウント」タブで設定が必要です**
> Chrome Web Store Developer Dashboard の「アカウント」タブで連絡先メールアドレスを入力・確認してください。
> これは拡張機能ごとではなく、アカウント全体で1回の設定です。
