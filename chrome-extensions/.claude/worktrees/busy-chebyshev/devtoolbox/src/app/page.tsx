import Link from "next/link";

const tools = [
  {
    name: "JSON整形・検証",
    description: "JSONデータの整形、圧縮、バリデーションをワンクリックで。",
    href: "/json-formatter",
    icon: "{ }",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    name: "Base64 エンコード/デコード",
    description: "テキストをBase64に変換、またはBase64から元のテキストに復元。UTF-8対応。",
    href: "/base64",
    icon: "B64",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    name: "パスワード生成",
    description: "暗号学的に安全なランダムパスワードを生成。長さや文字種を自由にカスタマイズ。",
    href: "/password-generator",
    icon: "***",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  {
    name: "QRコード作成",
    description: "テキストやURLからQRコードを生成。PNGでダウンロード可能。",
    href: "/qr-code",
    icon: "QR",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    name: "カラー変換",
    description: "HEX・RGB・HSLの相互変換。カラーピッカーで直感的に操作。",
    href: "/color-converter",
    icon: "#C",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  },
  {
    name: "ハッシュ生成",
    description: "SHA-1、SHA-256、SHA-384、SHA-512のハッシュ値を一括生成。",
    href: "/hash-generator",
    icon: "#H",
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  },
  {
    name: "URLエンコード/デコード",
    description: "URLコンポーネントやクエリ文字列のエンコード・デコード。",
    href: "/url-encoder",
    icon: "%U",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          無料の<span className="text-primary">開発者ツール</span>
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          高速・無料・プライベート。すべてのツールはブラウザ上で動作し、
          データが外部に送信されることは一切ありません。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-xl border border-card-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
          >
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-lg font-mono text-sm font-bold mb-4 ${tool.color}`}
            >
              {tool.icon}
            </div>
            <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
              {tool.name}
            </h2>
            <p className="text-sm text-muted">{tool.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent-bg px-4 py-2 text-sm text-primary">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          100%クライアント処理 — データがサーバーに送られることはありません
        </div>
      </div>
    </div>
  );
}
