import { Fragment } from "react";
import Link from "next/link";
import { parseArticleBody, type InlineNode } from "@/lib/article-body";

const linkClass = "font-bold text-sakura-600 underline decoration-sakura-300 underline-offset-4";

/** 目次から飛ぶための、大見出しの id（1番目の大見出しが section-1） */
const sectionId = (order: number) => `section-${order}`;

/** 本文の大見出しの一覧（目次用）。文字だけにして返す */
export function articleHeadings(source: string) {
  return parseArticleBody(source).flatMap((block) =>
    block.type === "h2" ? [block.content.map((node) => node.text).join("")] : [],
  );
}

function Inline({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((node, index) => {
        if (node.type === "strong") {
          return (
            <strong
              key={index}
              className="bg-[linear-gradient(transparent_62%,var(--color-sakura-200)_62%)] font-bold"
            >
              {node.text}
            </strong>
          );
        }
        if (node.type === "link") {
          return node.href.startsWith("/") ? (
            <Link key={index} href={node.href} className={linkClass}>
              {node.text}
            </Link>
          ) : (
            <a
              key={index}
              href={node.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {node.text}
            </a>
          );
        }
        return <Fragment key={index}>{node.text}</Fragment>;
      })}
    </>
  );
}

/**
 * コラム本文。公開ページと管理画面のプレビューで同じ見た目にするため共通化している。
 * 色は Tailwind の色名で書く（公開ページではオレンジ系に置き換わる。lp.module.css の .root）
 */
export function ArticleBody({ source }: { source: string }) {
  const blocks = parseArticleBody(source);

  return (
    <div className="space-y-5 text-[15.5px] leading-[1.95] text-ink">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={index}
                id={sectionId(blocks.slice(0, index + 1).filter((b) => b.type === "h2").length)}
                className="mt-12 scroll-mt-[76px] rounded-md border-l-[6px] border-sakura-400 bg-ink px-4 py-3 text-[18px] font-black leading-[1.55] text-white [word-break:auto-phrase] first:mt-0"
              >
                <Inline nodes={block.content} />
              </h2>
            );
          case "h3":
            return (
              <h3
                key={index}
                className="mt-9 border-b-2 border-ink pb-1.5 text-[16.5px] font-black leading-[1.55] [word-break:auto-phrase] first:mt-0"
              >
                <Inline nodes={block.content} />
              </h3>
            );
          case "list": {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag
                key={index}
                className="space-y-2.5 rounded-xl border-2 border-ink bg-white p-4 text-[15px] leading-[1.8]"
              >
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-2.5">
                    {block.ordered ? (
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-sakura-500 text-[12px] font-bold leading-none text-white">
                        {itemIndex + 1}
                      </span>
                    ) : (
                      <span className="mt-[0.65em] size-2 shrink-0 rounded-[2px] bg-sakura-400" />
                    )}
                    <span className="min-w-0 flex-1">
                      <Inline nodes={item} />
                    </span>
                  </li>
                ))}
              </ListTag>
            );
          }
          default:
            return (
              <p key={index}>
                {block.lines.map((line, lineIndex) => (
                  <Fragment key={lineIndex}>
                    {lineIndex > 0 ? <br /> : null}
                    <Inline nodes={line} />
                  </Fragment>
                ))}
              </p>
            );
        }
      })}
    </div>
  );
}
