/**
 * サイトに「どこから来たか」（流入元）を、ブラウザの中に覚えておく。
 * 無料体験の申し込みのときに一緒に保存して、どの経路から申し込みがあったかを見られるようにする。
 *
 * 覚えるのは utm の値・参照元のドメイン・最初に開いたページのパス・日時だけ。
 * 氏名などの個人情報や、URLの検索文字列（? 以降）そのものは入れない。
 */

export type VisitSource = {
  /** utm_source。無ければ参照元から判断した値（google・instagram など）、どちらも無ければ "direct" */
  source: string;
  /** utm_medium。無ければ "organic"（検索）・"social"・"referral"・"none"（直接） */
  medium: string;
  /** utm_campaign（無ければ空） */
  campaign: string;
  /** 参照元のドメイン（自分のサイト内の移動や、参照元が無いときは空） */
  referrer: string;
  /** そのとき最初に開いたページのパス */
  landing: string;
  /** 来た日時（ISO 形式） */
  at: string;
};

/** そのブラウザで初めて来たとき（上書きしない） */
const FIRST_KEY = "skl_first_touch";
/** いちばん最近、外から来たとき（外から来るたびに上書きする） */
const LAST_KEY = "skl_last_touch";

const MAX_LENGTH = 100;

/** 参照元のドメインと、そのときの source の名前 */
const searchDomains: [string, string][] = [
  ["bing.com", "bing"],
  ["yahoo.co.jp", "yahoo"],
  ["yahoo.com", "yahoo"],
  ["duckduckgo.com", "duckduckgo"],
  ["ecosia.org", "ecosia"],
];
const socialDomains: [string, string][] = [
  ["instagram.com", "instagram"],
  ["facebook.com", "facebook"],
  ["t.co", "x"],
  ["twitter.com", "x"],
  ["x.com", "x"],
  ["line.me", "line"],
  ["tiktok.com", "tiktok"],
  ["youtube.com", "youtube"],
  ["threads.net", "threads"],
];

function clean(value: string | null | undefined) {
  return (value ?? "").replace(/[\u0000-\u001f]/g, "").trim().slice(0, MAX_LENGTH);
}

/** host がそのドメインか、そのサブドメイン（l.instagram.com など）か */
function isDomain(host: string, domain: string) {
  return host === domain || host.endsWith(`.${domain}`);
}

/** 参照元のドメインから、utm が無いときの source・medium を決める */
function classify(referrer: string) {
  if (!referrer) return { source: "direct", medium: "none" };
  const host = referrer.toLowerCase();
  // Google は国ごとにドメインが違う（google.com・google.co.jp など）
  if (/(^|\.)google\.[a-z.]+$/.test(host)) return { source: "google", medium: "organic" };
  const search = searchDomains.find(([domain]) => isDomain(host, domain));
  if (search) return { source: search[1], medium: "organic" };
  const social = socialDomains.find(([domain]) => isDomain(host, domain));
  if (social) return { source: social[1], medium: "social" };
  return { source: host, medium: "referral" };
}

function read(storage: Storage, key: string): VisitSource | null {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as VisitSource) : null;
  } catch {
    return null;
  }
}

function write(storage: Storage, key: string, value: VisitSource) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // プライベートブラウズなどで保存できないときは、記録しないだけにする
  }
}

/**
 * いま開いたページの流入元を覚える。ページを開くたびに呼んでよい。
 * サイト内の移動（参照元が自分のサイトで utm も無い）では何も変えない。
 */
export function rememberVisitSource() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  let referrer = "";
  try {
    const host = document.referrer ? new URL(document.referrer).hostname : "";
    referrer = host && host !== window.location.hostname ? clean(host) : "";
  } catch {
    referrer = "";
  }

  const utmSource = clean(params.get("utm_source"));
  const fromOutside = Boolean(utmSource || referrer);

  let first: VisitSource | null = null;
  let storage: Storage | null = null;
  try {
    storage = window.localStorage;
    first = read(storage, FIRST_KEY);
  } catch {
    storage = null;
  }
  if (!storage) return;

  // サイト内の移動は、すでに記録があれば何もしない
  if (!fromOutside && first) return;

  const guessed = classify(referrer);
  const visit: VisitSource = {
    source: utmSource || guessed.source,
    medium: clean(params.get("utm_medium")) || (utmSource ? "" : guessed.medium),
    campaign: clean(params.get("utm_campaign")),
    referrer,
    landing: clean(window.location.pathname),
    at: new Date().toISOString(),
  };

  if (!first) write(storage, FIRST_KEY, visit);
  // 直接来た（参照元も utm も無い）ときは、前に外から来た記録を残しておく
  if (fromOutside || !read(storage, LAST_KEY)) write(storage, LAST_KEY, visit);
}

/** 申し込みと一緒に送る流入元（記録が無ければ null） */
export function loadVisitSources(): { first: VisitSource | null; last: VisitSource | null } {
  if (typeof window === "undefined") return { first: null, last: null };
  try {
    const storage = window.localStorage;
    return { first: read(storage, FIRST_KEY), last: read(storage, LAST_KEY) };
  } catch {
    return { first: null, last: null };
  }
}

const sourceKeys: (keyof VisitSource)[] = ["source", "medium", "campaign", "referrer", "landing", "at"];

/**
 * ブラウザから届いた流入元を、決まった項目・長さだけに整える（サーバー側で使う）。
 * 形がおかしいときは null。
 */
export function sanitizeVisitSource(value: unknown): VisitSource | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const result = Object.fromEntries(
    sourceKeys.map((key) => [key, typeof record[key] === "string" ? clean(record[key] as string) : ""]),
  ) as VisitSource;
  if (!result.source) return null;
  if (result.at && Number.isNaN(Date.parse(result.at))) result.at = "";
  return result;
}
