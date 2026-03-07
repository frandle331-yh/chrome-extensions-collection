import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "カラー変換ツール - HEX・RGB・HSL相互変換",
  description:
    "無料のオンラインカラー変換ツール。HEX、RGB、HSLの相互変換がリアルタイムで可能。カラーピッカー付き。",
  keywords: ["カラー 変換", "HEX RGB 変換", "RGB HSL 変換", "カラーコード 変換", "色 変換"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
