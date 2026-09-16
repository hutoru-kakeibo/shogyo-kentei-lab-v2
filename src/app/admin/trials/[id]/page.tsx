import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Mail, Phone } from "lucide-react";
import { adminTrials } from "@/lib/content";
import { getTrialForAdmin } from "@/lib/admin/trial-actions";
import { TrialStatusForm } from "@/components/admin/TrialStatusForm";
import { TrialKindBadge } from "@/components/admin/TrialKindBadge";

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 border-b border-sakura-100 px-4 py-3 last:border-b-0">
      <dt className="w-24 shrink-0 text-[12px] font-bold text-ink-muted">{label}</dt>
      <dd className="flex-1 whitespace-pre-line text-[13px] font-bold leading-relaxed text-ink">
        {value}
      </dd>
    </div>
  );
}

export default async function AdminTrialDetailPage({
  params,
}: PageProps<"/admin/trials/[id]">) {
  const { id } = await params;
  const item = await getTrialForAdmin(id);

  if (!item) notFound();

  const { fields } = adminTrials;
  const kindLabel =
    adminTrials.kindOptions.find((option) => option.value === item.kind)?.label ??
    adminTrials.kindOptions[0].label;

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/admin/trials"
        className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted"
      >
        <ChevronLeft className="size-4" strokeWidth={3} />
        {adminTrials.backLabel}
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-round text-2xl font-bold text-ink">{item.name} さん</h1>
        <TrialKindBadge kind={item.kind} />
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100">
        <TrialStatusForm id={item.id} status={item.status} />
      </div>

      <dl className="mt-6 overflow-hidden rounded-2xl bg-white shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100">
        <FieldRow label={fields.kind} value={kindLabel} />
        <FieldRow label={fields.subject} value={item.subject} />
        <FieldRow label={fields.targetGrade} value={item.targetGrade} />
        <FieldRow label={fields.name} value={item.name} />
        <FieldRow label={fields.kana} value={item.kana || adminTrials.noMessage} />
        <FieldRow label={fields.gradeYear} value={item.gradeYear} />
        <FieldRow label={fields.school} value={item.school} />
        <FieldRow label={fields.email} value={item.email} />
        <FieldRow label={fields.tel} value={item.tel || adminTrials.noTel} />
        <FieldRow
          label={fields.preferred}
          value={`${item.preferredDate} ${item.preferredTime}`}
        />
        <FieldRow label={fields.message} value={item.message || adminTrials.noMessage} />
        <FieldRow label={fields.createdAt} value={new Date(item.createdAt).toLocaleString("ja-JP")} />
      </dl>

      {/* 連絡用のショートカット */}
      <div className="mt-4 flex gap-3">
        <a
          href={`mailto:${item.email}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-sky-100 px-5 py-3 font-round text-[13px] font-bold text-sky-600"
        >
          <Mail className="size-4" strokeWidth={2.5} />
          メールする
        </a>
        {item.tel ? (
          <a
            href={`tel:${item.tel}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-mint-100 px-5 py-3 font-round text-[13px] font-bold text-mint-500"
          >
            <Phone className="size-4" strokeWidth={2.5} />
            電話する
          </a>
        ) : null}
      </div>
    </div>
  );
}
