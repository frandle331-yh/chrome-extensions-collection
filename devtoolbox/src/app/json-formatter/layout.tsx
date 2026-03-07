import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON整形・検証ツール - オンラインでJSONを整形・圧縮・検証",
  description:
    "無料のオンラインJSON整形ツール。JSONデータの整形（フォーマット）、圧縮（ミニファイ）、検証（バリデーション）がワンクリックで可能。データは外部に送信されません。",
  keywords: ["JSON 整形", "JSON フォーマット", "JSON 検証", "JSON 圧縮", "JSON バリデーション", "オンライン JSON"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
