"use client";

import { useState, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

const CHARS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function getStrength(password: string): { label: string; color: string; width: string } {
  const len = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNum = /[0-9]/.test(password);
  const hasSym = /[^a-zA-Z0-9]/.test(password);
  const types = [hasLower, hasUpper, hasNum, hasSym].filter(Boolean).length;

  if (len >= 16 && types >= 3) return { label: "非常に強い", color: "bg-green-500", width: "100%" };
  if (len >= 12 && types >= 3) return { label: "強い", color: "bg-green-400", width: "75%" };
  if (len >= 8 && types >= 2) return { label: "普通", color: "bg-yellow-400", width: "50%" };
  return { label: "弱い", color: "bg-red-400", width: "25%" };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let charset = "";
    if (lowercase) charset += CHARS.lowercase;
    if (uppercase) charset += CHARS.uppercase;
    if (numbers) charset += CHARS.numbers;
    if (symbols) charset += CHARS.symbols;

    if (!charset) {
      setPassword("");
      return;
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    const result = Array.from(array, (x) => charset[x % charset.length]).join("");
    setPassword(result);
  }, [length, uppercase, lowercase, numbers, symbols]);

  useEffect(() => {
    generate();
  }, [generate]);

  const copy = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const strength = password ? getStrength(password) : null;

  return (
    <ToolLayout
      title="パスワード生成ツール"
      description="暗号学的に安全なランダムパスワードを生成します。Web Crypto APIを使用。"
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-card-border bg-card p-6">
          <div className="flex items-center gap-3">
            <code className="flex-1 text-lg font-mono break-all select-all">
              {password || "文字種を1つ以上選択してください"}
            </code>
            <button
              onClick={copy}
              disabled={!password}
              className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {copied ? "コピー済み！" : "コピー"}
            </button>
          </div>
          {strength && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted">強度</span>
                <span>{strength.label}</span>
              </div>
              <div className="h-2 rounded-full bg-card-border overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${strength.color}`}
                  style={{ width: strength.width }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-between text-sm font-medium mb-2">
              <span>文字数: {length}</span>
            </label>
            <input
              type="range"
              min={4}
              max={128}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>4</span>
              <span>128</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "小文字 (a-z)", checked: lowercase, set: setLowercase },
              { label: "大文字 (A-Z)", checked: uppercase, set: setUppercase },
              { label: "数字 (0-9)", checked: numbers, set: setNumbers },
              { label: "記号 (!@#$)", checked: symbols, set: setSymbols },
            ].map(({ label, checked, set }) => (
              <label
                key={label}
                className="flex items-center gap-2 rounded-lg border border-card-border bg-card p-3 cursor-pointer hover:bg-accent-bg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => set(e.target.checked)}
                  className="accent-primary"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>

          <button
            onClick={generate}
            className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            新しいパスワードを生成
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
