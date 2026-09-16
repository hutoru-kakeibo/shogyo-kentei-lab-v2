"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, CircleCheck, Plus, X } from "lucide-react";
import { adminTrialSettings } from "@/lib/content";
import { updateTrialSettings } from "@/lib/admin/trial-settings-actions";
import type { TakenSlots } from "@/lib/trial-actions";
import {
  DATE_PATTERN,
  TIME_PATTERN,
  bookableRange,
  todayInJapan,
  type TrialSchedule,
} from "@/lib/trial-schedule";
import { TrialDateOverridesEditor } from "@/components/admin/TrialDateOverridesEditor";

const inputClass =
  "w-full rounded-xl border border-sakura-200 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-sakura-400 focus:ring-2 focus:ring-sakura-200";

const { fields, sections, presetTimes, weekdayNames, dateOverrideEditor } = adminTrialSettings;

/** 2026-09-16 → 9/16（水） */
function formatShortDate(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  const weekday = ["日", "月", "火", "水", "木", "金", "土"][new Date(year, month - 1, day).getDay()];
  return `${month}/${day}（${weekday}）`;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center font-round text-lg font-bold text-ink before:mr-2 before:h-5 before:w-1.5 before:rounded-full before:bg-sakura-400 before:content-['']">
      {children}
    </h2>
  );
}

export function TrialSettingsForm({
  initial,
  takenSlots,
}: {
  initial: TrialSchedule;
  /** すでに申し込みが入っている日時（日ごとの受付時間カレンダーに表示する） */
  takenSlots: TakenSlots;
}) {
  const router = useRouter();
  const [leadDays, setLeadDays] = useState(String(initial.leadDays));
  const [rangeDays, setRangeDays] = useState(String(initial.rangeDays));
  const [slotsByWeekday, setSlotsByWeekday] = useState<string[][]>(initial.slotsByWeekday);
  const [closedDates, setClosedDates] = useState<string[]>(initial.closedDates);
  const [dateOverrides, setDateOverrides] = useState<Record<string, string[]>>(
    initial.dateOverrides,
  );
  const [customTimes, setCustomTimes] = useState<string[]>(() => Array(7).fill(""));
  const [newClosedDate, setNewClosedDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const today = todayInJapan();
  const lead = Number(leadDays);
  const range = Number(rangeDays);
  const rangeValid =
    Number.isInteger(lead) && Number.isInteger(range) && lead >= 0 && range >= 1 && lead <= range;
  const preview = rangeValid
    ? bookableRange(
        { leadDays: lead, rangeDays: range, slotsByWeekday, closedDates, dateOverrides },
        today,
      )
    : null;

  const setSlotsFor = (weekday: number, next: string[]) => {
    setSlotsByWeekday((current) =>
      current.map((slots, index) => (index === weekday ? [...new Set(next)].sort() : slots)),
    );
    setResult(null);
  };

  const toggleSlot = (weekday: number, time: string) => {
    const slots = slotsByWeekday[weekday];
    setSlotsFor(weekday, slots.includes(time) ? slots.filter((slot) => slot !== time) : [...slots, time]);
  };

  const addCustomTime = (weekday: number) => {
    const time = customTimes[weekday];
    if (!TIME_PATTERN.test(time)) return;
    setSlotsFor(weekday, [...slotsByWeekday[weekday], time]);
    setCustomTimes((current) => current.map((value, index) => (index === weekday ? "" : value)));
  };

  const updateClosedDates = (next: string[]) => {
    setClosedDates(next);
    setResult(null);
  };

  const updateDateOverrides = (next: Record<string, string[]>) => {
    setDateOverrides(next);
    setResult(null);
  };

  const addClosedDate = () => {
    if (!DATE_PATTERN.test(newClosedDate)) return;
    updateClosedDates([...new Set([...closedDates, newClosedDate])].sort());
    setNewClosedDate("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setResult(null);

    const response = await updateTrialSettings({
      leadDays: lead,
      rangeDays: range,
      slotsByWeekday,
      closedDates,
      dateOverrides,
    });

    setSaving(false);
    setResult(
      response.ok
        ? { ok: true, message: adminTrialSettings.savedLabel }
        : { ok: false, message: response.message },
    );
    if (response.ok) router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10">
      <p className="rounded-2xl bg-lemon-50 p-4 text-[13px] leading-relaxed text-ink ring-1 ring-lemon-200">
        {adminTrialSettings.notice}
      </p>

      {/* 受付期間 */}
      <section className="space-y-4">
        <SectionTitle>{sections.range}</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="leadDays" className="mb-1.5 block font-round text-[14px] font-bold text-ink">
              {fields.leadDays}
            </label>
            <div className="flex items-center gap-2">
              <input
                id="leadDays"
                type="number"
                inputMode="numeric"
                min={0}
                max={60}
                value={leadDays}
                onChange={(event) => {
                  setLeadDays(event.target.value);
                  setResult(null);
                }}
                className={inputClass}
              />
              <span className="shrink-0 text-[14px] font-bold text-ink-muted">{fields.daysUnit}</span>
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">{fields.leadDaysHint}</p>
          </div>
          <div>
            <label htmlFor="rangeDays" className="mb-1.5 block font-round text-[14px] font-bold text-ink">
              {fields.rangeDays}
            </label>
            <div className="flex items-center gap-2">
              <input
                id="rangeDays"
                type="number"
                inputMode="numeric"
                min={1}
                max={365}
                value={rangeDays}
                onChange={(event) => {
                  setRangeDays(event.target.value);
                  setResult(null);
                }}
                className={inputClass}
              />
              <span className="shrink-0 text-[14px] font-bold text-ink-muted">{fields.daysUnit}</span>
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">{fields.rangeDaysHint}</p>
          </div>
        </div>
        <p
          className={`rounded-xl px-4 py-3 text-[13px] font-bold ${
            preview ? "bg-mint-100 text-ink" : "bg-sakura-100 text-sakura-600"
          }`}
        >
          {preview
            ? `${fields.previewPrefix}${formatShortDate(preview.from)} 〜 ${formatShortDate(preview.to)}`
            : adminTrialSettings.errors.range}
        </p>
      </section>

      {/* 曜日ごとの受付時間 */}
      <section className="space-y-4">
        <SectionTitle>{sections.weekly}</SectionTitle>
        <p className="text-[12px] leading-relaxed text-ink-muted">{fields.weeklyHint}</p>

        <ul className="space-y-4">
          {weekdayNames.map((weekdayName, weekday) => {
            const slots = slotsByWeekday[weekday];
            const extraSlots = slots.filter((slot) => !(presetTimes as readonly string[]).includes(slot));
            return (
              <li key={weekdayName} className="rounded-2xl bg-canvas p-4 ring-1 ring-sakura-100">
                <div className="flex items-center justify-between gap-3">
                  <p
                    className={`font-round text-[15px] font-bold ${
                      weekday === 0 ? "text-sakura-600" : weekday === 6 ? "text-sky-600" : "text-ink"
                    }`}
                  >
                    {weekdayName}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        slots.length > 0 ? "bg-mint-100 text-mint-500" : "bg-ink-muted/10 text-ink-muted"
                      }`}
                    >
                      {slots.length > 0 ? `${slots.length}${fields.slotCountSuffix}` : fields.noSlots}
                    </span>
                    {slots.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => setSlotsFor(weekday, [])}
                        className="text-[11px] font-bold text-ink-muted underline underline-offset-2"
                      >
                        {fields.clearDay}
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-7">
                  {presetTimes.map((presetTime) => {
                    const active = slots.includes(presetTime);
                    return (
                      <button
                        key={presetTime}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleSlot(weekday, presetTime)}
                        className={`rounded-lg py-2 text-[13px] font-bold transition ${
                          active
                            ? "bg-sakura-500 text-white shadow-sm"
                            : "bg-white text-ink-muted ring-1 ring-sakura-100"
                        }`}
                      >
                        {presetTime}
                      </button>
                    );
                  })}
                </div>

                {extraSlots.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {extraSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => toggleSlot(weekday, slot)}
                        aria-label={`${slot} ${fields.removeLabel}`}
                        className="flex items-center gap-1 rounded-lg bg-sakura-500 px-2.5 py-1.5 text-[13px] font-bold text-white"
                      >
                        {slot}
                        <X className="size-3.5" strokeWidth={3} />
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="mt-3 flex items-center gap-2">
                  <label htmlFor={`custom-${weekday}`} className="sr-only">
                    {weekdayName} {fields.customTime}
                  </label>
                  <input
                    id={`custom-${weekday}`}
                    type="time"
                    step={300}
                    value={customTimes[weekday]}
                    onChange={(event) =>
                      setCustomTimes((current) =>
                        current.map((value, index) => (index === weekday ? event.target.value : value)),
                      )
                    }
                    className="w-32 rounded-lg border border-sakura-200 bg-white px-3 py-1.5 text-[13px] text-ink outline-none focus:border-sakura-400"
                  />
                  <button
                    type="button"
                    onClick={() => addCustomTime(weekday)}
                    disabled={!TIME_PATTERN.test(customTimes[weekday])}
                    className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-[12px] font-bold text-sakura-600 ring-1 ring-sakura-200 disabled:opacity-40"
                  >
                    <Plus className="size-3.5" strokeWidth={3} />
                    {fields.customTime}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 日ごとの受付時間 */}
      <section className="space-y-4">
        <SectionTitle>{dateOverrideEditor.title}</SectionTitle>
        <p className="text-[12px] leading-relaxed text-ink-muted">{dateOverrideEditor.hint}</p>
        <TrialDateOverridesEditor
          today={today}
          slotsByWeekday={slotsByWeekday}
          dateOverrides={dateOverrides}
          closedDates={closedDates}
          takenSlots={takenSlots}
          onDateOverridesChange={updateDateOverrides}
          onClosedDatesChange={updateClosedDates}
        />
      </section>

      {/* 休講日 */}
      <section className="space-y-4">
        <SectionTitle>{sections.closed}</SectionTitle>
        <p className="text-[12px] leading-relaxed text-ink-muted">{fields.closedHint}</p>

        <div className="flex items-center gap-2">
          <label htmlFor="newClosedDate" className="sr-only">
            {fields.closedDate}
          </label>
          <input
            id="newClosedDate"
            type="date"
            min={today}
            value={newClosedDate}
            onChange={(event) => setNewClosedDate(event.target.value)}
            className="w-44 rounded-xl border border-sakura-200 bg-white px-3 py-2.5 text-[14px] text-ink outline-none focus:border-sakura-400"
          />
          <button
            type="button"
            onClick={addClosedDate}
            disabled={!DATE_PATTERN.test(newClosedDate)}
            className="flex items-center gap-1 rounded-xl bg-white px-4 py-2.5 text-[13px] font-bold text-sakura-600 ring-1 ring-sakura-200 disabled:opacity-40"
          >
            <Plus className="size-4" strokeWidth={3} />
            {fields.addClosed}
          </button>
        </div>

        {closedDates.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {closedDates.map((closedDate) => {
              const isPast = closedDate < today;
              return (
                <li key={closedDate}>
                  <button
                    type="button"
                    onClick={() => updateClosedDates(closedDates.filter((value) => value !== closedDate))}
                    aria-label={`${closedDate} ${fields.removeLabel}`}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold ${
                      isPast ? "bg-ink-muted/10 text-ink-muted" : "bg-sakura-100 text-sakura-600"
                    }`}
                  >
                    {formatShortDate(closedDate)}
                    {isPast ? <span className="text-[10px]">{fields.pastLabel}</span> : null}
                    <X className="size-3.5" strokeWidth={3} />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="rounded-xl bg-canvas p-4 text-[13px] text-ink-muted">{fields.closedEmpty}</p>
        )}
      </section>

      {result ? (
        <p
          role={result.ok ? "status" : "alert"}
          className={`flex items-start gap-2 rounded-2xl p-4 text-[13px] font-bold leading-relaxed ${
            result.ok ? "bg-mint-100 text-mint-500" : "bg-sakura-100 text-sakura-600"
          }`}
        >
          {result.ok ? (
            <CircleCheck className="size-5 shrink-0" strokeWidth={2.5} />
          ) : (
            <CircleAlert className="size-5 shrink-0" strokeWidth={2.5} />
          )}
          {result.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={saving || !rangeValid}
        className="sticky bottom-4 w-full rounded-full bg-gradient-to-r from-sakura-400 to-sakura-600 px-6 py-3.5 font-round text-[15px] font-bold text-white shadow-lg shadow-sakura-600/30 transition active:translate-y-0.5 disabled:opacity-60"
      >
        {saving ? adminTrialSettings.savingLabel : adminTrialSettings.saveLabel}
      </button>
    </form>
  );
}
