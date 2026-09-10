import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { adminTrials } from "@/lib/content";
import { TrialStatusBadge } from "@/components/admin/TrialStatusBadge";
import type { AdminTrialItem } from "@/lib/admin/trial-actions";

/** 申し込み日時を「2026/09/11 14:30」の形にする */
function formatCreatedAt(iso: string) {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function TrialList({ items }: { items: AdminTrialItem[] }) {
  if (items.length === 0) {
    return (
      <p className="mt-6 rounded-2xl bg-white p-6 text-center text-[13px] font-bold text-ink-muted shadow-sm ring-1 ring-sakura-100">
        {adminTrials.emptyMessage}
      </p>
    );
  }

  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={`/admin/trials/${item.id}`}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-sakura-100 transition hover:shadow-md"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <time className="text-xs font-bold text-ink-muted">
                  {formatCreatedAt(item.createdAt)}
                </time>
                <TrialStatusBadge status={item.status} />
              </div>
              <p className="mt-1.5 truncate text-[14px] font-bold text-ink">
                {item.name} ／ {item.subject}（{item.targetGrade}）
              </p>
              <p className="mt-0.5 truncate text-[12px] text-ink-muted">
                希望日時：{item.preferredDate} {item.preferredTime}
              </p>
            </div>
            <ChevronRight className="size-5 shrink-0 text-sakura-400" strokeWidth={2.5} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
