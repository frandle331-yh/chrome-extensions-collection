import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QRコード作成ツール - テキスト・URLからQRコードを生成",
  description:
    "無料のオンラインQRコード作成ツール。テキストやURLからQRコードを生成し、PNGでダウンロード可能。サイズ変更対応。",
  keywords: ["QRコード 作成", "QRコード 生成", "QRコード 無料", "QRコード ジェネレーター"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
