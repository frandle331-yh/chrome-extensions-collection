"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

async function hashText(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

type HashResults = {
  "SHA-1": string;
  "SHA-256": string;
  "SHA-384": string;
  "SHA-512": string;
};

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<HashResults | null>(null);
  const [copied, setCopied] = useState("");

  const generate = async () => {
    if (!input) return;
    const results: HashResults = {
      "SHA-1": await hashText(input, "SHA-1"),
      "SHA-256": await hashText(input, "SHA-256"),
      "SHA-384": await hashText(input, "SHA-384"),
      "SHA-512": await hashText(input, "SHA-512"),
    };
    setHashes(results);
  };

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <ToolLayout
      title="ハッシュ生成ツール"
      description="テキストからSHA-1、SHA-256、SHA-384、SHA-512のハッシュ値を生成します。"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">入力テキスト</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-32 rounded-lg p-4 font-mono text-sm resize-y"
            placeholder="ハッシュ化するテキストを入力"
            spellCheck={false}
          />
        </div>

        <button
          onClick={generate}
          disabled={!input}
          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
        >
          ハッシュを生成
        </button>

        {hashes && (
          <div className="space-y-3">
            {(Object.entries(hashes) as [string, string][]).map(
              ([algo, hash]) => (
                <div
                  key={algo}
                  className="rounded-lg border border-card-border bg-card p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">{algo}</label>
                    <button
                      onClick={() => copy(hash, algo)}
                      className="text-xs text-primary hover:underline"
                    >
                      {copied === algo ? "コピー済み！" : "コピー"}
                    </button>
                  </div>
                  <code className="block text-xs font-mono break-all text-muted select-all">
                    {hash}
                  </code>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
