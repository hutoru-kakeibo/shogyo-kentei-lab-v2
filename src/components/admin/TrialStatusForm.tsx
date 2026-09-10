"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, CircleCheck } from "lucide-react";
import { adminTrials } from "@/lib/content";
import { updateTrialStatus, type TrialStatus } from "@/lib/admin/trial-actions";

export function TrialStatusForm({ id, status }: { id: string; status: TrialStatus }) {
  const router = useRouter();
  const [value, setValue] = useState<TrialStatus>(status);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setDone(false);
    setSubmitting(true);

    const result = await updateTrialStatus(id, value);

    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setDone(true);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
      <label htmlFor="status" className="font-round text-[14px] font-bold text-ink">
        {adminTrials.statusLabel}
      </label>
      <select
        id="status"
        value={value}
        onChange={(event) => setValue(event.target.value as TrialStatus)}
        className="rounded-xl border border-sakura-200 bg-white px-4 py-2.5 text-[14px] text-ink outline-none focus:border-sakura-400 focus:ring-2 focus:ring-sakura-200"
      >
        {adminTrials.statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-gradient-to-r from-sakura-400 to-sakura-600 px-5 py-2.5 font-round text-[13px] font-bold text-white shadow-md shadow-sakura-600/30 transition active:translate-y-0.5 disabled:opacity-60"
      >
        {submitting ? adminTrials.updatingLabel : adminTrials.updateSubmitLabel}
      </button>

      {done ? (
        <span className="flex items-center gap-1 text-[12px] font-bold text-mint-500">
          <CircleCheck className="size-4" strokeWidth={2.5} />
          {adminTrials.updatedLabel}
        </span>
      ) : null}
      {error ? (
        <span className="flex items-center gap-1 text-[12px] font-bold text-sakura-600">
          <CircleAlert className="size-4" strokeWidth={2.5} />
          {error}
        </span>
      ) : null}
    </form>
  );
}
