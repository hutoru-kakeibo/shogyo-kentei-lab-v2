import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { admin } from "@/lib/content";

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-round text-2xl font-bold text-ink">{admin.title}</h1>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {admin.sections.map((section) => (
          <li key={section.id}>
            <Link
              href={section.href}
              className="flex items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100 transition hover:shadow-lg"
            >
              <div>
                <p className="font-round text-base font-bold text-ink">{section.label}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
                  {section.description}
                </p>
              </div>
              <ChevronRight className="size-5 shrink-0 text-sakura-400" strokeWidth={2.5} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
