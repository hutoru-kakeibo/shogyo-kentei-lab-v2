import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { adminSubjects } from "@/lib/content";
import { getSubjectForAdmin } from "@/lib/admin/subject-actions";
import { SubjectForm } from "@/components/admin/SubjectForm";

export default async function AdminSubjectEditPage({
  params,
}: PageProps<"/admin/subjects/[slug]/edit">) {
  const { slug } = await params;
  const subject = await getSubjectForAdmin(slug);

  if (!subject) notFound();

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/admin/subjects"
        className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted"
      >
        <ChevronLeft className="size-4" strokeWidth={3} />
        {adminSubjects.title}に戻る
      </Link>
      <h1 className="mt-4 font-round text-2xl font-bold text-ink">
        {subject.name}
        <span className="ml-2 text-[13px] font-bold text-ink-muted">{adminSubjects.editLabel}</span>
      </h1>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100">
        <SubjectForm initial={subject} />
      </div>
    </div>
  );
}
