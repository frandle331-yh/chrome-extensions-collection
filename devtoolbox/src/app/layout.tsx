import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DevToolBox - 無料オンライン開発者ツール",
    template: "%s | DevToolBox",
  },
  description:
    "完全無料のオンライン開発者ツール集。JSON整形、Base64変換、パスワード生成、QRコード作成、カラー変換、ハッシュ生成など。すべてブラウザ上で動作し、データは一切外部に送信されません。",
  keywords: [
    "開発者ツール",
    "JSON 整形",
    "Base64 変換",
    "パスワード生成",
    "QRコード 作成",
    "カラー変換",
    "ハッシュ生成",
    "URL エンコード",
    "オンラインツール",
    "無料ツール",
  ],
  openGraph: {
    title: "DevToolBox - 無料オンライン開発者ツール",
    description:
      "完全無料の開発者ツール集。登録不要・ブラウザ完結・データ送信なし。",
    type: "website",
  },
};

const tools = [
  { name: "JSON整形", href: "/json-formatter" },
  { name: "Base64", href: "/base64" },
  { name: "パスワード", href: "/password-generator" },
  { name: "QRコード", href: "/qr-code" },
  { name: "カラー変換", href: "/color-converter" },
  { name: "ハッシュ", href: "/hash-generator" },
  { name: "URLエンコード", href: "/url-encoder" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <header className="sticky top-0 z-50 border-b border-card-border bg-card/80 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between">
              <Link
                href="/"
                className="text-xl font-bold tracking-tight text-primary"
              >
                DevToolBox
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                {tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="rounded-md px-3 py-1.5 text-sm text-muted hover:bg-accent-bg hover:text-foreground transition-colors"
                  >
                    {tool.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-center rounded-lg border border-dashed border-card-border bg-card p-4 text-sm text-muted">
            広告スペース - Google AdSense
          </div>
        </div>

        <footer className="border-t border-card-border bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted">
                &copy; {new Date().getFullYear()} DevToolBox.
                すべてのツールは無料でご利用いただけます。
              </p>
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  ツール一覧
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
