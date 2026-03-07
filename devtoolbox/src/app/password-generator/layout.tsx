import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "パスワード生成ツール - 安全なランダムパスワードを作成",
  description:
    "無料のオンラインパスワード生成ツール。暗号学的に安全なランダムパスワードを生成。文字数や文字種を自由にカスタマイズ可能。",
  keywords: ["パスワード 生成", "パスワード 作成", "ランダム パスワード", "強力 パスワード", "パスワード ジェネレーター"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
