import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ハッシュ生成ツール - SHA-256, SHA-512, SHA-1 ハッシュ値を生成",
  description:
    "無料のオンラインハッシュ生成ツール。テキストからSHA-1、SHA-256、SHA-384、SHA-512のハッシュ値を一括生成。Web Crypto API使用。",
  keywords: ["ハッシュ 生成", "SHA-256 ハッシュ", "SHA-512 ハッシュ", "ハッシュ値 計算", "オンライン ハッシュ"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
