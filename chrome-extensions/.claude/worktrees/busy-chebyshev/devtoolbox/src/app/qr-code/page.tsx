"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import ToolLayout from "@/components/ToolLayout";

export default function QRCodeGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    if (!text.trim() || !canvasRef.current) {
      setGenerated(false);
      return;
    }
    QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then(() => setGenerated(true))
      .catch(() => setGenerated(false));
  }, [text, size]);

  const download = () => {
    if (!canvasRef.current || !generated) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <ToolLayout
      title="QRコード作成ツール"
      description="テキストやURLからQRコードを生成します。PNGでダウンロード可能。"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            テキストまたはURL
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-28 rounded-lg p-4 font-mono text-sm resize-y"
            placeholder="QRコードにしたいテキストやURLを入力"
            spellCheck={false}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            サイズ: {size}px
          </label>
          <input
            type="range"
            min={128}
            max={512}
            step={64}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div className="flex flex-col items-center gap-4 rounded-lg border border-card-border bg-card p-8">
          <canvas ref={canvasRef} className={generated ? "" : "hidden"} />
          {!generated && (
            <p className="text-muted text-sm">
              上にテキストを入力するとQRコードが生成されます
            </p>
          )}
          {generated && (
            <button
              onClick={download}
              className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
            >
              PNGをダウンロード
            </button>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
