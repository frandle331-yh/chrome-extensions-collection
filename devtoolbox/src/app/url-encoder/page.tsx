"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const encode = () => {
    setOutput(encodeURIComponent(input));
  };

  const encodeAll = () => {
    setOutput(encodeURI(input));
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch {
      setOutput("エラー: 無効なエンコード文字列です");
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
      title="URLエンコード/デコード"
      description="URLコンポーネントやURI全体のエンコード・デコードを行います。"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">入力</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-36 rounded-lg p-4 font-mono text-sm resize-y"
            placeholder="エンコード/デコードするテキストやURLを入力"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={encode}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            コンポーネントをエンコード
          </button>
          <button
            onClick={encodeAll}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            URI全体をエンコード
          </button>
          <button
            onClick={decode}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            デコード
          </button>
          <button
            onClick={copy}
            disabled={!output}
            className="rounded-md border border-card-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent-bg transition-colors disabled:opacity-50"
          >
            {copied ? "コピーしました！" : "結果をコピー"}
          </button>
        </div>

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
