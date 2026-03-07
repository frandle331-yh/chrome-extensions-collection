"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

const MINUTES = ["*", ...Array.from({ length: 60 }, (_, i) => String(i))];
const HOURS = ["*", ...Array.from({ length: 24 }, (_, i) => String(i))];
const DAYS = ["*", ...Array.from({ length: 31 }, (_, i) => String(i + 1))];
const MONTHS_OPT = [
  { value: "*", label: "毎月" },
  { value: "1", label: "1月" }, { value: "2", label: "2月" }, { value: "3", label: "3月" },
  { value: "4", label: "4月" }, { value: "5", label: "5月" }, { value: "6", label: "6月" },
  { value: "7", label: "7月" }, { value: "8", label: "8月" }, { value: "9", label: "9月" },
  { value: "10", label: "10月" }, { value: "11", label: "11月" }, { value: "12", label: "12月" },
];
const WEEKDAYS_OPT = [
  { value: "*", label: "毎日" },
  { value: "0", label: "日曜" }, { value: "1", label: "月曜" }, { value: "2", label: "火曜" },
  { value: "3", label: "水曜" }, { value: "4", label: "木曜" }, { value: "5", label: "金曜" },
  { value: "6", label: "土曜" },
];

function describeCron(min: string, hour: string, day: string, month: string, weekday: string): string {
  const parts: string[] = [];

  if (month !== "*") parts.push(`${month}月`);
  if (day !== "*") parts.push(`${day}日`);
  if (weekday !== "*") {
    const names = ["日", "月", "火", "水", "木", "金", "土"];
    parts.push(`${names[Number(weekday)] || weekday}曜日`);
  }
  if (month === "*" && day === "*" && weekday === "*") parts.push("毎日");
  if (hour === "*" && min === "*") {
    parts.push("毎分");
  } else if (hour === "*") {
    parts.push(`毎時${min}分`);
  } else if (min === "*") {
    parts.push(`${hour}時台の毎分`);
  } else {
    parts.push(`${hour}時${min}分`);
  }

  parts.push("に実行");
  return parts.join(" ");
}

function getNextRuns(expression: string, count: number): string[] {
  const [min, hour, day, month, weekday] = expression.split(" ");
  const results: string[] = [];
  const now = new Date();
  const check = new Date(now);

  for (let i = 0; i < 525600 && results.length < count; i++) {
    check.setTime(now.getTime() + i * 60000);
    const m = check.getMinutes();
    const h = check.getHours();
    const d = check.getDate();
    const mo = check.getMonth() + 1;
    const w = check.getDay();

    if (
      (min === "*" || Number(min) === m) &&
      (hour === "*" || Number(hour) === h) &&
      (day === "*" || Number(day) === d) &&
      (month === "*" || Number(month) === mo) &&
      (weekday === "*" || Number(weekday) === w)
    ) {
      const str = `${check.getFullYear()}/${String(mo).padStart(2, "0")}/${String(d).padStart(2, "0")} ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      if (results[results.length - 1] !== str) {
        results.push(str);
      }
    }
  }
  return results;
}

export default function CronGenerator() {
  const [min, setMin] = useState("0");
  const [hour, setHour] = useState("9");
  const [day, setDay] = useState("*");
  const [month, setMonth] = useState("*");
  const [weekday, setWeekday] = useState("*");
  const [copied, setCopied] = useState(false);

  const expression = `${min} ${hour} ${day} ${month} ${weekday}`;
  const description = describeCron(min, hour, day, month, weekday);

  const nextRuns = useMemo(() => {
    return getNextRuns(expression, 5);
  }, [expression]);

  const copy = async () => {
    await navigator.clipboard.writeText(expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectClass = "rounded-md border border-card-border bg-background p-2 text-sm";

  return (
    <ToolLayout
      title="Cron式ジェネレーター"
      description="GUIでcron式を組み立て。日本語で実行タイミングを表示し、次回実行日時も確認できます。"
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-card-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <code className="flex-1 text-xl font-mono font-bold text-primary tracking-wider">
              {expression}
            </code>
            <button
              onClick={copy}
              className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
            >
              {copied ? "コピー済み！" : "コピー"}
            </button>
          </div>
          <p className="text-sm text-muted">{description}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">分</label>
            <select value={min} onChange={(e) => setMin(e.target.value)} className={selectClass}>
              {MINUTES.map((v) => (
                <option key={v} value={v}>{v === "*" ? "毎分 (*)" : `${v}分`}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">時</label>
            <select value={hour} onChange={(e) => setHour(e.target.value)} className={selectClass}>
              {HOURS.map((v) => (
                <option key={v} value={v}>{v === "*" ? "毎時 (*)" : `${v}時`}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">日</label>
            <select value={day} onChange={(e) => setDay(e.target.value)} className={selectClass}>
              {DAYS.map((v) => (
                <option key={v} value={v}>{v === "*" ? "毎日 (*)" : `${v}日`}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">月</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} className={selectClass}>
              {MONTHS_OPT.map((v) => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">曜日</label>
            <select value={weekday} onChange={(e) => setWeekday(e.target.value)} className={selectClass}>
              {WEEKDAYS_OPT.map((v) => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-lg border border-card-border bg-card p-4">
          <h3 className="text-sm font-medium mb-2">よく使うパターン</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "毎分", vals: ["*", "*", "*", "*", "*"] },
              { label: "毎時0分", vals: ["0", "*", "*", "*", "*"] },
              { label: "毎日9時", vals: ["0", "9", "*", "*", "*"] },
              { label: "毎日深夜0時", vals: ["0", "0", "*", "*", "*"] },
              { label: "平日9時", vals: ["0", "9", "*", "*", "1-5"] },
              { label: "毎月1日 0時", vals: ["0", "0", "1", "*", "*"] },
              { label: "毎週月曜9時", vals: ["0", "9", "*", "*", "1"] },
            ].map(({ label, vals }) => (
              <button
                key={label}
                onClick={() => {
                  setMin(vals[0]); setHour(vals[1]); setDay(vals[2]); setMonth(vals[3]); setWeekday(vals[4]);
                }}
                className="rounded-md border border-card-border px-3 py-1.5 text-xs hover:bg-accent-bg transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {nextRuns.length > 0 && (
          <div className="rounded-lg border border-card-border bg-card p-4">
            <h3 className="text-sm font-medium mb-3">次回実行日時（5件）</h3>
            <div className="space-y-1">
              {nextRuns.map((run, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-mono">
                  <span className="text-xs text-muted w-4">{i + 1}.</span>
                  <span>{run}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-lg border border-card-border bg-card p-4">
          <h3 className="text-sm font-medium mb-2">cron式のフォーマット</h3>
          <pre className="text-xs font-mono text-muted">
{`┌───────────── 分 (0-59)
│ ┌───────────── 時 (0-23)
│ │ ┌───────────── 日 (1-31)
│ │ │ ┌───────────── 月 (1-12)
│ │ │ │ ┌───────────── 曜日 (0-6, 0=日曜)
│ │ │ │ │
* * * * *`}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}
