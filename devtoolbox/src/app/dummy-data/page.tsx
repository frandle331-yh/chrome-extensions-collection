"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const LAST_NAMES = ["佐藤","鈴木","高橋","田中","伊藤","渡辺","山本","中村","小林","加藤","吉田","山田","松本","井上","木村","林","斎藤","清水","山口","池田","橋本","阿部","石川","前田","藤田","小川","岡田","後藤","長谷川","村上"];
const FIRST_NAMES_M = ["太郎","一郎","健太","大輔","翔太","拓也","直樹","達也","和也","哲也","隆","修","誠","豊","浩二","雄太","悠斗","蓮","湊","陽翔"];
const FIRST_NAMES_F = ["花子","美咲","陽子","裕子","恵子","由美","直美","明美","久美子","幸子","さくら","結衣","凛","芽依","紬","陽菜","莉子","美月","葵","楓"];
const PREFECTURES = ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];
const CITIES = ["中央区","港区","新宿区","渋谷区","千代田区","豊島区","文京区","台東区","墨田区","江東区","品川区","目黒区","大田区","世田谷区","中野区","杉並区","練馬区","板橋区","北区","荒川区"];
const TOWNS = ["本町","栄町","中町","東町","西町","南町","北町","緑町","旭町","幸町","若松町","桜町","松原","梅田","日の出","富士見","大和","弥生","朝日","泉"];
const DOMAINS = ["example.com","test.jp","sample.co.jp","demo.ne.jp","mail.example.jp"];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randNum(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePerson() {
  const isMale = Math.random() > 0.5;
  const lastName = rand(LAST_NAMES);
  const firstName = isMale ? rand(FIRST_NAMES_M) : rand(FIRST_NAMES_F);
  const gender = isMale ? "男性" : "女性";
  const age = randNum(18, 80);
  const birthYear = new Date().getFullYear() - age;
  const birthMonth = randNum(1, 12);
  const birthDay = randNum(1, 28);
  const birthday = `${birthYear}/${String(birthMonth).padStart(2, "0")}/${String(birthDay).padStart(2, "0")}`;
  const prefecture = rand(PREFECTURES);
  const city = rand(CITIES);
  const town = rand(TOWNS);
  const banchi = `${randNum(1, 30)}-${randNum(1, 20)}-${randNum(1, 10)}`;
  const address = `${prefecture}${city}${town}${banchi}`;
  const phone = `0${randNum(70, 90)}-${randNum(1000, 9999)}-${randNum(1000, 9999)}`;
  const emailLocal = `${lastName.toLowerCase ? firstName : firstName}${randNum(1, 999)}`;
  const email = `user${randNum(100, 9999)}@${rand(DOMAINS)}`;
  const postalCode = `${randNum(100, 999)}-${randNum(1000, 9999)}`;

  return { lastName, firstName, gender, age, birthday, postalCode, address, phone, email };
}

export default function DummyData() {
  const [count, setCount] = useState(5);
  const [data, setData] = useState<ReturnType<typeof generatePerson>[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setData(Array.from({ length: count }, generatePerson));
  };

  const copyAsJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAsCsv = async () => {
    const header = "姓,名,性別,年齢,生年月日,郵便番号,住所,電話番号,メール";
    const rows = data.map(
      (d) => `${d.lastName},${d.firstName},${d.gender},${d.age},${d.birthday},${d.postalCode},${d.address},${d.phone},${d.email}`
    );
    await navigator.clipboard.writeText([header, ...rows].join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="ダミーデータ生成（日本向け）"
      description="テスト用の日本人の名前・住所・電話番号・メールアドレスなどのダミーデータを生成します。"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">生成件数</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
            min={1}
            max={100}
            className="w-24 rounded-md p-2 font-mono text-sm"
          />
          <button
            onClick={generate}
            className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            生成する
          </button>
        </div>

        {data.length > 0 && (
          <>
            <div className="flex gap-2">
              <button
                onClick={copyAsJson}
                className="rounded-md border border-card-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent-bg transition-colors"
              >
                {copied ? "コピー済み！" : "JSONでコピー"}
              </button>
              <button
                onClick={copyAsCsv}
                className="rounded-md border border-card-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent-bg transition-colors"
              >
                CSVでコピー
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-card-border bg-card">
                    <th className="text-left py-2 px-3">#</th>
                    <th className="text-left py-2 px-3">氏名</th>
                    <th className="text-left py-2 px-3">性別</th>
                    <th className="text-left py-2 px-3">年齢</th>
                    <th className="text-left py-2 px-3">生年月日</th>
                    <th className="text-left py-2 px-3">郵便番号</th>
                    <th className="text-left py-2 px-3">住所</th>
                    <th className="text-left py-2 px-3">電話番号</th>
                    <th className="text-left py-2 px-3">メール</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((d, i) => (
                    <tr key={i} className="border-b border-card-border hover:bg-accent-bg">
                      <td className="py-2 px-3 text-muted">{i + 1}</td>
                      <td className="py-2 px-3 font-medium whitespace-nowrap">
                        {d.lastName} {d.firstName}
                      </td>
                      <td className="py-2 px-3">{d.gender}</td>
                      <td className="py-2 px-3 font-mono">{d.age}</td>
                      <td className="py-2 px-3 font-mono whitespace-nowrap">{d.birthday}</td>
                      <td className="py-2 px-3 font-mono whitespace-nowrap">{d.postalCode}</td>
                      <td className="py-2 px-3 whitespace-nowrap">{d.address}</td>
                      <td className="py-2 px-3 font-mono whitespace-nowrap">{d.phone}</td>
                      <td className="py-2 px-3 font-mono">{d.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
