"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

function toHankaku(str: string): string {
  return str
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    )
    .replace(/[！-～]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    )
    .replace(/　/g, " ")
    .replace(/[ァ-ヶ]/g, (s) => {
      const map: Record<string, string> = {
        ガ: "ｶﾞ", ギ: "ｷﾞ", グ: "ｸﾞ", ゲ: "ｹﾞ", ゴ: "ｺﾞ",
        ザ: "ｻﾞ", ジ: "ｼﾞ", ズ: "ｽﾞ", ゼ: "ｾﾞ", ゾ: "ｿﾞ",
        ダ: "ﾀﾞ", ヂ: "ﾁﾞ", ヅ: "ﾂﾞ", デ: "ﾃﾞ", ド: "ﾄﾞ",
        バ: "ﾊﾞ", ビ: "ﾋﾞ", ブ: "ﾌﾞ", ベ: "ﾍﾞ", ボ: "ﾎﾞ",
        パ: "ﾊﾟ", ピ: "ﾋﾟ", プ: "ﾌﾟ", ペ: "ﾍﾟ", ポ: "ﾎﾟ",
        ヴ: "ｳﾞ",
        ア: "ｱ", イ: "ｲ", ウ: "ｳ", エ: "ｴ", オ: "ｵ",
        カ: "ｶ", キ: "ｷ", ク: "ｸ", ケ: "ｹ", コ: "ｺ",
        サ: "ｻ", シ: "ｼ", ス: "ｽ", セ: "ｾ", ソ: "ｿ",
        タ: "ﾀ", チ: "ﾁ", ツ: "ﾂ", テ: "ﾃ", ト: "ﾄ",
        ナ: "ﾅ", ニ: "ﾆ", ヌ: "ﾇ", ネ: "ﾈ", ノ: "ﾉ",
        ハ: "ﾊ", ヒ: "ﾋ", フ: "ﾌ", ヘ: "ﾍ", ホ: "ﾎ",
        マ: "ﾏ", ミ: "ﾐ", ム: "ﾑ", メ: "ﾒ", モ: "ﾓ",
        ヤ: "ﾔ", ユ: "ﾕ", ヨ: "ﾖ",
        ラ: "ﾗ", リ: "ﾘ", ル: "ﾙ", レ: "ﾚ", ロ: "ﾛ",
        ワ: "ﾜ", ヲ: "ｦ", ン: "ﾝ",
        ァ: "ｧ", ィ: "ｨ", ゥ: "ｩ", ェ: "ｪ", ォ: "ｫ",
        ッ: "ｯ", ャ: "ｬ", ュ: "ｭ", ョ: "ｮ",
        ー: "ｰ", "。": "｡", "「": "｢", "」": "｣", "、": "､", "・": "･",
      };
      return map[s] ?? s;
    });
}

function toZenkaku(str: string): string {
  return str
    .replace(/[A-Za-z0-9]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) + 0xfee0)
    )
    .replace(/[!-~]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) + 0xfee0)
    )
    .replace(/ /g, "　")
    .replace(/ｶﾞ|ｷﾞ|ｸﾞ|ｹﾞ|ｺﾞ|ｻﾞ|ｼﾞ|ｽﾞ|ｾﾞ|ｿﾞ|ﾀﾞ|ﾁﾞ|ﾂﾞ|ﾃﾞ|ﾄﾞ|ﾊﾞ|ﾋﾞ|ﾌﾞ|ﾍﾞ|ﾎﾞ|ﾊﾟ|ﾋﾟ|ﾌﾟ|ﾍﾟ|ﾎﾟ|ｳﾞ|[ｦ-ﾝｧ-ｯｰ｡｢｣､･]/g, (s) => {
      const map: Record<string, string> = {
        "ｶﾞ": "ガ", "ｷﾞ": "ギ", "ｸﾞ": "グ", "ｹﾞ": "ゲ", "ｺﾞ": "ゴ",
        "ｻﾞ": "ザ", "ｼﾞ": "ジ", "ｽﾞ": "ズ", "ｾﾞ": "ゼ", "ｿﾞ": "ゾ",
        "ﾀﾞ": "ダ", "ﾁﾞ": "ヂ", "ﾂﾞ": "ヅ", "ﾃﾞ": "デ", "ﾄﾞ": "ド",
        "ﾊﾞ": "バ", "ﾋﾞ": "ビ", "ﾌﾞ": "ブ", "ﾍﾞ": "ベ", "ﾎﾞ": "ボ",
        "ﾊﾟ": "パ", "ﾋﾟ": "ピ", "ﾌﾟ": "プ", "ﾍﾟ": "ペ", "ﾎﾟ": "ポ",
        "ｳﾞ": "ヴ",
        ｱ: "ア", ｲ: "イ", ｳ: "ウ", ｴ: "エ", ｵ: "オ",
        ｶ: "カ", ｷ: "キ", ｸ: "ク", ｹ: "ケ", ｺ: "コ",
        ｻ: "サ", ｼ: "シ", ｽ: "ス", ｾ: "セ", ｿ: "ソ",
        ﾀ: "タ", ﾁ: "チ", ﾂ: "ツ", ﾃ: "テ", ﾄ: "ト",
        ﾅ: "ナ", ﾆ: "ニ", ﾇ: "ヌ", ﾈ: "ネ", ﾉ: "ノ",
        ﾊ: "ハ", ﾋ: "ヒ", ﾌ: "フ", ﾍ: "ヘ", ﾎ: "ホ",
        ﾏ: "マ", ﾐ: "ミ", ﾑ: "ム", ﾒ: "メ", ﾓ: "モ",
        ﾔ: "ヤ", ﾕ: "ユ", ﾖ: "ヨ",
        ﾗ: "ラ", ﾘ: "リ", ﾙ: "ル", ﾚ: "レ", ﾛ: "ロ",
        ﾜ: "ワ", ｦ: "ヲ", ﾝ: "ン",
        ｧ: "ァ", ｨ: "ィ", ｩ: "ゥ", ｪ: "ェ", ｫ: "ォ",
        ｯ: "ッ", ｬ: "ャ", ｭ: "ュ", ｮ: "ョ",
        ｰ: "ー", "｡": "。", "｢": "「", "｣": "」", "､": "、", "･": "・",
      };
      return map[s] ?? s;
    });
}

export default function ZenkakuHankaku() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ToolLayout
      title="全角半角変換ツール"
      description="全角文字を半角に、半角文字を全角に変換します。英数字・カタカナ・記号に対応。"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">入力テキスト</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 rounded-lg p-4 text-sm resize-y"
            placeholder="変換したいテキストを入力してください"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setOutput(toHankaku(input))}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            全角 → 半角
          </button>
          <button
            onClick={() => setOutput(toZenkaku(input))}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            半角 → 全角
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
            <label className="block text-sm font-medium mb-2">変換結果</label>
            <pre className="w-full rounded-lg border border-card-border bg-card p-4 text-sm whitespace-pre-wrap break-all">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
