import { adminTrials } from "@/lib/content";
import type { TrialStatus } from "@/lib/admin/trial-actions";

export function TrialStatusBadge({ status }: { status: TrialStatus }) {
  const option = adminTrials.statusOptions.find((item) => item.value === status);
  if (!option) return null;

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${option.badgeClass}`}>
      {option.label}
    </span>
  );
}
