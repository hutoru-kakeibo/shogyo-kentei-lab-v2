"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { adminVoices } from "@/lib/content";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { deleteVoice } from "@/lib/admin/voice-actions";
import type { VoiceItem } from "@/lib/voice";

export function VoiceList({ items }: { items: VoiceItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (item: VoiceItem) => {
    if (!window.confirm(adminVoices.deleteConfirm)) return;

    setDeletingId(item.id);
    startTransition(async () => {
      const result = await deleteVoice(item.id);
      setDeletingId(null);
      if (result.ok) router.refresh();
    });
  };

  return (
    <div>
      <div className="flex justify-end">
        <Link
          href="/admin/voices/new"
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-sakura-400 to-sakura-600 px-5 py-2.5 font-round text-[13px] font-bold text-white shadow-md shadow-sakura-600/30"
        >
          <Plus className="size-4" strokeWidth={3} />
          {adminVoices.newLabel}
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-white p-6 text-center text-[13px] font-bold text-ink-muted shadow-sm ring-1 ring-sakura-100">
          {adminVoices.emptyMessage}
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-sakura-100"
            >
              {item.photo ? (
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-sakura-100">
                  <Image
                    src={item.photo}
                    alt={`${item.name}の写真`}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <ImagePlaceholder
                  label={`${item.name}の写真`}
                  icon="PartyPopper"
                  tone={item.tone}
                  showLabel={false}
                  className="size-12 shrink-0 rounded-full ring-2 ring-sakura-100"
                />
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold text-ink">{item.gradeLabel}</p>
                <p className="mt-0.5 truncate text-[12px] text-ink-muted">
                  {item.name} ／ {item.bio}
                </p>
              </div>

              <button
                type="button"
                aria-label={adminVoices.deleteLabel}
                onClick={() => handleDelete(item)}
                disabled={isPending && deletingId === item.id}
                className="grid size-9 shrink-0 place-items-center rounded-full bg-sakura-100 text-sakura-600 disabled:opacity-50"
              >
                <Trash2 className="size-4" strokeWidth={2.5} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
