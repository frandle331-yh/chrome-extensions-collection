"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

// Approximate token counting heuristics
function countTokens(text: string): { gpt: number; claude: number } {
  if (!text) return { gpt: 0, claude: 0 };

  // Count character types
  const japaneseChars = (text.match(/[\u3000-\u9FFF\uF900-\uFAFF]/g) || []).length;
  const otherChars = text.length - japaneseChars;

  // GPT tokenizer: ~1 token per 1-2 Japanese chars, ~4 chars per token for English
  const gptJpTokens = Math.ceil(japaneseChars / 1.2);
  const gptEnTokens = Math.ceil(otherChars / 4);
  const gpt = gptJpTokens + gptEnTokens;

  // Claude tokenizer: similar but slightly different ratios
  const claudeJpTokens = Math.ceil(japaneseChars / 1.3);
  const claudeEnTokens = Math.ceil(otherChars / 3.8);
  const claude = claudeJpTokens + claudeEnTokens;

  return { gpt: Math.max(1, gpt), claude: Math.max(1, claude) };
}

type Model = {
  name: string;
  provider: string;
  inputPer1M: number;  // $ per 1M input tokens
  outputPer1M: number; // $ per 1M output tokens
};

const MODELS: Model[] = [
  { name: "GPT-4o", provider: "OpenAI", inputPer1M: 2.5, outputPer1M: 10 },
  { name: "GPT-4o mini", provider: "OpenAI", inputPer1M: 0.15, outputPer1M: 0.6 },
  { name: "GPT-4.1", provider: "OpenAI", inputPer1M: 2.0, outputPer1M: 8.0 },
  { name: "GPT-4.1 mini", provider: "OpenAI", inputPer1M: 0.4, outputPer1M: 1.6 },
  { name: "GPT-4.1 nano", provider: "OpenAI", inputPer1M: 0.1, outputPer1M: 0.4 },
  { name: "o3", provider: "OpenAI", inputPer1M: 2.0, outputPer1M: 8.0 },
  { name: "o4-mini", provider: "OpenAI", inputPer1M: 1.1, outputPer1M: 4.4 },
  { name: "Claude Opus 4", provider: "Anthropic", inputPer1M: 15, outputPer1M: 75 },
  { name: "Claude Sonnet 4", provider: "Anthropic", inputPer1M: 3, outputPer1M: 15 },
  { name: "Claude Haiku 3.5", provider: "Anthropic", inputPer1M: 0.8, outputPer1M: 4 },
  { name: "Gemini 2.5 Pro", provider: "Google", inputPer1M: 1.25, outputPer1M: 10 },
  { name: "Gemini 2.5 Flash", provider: "Google", inputPer1M: 0.15, outputPer1M: 0.6 },
];

export default function TokenCounter() {
  const [text, setText] = useState("");
  const [outputRatio, setOutputRatio] = useState(1);

  const tokens = useMemo(() => countTokens(text), [text]);

  const costs = useMemo(() => {
    return MODELS.map((model) => {
      const isGpt = model.provider === "OpenAI";
      const inputTokens = isGpt ? tokens.gpt : tokens.claude;
      const outputTokens = Math.ceil(inputTokens * outputRatio);
      const inputCost = (inputTokens / 1_000_000) * model.inputPer1M;
      const outputCost = (outputTokens / 1_000_000) * model.outputPer1M;
      return {
        ...model,
        inputTokens,
        outputTokens,
        inputCost,
        outputCost,
        totalCost: inputCost + outputCost,
      };
    });
  }, [tokens, outputRatio]);

  return (
    <ToolLayout
      title="AIトークンカウンター＆API料金計算"
      description="テキストのトークン数を推定し、GPT・Claude・GeminiのAPI利用料金を計算します。"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">テキスト入力</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-40 rounded-lg p-4 text-sm resize-y"
            placeholder="トークン数を計算したいテキストを入力してください"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-card-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">{tokens.gpt.toLocaleString()}</div>
            <div className="text-xs text-muted mt-1">GPT系 推定トークン数</div>
          </div>
          <div className="rounded-lg border border-card-border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">{tokens.claude.toLocaleString()}</div>
            <div className="text-xs text-muted mt-1">Claude系 推定トークン数</div>
          </div>
        </div>

        <div className="rounded-lg border border-card-border bg-card p-4">
          <p className="text-xs text-muted">
            ※ トークン数は近似値です。実際のトークン数はモデルのトークナイザーにより異なります。
            日本語は1文字あたり約0.7〜1トークン、英語は約4文字あたり1トークンで計算しています。
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            出力トークンの倍率: ×{outputRatio}（入力に対する出力量の比率）
          </label>
          <input
            type="range"
            min={0.5}
            max={5}
            step={0.5}
            value={outputRatio}
            onChange={(e) => setOutputRatio(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>×0.5（短い返答）</span>
            <span>×5（長い返答）</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">API料金比較</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-card-border bg-card">
                  <th className="text-left py-2 px-3">モデル</th>
                  <th className="text-left py-2 px-3">提供元</th>
                  <th className="text-right py-2 px-3">入力料金</th>
                  <th className="text-right py-2 px-3">出力料金</th>
                  <th className="text-right py-2 px-3">合計</th>
                  <th className="text-right py-2 px-3">1000回あたり</th>
                </tr>
              </thead>
              <tbody>
                {costs.map((c) => (
                  <tr key={c.name} className="border-b border-card-border hover:bg-accent-bg">
                    <td className="py-2 px-3 font-medium whitespace-nowrap">{c.name}</td>
                    <td className="py-2 px-3 text-muted">{c.provider}</td>
                    <td className="py-2 px-3 text-right font-mono text-xs">
                      ${c.inputCost.toFixed(6)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-xs">
                      ${c.outputCost.toFixed(6)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-primary">
                      ${c.totalCost.toFixed(6)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-xs">
                      ${(c.totalCost * 1000).toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
