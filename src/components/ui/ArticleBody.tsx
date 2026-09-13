import { Fragment } from "react";
import Link from "next/link";
import { parseArticleBody, type InlineNode } from "@/lib/article-body";

const linkClass = "font-bold text-sky-600 underline decoration-sky-300 underline-offset-4";

function Inline({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((node, index) => {
        if (node.type === "strong") {
          return (
            <strong
              key={index}
              className="bg-[linear-gradient(transparent_60%,var(--color-lemon-300)_60%)] font-bold"
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

/** コラム本文。公開ページと管理画面のプレビューで同じ見た目にするため共通化している */
export function ArticleBody({ source }: { source: string }) {
  const blocks = parseArticleBody(source);

  return (
    <div className="space-y-5 text-[15px] leading-[1.9] text-ink">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={index}
                className="mt-10 flex gap-2.5 rounded-2xl bg-sakura-50 px-4 py-3 font-round text-xl font-bold leading-snug first:mt-0 before:mt-0.5 before:h-5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-sakura-400 before:content-['']"
              >
                <span>
                  <Inline nodes={block.content} />
                </span>
              </h2>
            );
          case "h3":
            return (
              <h3
                key={index}
                className="mt-8 border-b-2 border-dotted border-sakura-200 pb-1 font-round text-lg font-bold leading-snug first:mt-0"
              >
                <Inline nodes={block.content} />
              </h3>
            );
          case "list": {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag key={index} className="space-y-2 rounded-2xl bg-canvas p-4 ring-1 ring-sakura-100">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-2.5">
                    {block.ordered ? (
                      <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-sakura-500 text-[12px] font-bold leading-none text-white">
                        {itemIndex + 1}
                      </span>
                    ) : (
                      <span className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-sakura-400" />
                    )}
                    <span className="flex-1">
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
