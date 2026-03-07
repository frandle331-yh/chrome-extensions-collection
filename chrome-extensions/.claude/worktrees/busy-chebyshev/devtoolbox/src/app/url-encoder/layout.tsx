import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URLエンコード/デコード - オンラインURL変換ツール",
  description:
    "無料のオンラインURLエンコード・デコードツール。URLコンポーネントやURI全体のパーセントエンコーディングを変換。",
  keywords: ["URL エンコード", "URL デコード", "パーセントエンコーディング", "URL 変換", "オンライン URL"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
