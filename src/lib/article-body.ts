/**
 * コラム本文の記法（管理画面で入力する文字列）を、表示用のブロックに変換する。
 *
 *   ## 見出し / ### 小見出し
 *   - 箇条書き（「・」始まりも可）
 *   1. 番号付きリスト
 *   **太字**
 *   [リンクの文字](https://... または /trial のようなサイト内パス)
 *   空行で段落を区切る
 *
 * HTMLとしては解釈しないので、本文に <script> などを書いてもそのまま文字として表示される。
 */

export type InlineNode =
  | { type: "text"; text: string }
  | { type: "strong"; text: string }
  | { type: "link"; href: string; text: string };

export type BodyBlock =
  | { type: "h2"; content: InlineNode[] }
  | { type: "h3"; content: InlineNode[] }
  | { type: "paragraph"; lines: InlineNode[][] }
  | { type: "list"; ordered: boolean; items: InlineNode[][] };

const LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** javascript: などの危険なURLを弾き、外部の http(s) かサイト内パスだけ許可する */
function isSafeHref(href: string) {
  return /^https?:\/\//.test(href) || (href.startsWith("/") && !href.startsWith("//"));
}

function parseBold(text: string): InlineNode[] {
  // split に捕捉グループを渡すと、奇数番目が ** で囲まれた部分になる
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((part, index): InlineNode | null => {
      if (!part) return null;
      return index % 2 === 1 ? { type: "strong", text: part } : { type: "text", text: part };
    })
    .filter((node): node is InlineNode => node !== null);
}

export function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(LINK_PATTERN)) {
    const [raw, label, href] = match;
    const start = match.index ?? 0;

    nodes.push(...parseBold(text.slice(cursor, start)));
    if (isSafeHref(href)) {
      nodes.push({ type: "link", href, text: label });
    } else {
      nodes.push(...parseBold(raw));
    }
    cursor = start + raw.length;
  }

  nodes.push(...parseBold(text.slice(cursor)));
  return nodes;
}

type ListBlock = Extract<BodyBlock, { type: "list" }>;

export function parseArticleBody(source: string): BodyBlock[] {
  const blocks: BodyBlock[] = [];
  let paragraph: string[] = [];
  let list: ListBlock | null = null;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: "paragraph", lines: paragraph.map(parseInline) });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };

  for (const rawLine of source.replace(/\r\n?/g, "\n").split("\n")) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    // 本文の見出しは h2 から始める（h1 は記事タイトル）。「# 」も大見出しとして扱う
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: heading[1].length === 3 ? "h3" : "h2", content: parseInline(heading[2]) });
      continue;
    }

    const bullet = /^(?:-\s+|・\s*)(.+)$/.exec(line);
    // 「1.5倍」のような文を誤ってリスト扱いしないよう、半角ピリオドの後は空白を必須にする
    const numbered = /^\d+(?:\.\s+|．\s*|[)）]\s*)(.+)$/.exec(line);
    const listMatch = bullet ?? numbered;
    if (listMatch) {
      flushParagraph();
      const ordered = !bullet;
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { type: "list", ordered, items: [] };
      }
      list.items.push(parseInline(listMatch[1]));
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}
