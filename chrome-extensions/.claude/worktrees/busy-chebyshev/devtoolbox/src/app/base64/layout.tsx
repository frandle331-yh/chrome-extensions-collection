import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 エンコード/デコード - オンラインBase64変換ツール",
  description:
    "無料のオンラインBase64変換ツール。テキストをBase64にエンコード、Base64文字列をデコード。UTF-8対応。データは外部に送信されません。",
  keywords: ["Base64 エンコード", "Base64 デコード", "Base64 変換", "オンライン Base64"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
