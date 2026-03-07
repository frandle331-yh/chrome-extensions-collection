"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const encode = () => {
    try {
      const encoded = btoa(
        new TextEncoder()
          .encode(input)
          .reduce((data, byte) => data + String.fromCharCode(byte), "")
      );
      setOutput(encoded);
      setError("");
    } catch (e) {
      setError("エンコードに失敗しました: " + (e as Error).message);
      setOutput("");
    }
  };

  const decode = () => {
    try {
      const bytes = Uint8Array.from(atob(input), (c) => c.charCodeAt(0));
      const decoded = new TextDecoder().decode(bytes);
      setOutput(decoded);
      setError("");
    } catch {
      setError("デコードに失敗しました: 無効なBase64文字列です");
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
      title="Base64 エンコード/デコード"
      description="テキストをBase64にエンコード、またはBase64文字列をデコードします。UTF-8対応。"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">入力</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 rounded-lg p-4 font-mono text-sm resize-y"
            placeholder="エンコードするテキスト、またはデコードするBase64文字列を入力"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={encode}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            Base64にエンコード
          </button>
          <button
            onClick={decode}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            Base64をデコード
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
            <pre className="w-full rounded-lg border border-card-border bg-card p-4 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
