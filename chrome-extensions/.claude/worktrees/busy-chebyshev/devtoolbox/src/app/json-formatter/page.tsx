"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const validate = () => {
    try {
      JSON.parse(input);
      setError("");
      setOutput("有効なJSONです！");
    } catch (e) {
      setError("無効なJSON: " + (e as Error).message);
      setOutput("");
    }
  };

  const copy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ToolLayout
      title="JSON整形・検証ツール"
      description="JSONデータの整形（フォーマット）、圧縮（ミニファイ）、検証（バリデーション）ができます。"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">入力JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 rounded-lg p-4 font-mono text-sm resize-y"
            placeholder='{"example": "ここにJSONを貼り付けてください"}'
            spellCheck={false}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={format}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            整形する
          </button>
          <button
            onClick={minify}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            圧縮する
          </button>
          <button
            onClick={validate}
            className="rounded-md border border-card-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent-bg transition-colors"
          >
            検証する
          </button>
          <button
            onClick={copy}
            disabled={!output}
            className="rounded-md border border-card-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent-bg transition-colors disabled:opacity-50"
          >
            {copied ? "コピーしました！" : "結果をコピー"}
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {output && (
          <div>
            <label className="block text-sm font-medium mb-2">出力結果</label>
            <pre className="w-full rounded-lg border border-card-border bg-card p-4 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
