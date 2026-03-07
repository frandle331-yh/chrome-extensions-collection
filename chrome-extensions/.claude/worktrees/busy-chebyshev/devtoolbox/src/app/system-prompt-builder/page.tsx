"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function SystemPromptBuilder() {
  const [role, setRole] = useState("");
  const [expertise, setExpertise] = useState("");
  const [tone, setTone] = useState("丁寧");
  const [language, setLanguage] = useState("日本語");
  const [constraints, setConstraints] = useState<string[]>([]);
  const [outputFormat, setOutputFormat] = useState("");
  const [customRules, setCustomRules] = useState("");
  const [copied, setCopied] = useState(false);

  const toneOptions = ["丁寧", "カジュアル", "フォーマル", "フレンドリー", "簡潔", "学術的"];
  const constraintOptions = [
    "推測や憶測は避け、事実に基づいて回答する",
    "わからない場合は正直に「わからない」と答える",
    "回答は簡潔にまとめる",
    "具体例を含めて説明する",
    "ステップバイステップで説明する",
    "専門用語を使う場合は解説を付ける",
    "コードを含む場合はコメントを付ける",
    "Markdownフォーマットで回答する",
    "質問に直接関係ない情報は含めない",
    "ユーザーの意図を確認してから回答する",
  ];

  const generatedPrompt = useMemo(() => {
    const parts: string[] = [];

    if (role) {
      parts.push(`あなたは${role}です。`);
    }

    if (expertise) {
      parts.push(`${expertise}の専門知識を持っています。`);
    }

    parts.push("");
    parts.push("## 回答のルール");

    parts.push(`- ${tone}なトーンで回答してください。`);
    parts.push(`- ${language}で回答してください。`);

    if (constraints.length > 0) {
      constraints.forEach((c) => {
        parts.push(`- ${c}`);
      });
    }

    if (outputFormat) {
      parts.push("");
      parts.push("## 出力フォーマット");
      parts.push(outputFormat);
    }

    if (customRules) {
      parts.push("");
      parts.push("## 追加ルール");
      parts.push(customRules);
    }

    return parts.join("\n");
  }, [role, expertise, tone, language, constraints, outputFormat, customRules]);

  const copy = async () => {
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleConstraint = (c: string) => {
    setConstraints((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  return (
    <ToolLayout
      title="システムプロンプトビルダー"
      description="AIのシステムプロンプトをGUIで組み立て。ChatGPT・Claude・Geminiで使えます。"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 設定パネル */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">AIの役割</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-md p-2 text-sm"
                placeholder="例: 経験豊富なシニアエンジニア"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">専門分野</label>
              <input
                type="text"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                className="w-full rounded-md p-2 text-sm"
                placeholder="例: React, TypeScript, Next.js"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">トーン</label>
              <div className="flex flex-wrap gap-2">
                {toneOptions.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      tone === t
                        ? "bg-primary text-white"
                        : "bg-card border border-card-border hover:bg-accent-bg"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">回答言語</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-md border border-card-border bg-background p-2 text-sm"
              >
                <option>日本語</option>
                <option>英語</option>
                <option>ユーザーの言語に合わせる</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">制約条件（複数選択可）</label>
              <div className="space-y-2">
                {constraintOptions.map((c) => (
                  <label
                    key={c}
                    className="flex items-start gap-2 rounded-md border border-card-border bg-card p-2 cursor-pointer hover:bg-accent-bg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={constraints.includes(c)}
                      onChange={() => toggleConstraint(c)}
                      className="accent-primary mt-0.5"
                    />
                    <span className="text-xs">{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">出力フォーマット（任意）</label>
              <textarea
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full h-20 rounded-lg p-3 text-sm resize-y"
                placeholder={"例:\n- 見出しはH2を使用\n- 箇条書きで要点をまとめる\n- 最後にまとめを入れる"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">追加ルール（自由記述）</label>
              <textarea
                value={customRules}
                onChange={(e) => setCustomRules(e.target.value)}
                className="w-full h-20 rounded-lg p-3 text-sm resize-y"
                placeholder="その他のカスタムルールがあれば入力"
              />
            </div>
          </div>

          {/* プレビュー */}
          <div>
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">生成されたシステムプロンプト</label>
                <button
                  onClick={copy}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
                >
                  {copied ? "コピー済み！" : "コピー"}
                </button>
              </div>
              <pre className="rounded-lg border border-card-border bg-card p-4 text-sm font-mono whitespace-pre-wrap overflow-y-auto max-h-[600px]">
                {generatedPrompt}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
