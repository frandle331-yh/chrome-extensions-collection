"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

type Template = {
  title: string;
  category: string;
  prompt: string;
  description: string;
};

const TEMPLATES: Template[] = [
  // プログラミング
  {
    title: "コードレビュー",
    category: "プログラミング",
    description: "コードの品質改善点を指摘してもらう",
    prompt: `以下のコードをレビューしてください。以下の観点で改善点を指摘してください：

1. バグの可能性
2. パフォーマンスの問題
3. セキュリティの懸念
4. 可読性・保守性の改善
5. ベストプラクティスに沿っているか

コード：
\`\`\`
（ここにコードを貼り付け）
\`\`\``,
  },
  {
    title: "エラー解析",
    category: "プログラミング",
    description: "エラーメッセージの原因と解決策を分析",
    prompt: `以下のエラーが発生しました。原因と解決策を教えてください。

【使用言語/フレームワーク】：（ここに記入）
【やろうとしていたこと】：（ここに記入）
【エラーメッセージ】：
\`\`\`
（ここにエラーメッセージを貼り付け）
\`\`\`

以下の形式で回答してください：
1. エラーの原因
2. 解決策（コード例つき）
3. 再発防止のためのアドバイス`,
  },
  {
    title: "テストコード生成",
    category: "プログラミング",
    description: "関数やクラスのユニットテストを自動生成",
    prompt: `以下のコードに対するユニットテストを書いてください。

【テストフレームワーク】：（例：Jest, pytest, RSpec）
【テスト対象のコード】：
\`\`\`
（ここにコードを貼り付け）
\`\`\`

以下のケースをカバーしてください：
- 正常系（期待通りの入力）
- 境界値
- 異常系（不正な入力）
- エッジケース`,
  },
  {
    title: "API設計",
    category: "プログラミング",
    description: "REST APIのエンドポイント設計を支援",
    prompt: `以下の要件に基づいてREST APIを設計してください。

【サービス概要】：（ここに記入）
【必要な機能】：
1. （機能1）
2. （機能2）
3. （機能3）

以下を含めて設計してください：
- エンドポイント一覧（メソッド、パス、説明）
- リクエスト/レスポンスのJSON例
- ステータスコード
- 認証方式の提案`,
  },
  // ライティング
  {
    title: "ブログ記事の構成作成",
    category: "ライティング",
    description: "SEOを意識したブログ記事の見出し構成を作成",
    prompt: `以下のテーマでSEOに強いブログ記事の構成（アウトライン）を作成してください。

【テーマ/キーワード】：（ここに記入）
【ターゲット読者】：（ここに記入）
【記事の目的】：（情報提供/問題解決/比較レビュー 等）

以下を含めてください：
- タイトル案（3つ）
- メタディスクリプション
- H2/H3の見出し構成
- 各セクションで書くべきポイント
- 想定文字数`,
  },
  {
    title: "メール文面作成",
    category: "ライティング",
    description: "ビジネスメールの文面を作成",
    prompt: `以下の内容でビジネスメールの文面を作成してください。

【宛先】：（社内/社外、役職等）
【目的】：（依頼/報告/お詫び/お礼 等）
【伝えたい内容】：（ここに記入）
【トーン】：（フォーマル/カジュアル）

件名と本文を作成してください。`,
  },
  // ビジネス
  {
    title: "SWOT分析",
    category: "ビジネス",
    description: "事業やプロジェクトのSWOT分析を作成",
    prompt: `以下の事業/プロジェクトについてSWOT分析を行ってください。

【事業/プロジェクト概要】：（ここに記入）
【業界】：（ここに記入）
【現在の状況】：（ここに記入）

以下の4つの観点で分析してください：
- Strengths（強み）：3〜5項目
- Weaknesses（弱み）：3〜5項目
- Opportunities（機会）：3〜5項目
- Threats（脅威）：3〜5項目

最後に、この分析に基づく戦略提案も含めてください。`,
  },
  {
    title: "プレゼン資料の構成",
    category: "ビジネス",
    description: "説得力のあるプレゼン資料のスライド構成を作成",
    prompt: `以下の内容でプレゼン資料の構成を作成してください。

【プレゼンのテーマ】：（ここに記入）
【対象者】：（経営層/チームメンバー/クライアント 等）
【プレゼン時間】：（ここに記入）分
【ゴール】：（承認を得る/情報共有/提案 等）

各スライドについて以下を提案してください：
- スライドタイトル
- 記載すべきポイント（箇条書き）
- 推奨するビジュアル（グラフ/図/画像 等）`,
  },
  // 学習
  {
    title: "概念の解説",
    category: "学習",
    description: "難しい概念を段階的にわかりやすく解説",
    prompt: `「（ここにトピックを入力）」について、初心者にもわかるように解説してください。

以下の構成でお願いします：
1. 一言で言うと何か（30文字以内）
2. もう少し詳しい説明（100文字程度）
3. 具体例を使った解説
4. よくある誤解
5. さらに学ぶためのキーワード`,
  },
  {
    title: "面接対策",
    category: "学習",
    description: "想定質問と模範回答を生成",
    prompt: `以下のポジションの面接対策をしてください。

【応募ポジション】：（ここに記入）
【業界】：（ここに記入）
【経験年数】：（ここに記入）

以下を作成してください：
1. よく聞かれる質問 10個
2. 各質問に対する回答のポイント
3. 逆質問の例 5個
4. 面接で気をつけるべきポイント`,
  },
];

const CATEGORIES = [...new Set(TEMPLATES.map((t) => t.category))];

export default function PromptTemplates() {
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [copied, setCopied] = useState("");
  const [search, setSearch] = useState("");

  const filtered = TEMPLATES.filter((t) => {
    const matchCategory = selectedCategory === "すべて" || t.category === selectedCategory;
    const matchSearch = !search || t.title.includes(search) || t.description.includes(search);
    return matchCategory && matchSearch;
  });

  const copy = async (prompt: string, title: string) => {
    await navigator.clipboard.writeText(prompt);
    setCopied(title);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <ToolLayout
      title="AIプロンプトテンプレート集"
      description="ChatGPT・Claude・Geminiで使える実用的なプロンプトテンプレート。コピペですぐ使えます。"
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="テンプレートを検索..."
            className="flex-1 rounded-md p-2 text-sm"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("すべて")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedCategory === "すべて"
                  ? "bg-primary text-white"
                  : "bg-card border border-card-border hover:bg-accent-bg"
              }`}
            >
              すべて
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-white"
                    : "bg-card border border-card-border hover:bg-accent-bg"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((template) => (
            <div
              key={template.title}
              className="rounded-lg border border-card-border bg-card overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-card-border">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{template.title}</h3>
                    <span className="rounded-full bg-accent-bg px-2 py-0.5 text-xs text-primary">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1">{template.description}</p>
                </div>
                <button
                  onClick={() => copy(template.prompt, template.title)}
                  className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
                >
                  {copied === template.title ? "コピー済み！" : "コピー"}
                </button>
              </div>
              <pre className="p-4 text-sm font-mono whitespace-pre-wrap text-muted overflow-x-auto">
                {template.prompt}
              </pre>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted py-8">
            該当するテンプレートが見つかりませんでした
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
