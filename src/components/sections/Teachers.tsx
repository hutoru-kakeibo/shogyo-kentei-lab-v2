import Image from "next/image";
import { teachers } from "@/lib/content";
import { ImagePlaceholder, type PlaceholderTone } from "@/components/ui/ImagePlaceholder";

/** 項目見出しの色（左の縦バー） */
const labelTone: Record<PlaceholderTone, string> = {
  sakura: "before:bg-sakura-400 text-sakura-600",
  lemon: "before:bg-lemon-400 text-lemon-600",
  sky: "before:bg-sky-400 text-sky-600",
  mint: "before:bg-mint-300 text-mint-500",
};

/** 保有資格タグの色 */
const tagTone: Record<PlaceholderTone, string> = {
  sakura: "bg-sakura-100 text-sakura-600",
  lemon: "bg-lemon-100 text-ink",
  sky: "bg-sky-100 text-sky-600",
  mint: "bg-mint-100 text-mint-500",
};

function FieldLabel({ tone, children }: { tone: PlaceholderTone; children: string }) {
  return (
    <dt
      className={`flex items-center font-round text-[13px] font-bold before:mr-2 before:h-4 before:w-1 before:rounded-full before:content-[''] ${labelTone[tone]}`}
    >
      {children}
    </dt>
  );
}

export function Teachers() {
  return (
    <section id="teachers" className="bg-white px-5 py-14">
      <div className="text-center">
        <h2 className="font-round text-3xl font-bold tracking-tight text-ink">{teachers.title}</h2>
        <p className="mt-1 font-script text-xl font-bold tracking-widest text-ink-muted">
          {teachers.englishTitle}
        </p>
        <p className="mt-4 whitespace-pre-line text-[13px] font-bold leading-relaxed text-ink-muted">
          {teachers.lead}
        </p>
      </div>

      <ul className="mt-8 space-y-8">
        {teachers.items.map((teacher) => (
          <li
            key={teacher.id}
            className="overflow-hidden rounded-3xl bg-canvas shadow-md shadow-sakura-600/10 ring-1 ring-sakura-100"
          >
            {/* 写真（1:1）。photo が未設定の講師はプレースホルダーを表示する */}
            {teacher.photo ? (
              <div className="relative aspect-square w-full">
                <Image
                  src={teacher.photo}
                  alt={teacher.imageLabel}
                  fill
                  sizes="(max-width: 480px) 100vw, 480px"
                  className="object-cover"
                />
              </div>
            ) : (
              <ImagePlaceholder
                label={teacher.imageLabel}
                icon="GraduationCap"
                tone={teacher.tone}
                className="aspect-square w-full"
              />
            )}

            <div className="p-5">
              {/* 氏名 */}
              <p className="font-round text-2xl font-bold text-ink">{teacher.name}</p>

              <dl className="mt-4 space-y-4">
                {/* 出身校名 */}
                <div>
                  <FieldLabel tone={teacher.tone}>{teachers.labels.school}</FieldLabel>
                  <dd className="mt-1.5 text-[13px] font-bold leading-relaxed text-ink">
                    {teacher.school}
                  </dd>
                </div>

                {/* 保有資格 */}
                <div>
                  <FieldLabel tone={teacher.tone}>{teachers.labels.qualifications}</FieldLabel>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {teacher.qualifications.map((qualification) => (
                      <span
                        key={qualification}
                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${tagTone[teacher.tone]}`}
                      >
                        {qualification}
                      </span>
                    ))}
                  </dd>
                </div>

                {/* 自己紹介 */}
                <div>
                  <FieldLabel tone={teacher.tone}>{teachers.labels.intro}</FieldLabel>
                  <dd className="mt-1.5 whitespace-pre-line rounded-2xl bg-white p-4 text-[13px] leading-relaxed text-ink-muted shadow-sm">
                    {teacher.intro}
                  </dd>
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
