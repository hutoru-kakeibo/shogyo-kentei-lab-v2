import { adminTrials } from "@/lib/content";
import type { ApplicationKind } from "@/lib/trial-actions";

/** 申し込みの種別（無料体験 / 授業）のバッジ */
export function TrialKindBadge({ kind }: { kind: ApplicationKind }) {
  const option =
    adminTrials.kindOptions.find((candidate) => candidate.value === kind) ??
    adminTrials.kindOptions[0];

  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${option.badgeClass}`}>
      {option.label}
    </span>
  );
}
