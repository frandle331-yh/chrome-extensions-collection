"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const ERAS = [
  { name: "令和", start: 2019 },
  { name: "平成", start: 1989 },
  { name: "昭和", start: 1926 },
  { name: "大正", start: 1912 },
  { name: "明治", start: 1868 },
];

function seirekiToWareki(year: number): { era: string; year: number }[] {
  return ERAS.filter((e) => year >= e.start).map((e) => ({
    era: e.name,
    year: year - e.start + 1,
  }));
}

function warekiToSeireki(era: string, year: number): number | null {
  const found = ERAS.find((e) => e.name === era);
  return found ? found.start + year - 1 : null;
}

export default function WarekiConverter() {
  const [seireki, setSeireki] = useState(new Date().getFullYear());
  const [selectedEra, setSelectedEra] = useState("令和");
  const [warekiYear, setWarekiYear] = useState(
    new Date().getFullYear() - 2019 + 1
  );

  const warekiResults = seirekiToWareki(seireki);
  const seirekiResult = warekiToSeireki(selectedEra, warekiYear);

  return (
    <ToolLayout
      title="和暦西暦変換ツール"
      description="西暦から和暦（令和・平成・昭和・大正・明治）、和暦から西暦への変換。"
    >
      <div className="space-y-8">
        <div className="rounded-lg border border-card-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">西暦 → 和暦</h2>
          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm font-medium shrink-0">西暦</label>
            <input
              type="number"
              value={seireki}
              onChange={(e) => setSeireki(Number(e.target.value))}
              min={1868}
              max={2100}
              className="w-32 rounded-md p-2 font-mono text-sm"
            />
            <span className="text-sm text-muted">年</span>
          </div>
          {warekiResults.length > 0 ? (
            <div className="space-y-2">
              {warekiResults.map((r) => (
                <div
                  key={r.era}
                  className="flex items-center gap-2 rounded-md bg-accent-bg px-4 py-3"
                >
                  <span className="font-bold text-primary">{r.era}</span>
                  <span className="font-mono text-lg">
                    {r.year === 1 ? "元" : r.year}
                  </span>
                  <span className="text-sm text-muted">年</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">
              1868年（明治元年）以降の西暦を入力してください
            </p>
          )}
        </div>

        <div className="rounded-lg border border-card-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">和暦 → 西暦</h2>
          <div className="flex items-center gap-3 mb-4">
            <select
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value)}
              className="rounded-md border border-card-border bg-background p-2 text-sm"
            >
              {ERAS.map((e) => (
                <option key={e.name} value={e.name}>
                  {e.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={warekiYear}
              onChange={(e) => setWarekiYear(Number(e.target.value))}
              min={1}
              className="w-24 rounded-md p-2 font-mono text-sm"
            />
            <span className="text-sm text-muted">年</span>
          </div>
          {seirekiResult && (
            <div className="rounded-md bg-accent-bg px-4 py-3">
              <span className="text-sm text-muted">西暦 </span>
              <span className="font-mono text-lg font-bold text-primary">
                {seirekiResult}
              </span>
              <span className="text-sm text-muted"> 年</span>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-card-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">元号一覧</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left py-2 px-3">元号</th>
                  <th className="text-left py-2 px-3">開始年（西暦）</th>
                  <th className="text-left py-2 px-3">期間</th>
                </tr>
              </thead>
              <tbody>
                {ERAS.map((e, i) => {
                  const end = i === 0 ? "現在" : `${ERAS[i - 1].start - 1}年`;
                  return (
                    <tr key={e.name} className="border-b border-card-border">
                      <td className="py-2 px-3 font-medium">{e.name}</td>
                      <td className="py-2 px-3 font-mono">{e.start}年</td>
                      <td className="py-2 px-3 text-muted">
                        {e.start}年 〜 {end}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
