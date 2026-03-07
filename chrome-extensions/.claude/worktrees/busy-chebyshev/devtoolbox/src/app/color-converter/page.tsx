"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100;
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1/3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1/3) * 255),
  ];
}

export default function ColorConverter() {
  const [hex, setHex] = useState("#2563eb");
  const [rgb, setRgb] = useState({ r: 37, g: 99, b: 235 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const [copied, setCopied] = useState("");

  const updateFromHex = (value: string) => {
    setHex(value);
    const result = hexToRgb(value);
    if (result) {
      const [r, g, b] = result;
      setRgb({ r, g, b });
      const [h, s, l] = rgbToHsl(r, g, b);
      setHsl({ h, s, l });
    }
  };

  const updateFromRgb = (r: number, g: number, b: number) => {
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    setRgb({ r, g, b });
    setHex(rgbToHex(r, g, b));
    const [h, s, l] = rgbToHsl(r, g, b);
    setHsl({ h, s, l });
  };

  const updateFromHsl = (h: number, s: number, l: number) => {
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    l = Math.max(0, Math.min(100, l));
    setHsl({ h, s, l });
    const [r, g, b] = hslToRgb(h, s, l);
    setRgb({ r, g, b });
    setHex(rgbToHex(r, g, b));
  };

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <ToolLayout
      title="カラー変換ツール"
      description="HEX・RGB・HSLの相互変換。カラーピッカーで直感的に色を選べます。"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div
            className="w-24 h-24 rounded-xl border border-card-border shadow-inner shrink-0"
            style={{ backgroundColor: hex }}
          />
          <input
            type="color"
            value={hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="w-12 h-12 cursor-pointer rounded border-0"
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-card-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">HEX</label>
              <button onClick={() => copy(hex, "hex")} className="text-xs text-primary hover:underline">
                {copied === "hex" ? "コピー済み！" : "コピー"}
              </button>
            </div>
            <input
              type="text"
              value={hex}
              onChange={(e) => updateFromHex(e.target.value)}
              className="w-full rounded-md p-2 font-mono text-sm"
              spellCheck={false}
            />
          </div>

          <div className="rounded-lg border border-card-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">RGB</label>
              <button
                onClick={() => copy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "rgb")}
                className="text-xs text-primary hover:underline"
              >
                {copied === "rgb" ? "コピー済み！" : "コピー"}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["r", "g", "b"] as const).map((ch) => (
                <div key={ch}>
                  <label className="text-xs text-muted uppercase">{ch}</label>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb[ch]}
                    onChange={(e) =>
                      updateFromRgb(
                        ch === "r" ? Number(e.target.value) : rgb.r,
                        ch === "g" ? Number(e.target.value) : rgb.g,
                        ch === "b" ? Number(e.target.value) : rgb.b
                      )
                    }
                    className="w-full rounded-md p-2 font-mono text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-card-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">HSL</label>
              <button
                onClick={() => copy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "hsl")}
                className="text-xs text-primary hover:underline"
              >
                {copied === "hsl" ? "コピー済み！" : "コピー"}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: "h" as const, label: "H (色相)", max: 360 },
                { key: "s" as const, label: "S (彩度%)", max: 100 },
                { key: "l" as const, label: "L (明度%)", max: 100 },
              ]).map(({ key, label, max }) => (
                <div key={key}>
                  <label className="text-xs text-muted">{label}</label>
                  <input
                    type="number"
                    min={0}
                    max={max}
                    value={hsl[key]}
                    onChange={(e) =>
                      updateFromHsl(
                        key === "h" ? Number(e.target.value) : hsl.h,
                        key === "s" ? Number(e.target.value) : hsl.s,
                        key === "l" ? Number(e.target.value) : hsl.l
                      )
                    }
                    className="w-full rounded-md p-2 font-mono text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
