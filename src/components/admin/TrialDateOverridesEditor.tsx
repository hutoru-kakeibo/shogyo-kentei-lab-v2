"use client";

import { useState } from "react";
import { Ban, ChevronLeft, ChevronRight, Plus, RotateCcw, X } from "lucide-react";
import { adminTrialSettings, trialForm } from "@/lib/content";
import { TIME_PATTERN, addDaysToKey, weekdayOf } from "@/lib/trial-schedule";

const { dateOverrideEditor: copy, presetTimes, weekdayNames } = adminTrialSettings;
const shortWeekdays = trialForm.schedule.weekdayNames;

/** 今日から何日先まで、日ごとの設定を作れるようにするか */
const EDITABLE_DAYS = 365;

function toKey(year: number, monthIndex: number, day: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function monthStartOfKey(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

/** 2026-09-20 → 9月20日（日） */
function formatDateLabel(key: string) {
  const [, month, day] = key.split("-").map(Number);
  return `${month}月${day}日（${shortWeekdays[weekdayOf(key)]}）`;
}

/** 2026-09-20 → 9/20（日） */
function formatShortDate(key: string) {
  const [, month, day] = key.split("-").map(Number);
  return `${month}/${day}（${shortWeekdays[weekdayOf(key)]}）`;
}

type Props = {
  today: string;
  slotsByWeekday: string[][];
  dateOverrides: Record<string, string[]>;
  closedDates: string[];
  onDateOverridesChange: (next: Record<string, string[]>) => void;
  onClosedDatesChange: (next: string[]) => void;
};

/** カレンダーで日付を選び、その日だけの受付時間・休講を設定する */
export function TrialDateOverridesEditor({
  today,
  slotsByWeekday,
  dateOverrides,
  closedDates,
  onDateOverridesChange,
  onClosedDatesChange,
}: Props) {
  const lastEditableDate = addDaysToKey(today, EDITABLE_DAYS);
  const [viewMonth, setViewMonth] = useState(() => monthStartOfKey(today));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [customTime, setCustomTime] = useState("");

  const year = viewMonth.getFullYear();
  const monthIndex = viewMonth.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingBlanks = viewMonth.getDay();
  const canGoPrev = monthStartOfKey(today) < viewMonth;
  const canGoNext = viewMonth < monthStartOfKey(lastEditableDate);

  const setOverride = (date: string, slots: string[] | null) => {
    const next = { ...dateOverrides };
    if (slots === null) {
      delete next[date];
    } else {
      next[date] = [...new Set(slots)].sort();
    }
    onDateOverridesChange(next);
  };

  const selectDate = (key: string) => {
    setSelectedDate(key);
    setViewMonth(monthStartOfKey(key));
    setCustomTime("");
  };

  const isClosed = selectedDate ? closedDates.includes(selectedDate) : false;
  const override = selectedDate ? dateOverrides[selectedDate] : undefined;
  const weekdaySlots = selectedDate ? (slotsByWeekday[weekdayOf(selectedDate)] ?? []) : [];
  const selectedSlots = override ?? weekdaySlots;
  const extraSlots = selectedSlots.filter(
    (slot) => !(presetTimes as readonly string[]).includes(slot),
  );

  const toggleTime = (time: string) => {
    if (!selectedDate) return;
    setOverride(
      selectedDate,
      selectedSlots.includes(time)
        ? selectedSlots.filter((slot) => slot !== time)
        : [...selectedSlots, time],
    );
  };

  const addCustomTime = () => {
    if (!selectedDate || !TIME_PATTERN.test(customTime)) return;
    setOverride(selectedDate, [...selectedSlots, customTime]);
    setCustomTime("");
  };

  const closeSelectedDate = () => {
    if (!selectedDate) return;
    onClosedDatesChange([...new Set([...closedDates, selectedDate])].sort());
    // 休講にした日に、その日だけの時間が残っていると紛らわしいので消しておく
    if (override) setOverride(selectedDate, null);
  };

  const reopenSelectedDate = () => {
    if (!selectedDate) return;
    onClosedDatesChange(closedDates.filter((date) => date !== selectedDate));
  };

  const overrideEntries = Object.entries(dateOverrides).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="space-y-4">
      {/* カレンダー */}
      <div className="rounded-2xl bg-white p-3 ring-1 ring-sakura-200">
        <div className="flex items-center justify-between px-1 pb-2">
          <button
            type="button"
            onClick={() => setViewMonth(new Date(year, monthIndex - 1, 1))}
            disabled={!canGoPrev}
            aria-label={copy.prevMonth}
            className="grid size-8 place-items-center rounded-full text-sakura-500 disabled:opacity-30"
          >
            <ChevronLeft className="size-5" strokeWidth={3} />
          </button>
          <span className="font-round text-[15px] font-bold text-ink">
            {year}年{monthIndex + 1}月
          </span>
          <button
            type="button"
            onClick={() => setViewMonth(new Date(year, monthIndex + 1, 1))}
            disabled={!canGoNext}
            aria-label={copy.nextMonth}
            className="grid size-8 place-items-center rounded-full text-sakura-500 disabled:opacity-30"
          >
            <ChevronRight className="size-5" strokeWidth={3} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 pb-1">
          {shortWeekdays.map((name, index) => (
            <span
              key={name}
              className={`text-center text-[11px] font-bold ${
                index === 0 ? "text-sakura-500" : index === 6 ? "text-sky-500" : "text-ink-muted"
              }`}
            >
              {name}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: leadingBlanks }, (_, index) => (
            <span key={`blank-${index}`} />
          ))}

          {Array.from({ length: daysInMonth }, (_, index) => {
            const key = toKey(year, monthIndex, index + 1);
            const disabled = key < today || key > lastEditableDate;
            const dayClosed = closedDates.includes(key);
            const dayOverride = dateOverrides[key];
            const count = dayClosed
              ? 0
              : (dayOverride ?? slotsByWeekday[weekdayOf(key)] ?? []).length;
            const isSelected = key === selectedDate;

            const stateClass = isSelected
              ? "bg-gradient-to-br from-sakura-400 to-sakura-600 text-white shadow-md shadow-sakura-600/30"
              : disabled
                ? "text-ink-muted/25"
                : dayClosed
                  ? "bg-ink-muted/10 text-ink-muted"
                  : dayOverride
                    ? "bg-sakura-100 text-sakura-600 ring-1 ring-sakura-300"
                    : count === 0
                      ? "text-ink-muted/40 hover:bg-sakura-50"
                      : "text-ink hover:bg-sakura-50";

            const subLabel = dayClosed
              ? copy.closedShort
              : dayOverride
                ? `${count}${copy.slotSuffix}`
                : "";

            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                aria-pressed={isSelected}
                aria-label={`${formatDateLabel(key)} ${
                  dayClosed ? copy.statusClosed : dayOverride ? copy.statusOverride : ""
                }`}
                onClick={() => selectDate(key)}
                className={`flex aspect-square flex-col items-center justify-center rounded-xl text-[13px] font-bold leading-none transition ${stateClass}`}
              >
                {index + 1}
                {subLabel && !disabled ? (
                  <span className="mt-0.5 text-[9px] font-bold leading-none">{subLabel}</span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 px-1 text-[11px] font-bold text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded bg-sakura-100 ring-1 ring-sakura-300" />
            {copy.legendOverride}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded bg-ink-muted/10" />
            {copy.legendClosed}
          </span>
        </div>
      </div>

      {/* 選んだ日の設定 */}
      {selectedDate ? (
        <div className="rounded-2xl bg-canvas p-4 ring-1 ring-sakura-100">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-round text-[16px] font-bold text-ink">{formatDateLabel(selectedDate)}</p>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                isClosed
                  ? "bg-ink-muted/10 text-ink-muted"
                  : override
                    ? "bg-sakura-100 text-sakura-600"
                    : "bg-mint-100 text-mint-500"
              }`}
            >
              {isClosed
                ? copy.statusClosed
                : override
                  ? copy.statusOverride
                  : `${weekdayNames[weekdayOf(selectedDate)]}${copy.statusWeeklySuffix}`}
            </span>
          </div>

          {isClosed ? (
            <>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">{copy.closedMessage}</p>
              <button
                type="button"
                onClick={reopenSelectedDate}
                className="mt-3 flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-[13px] font-bold text-sakura-600 ring-1 ring-sakura-200"
              >
                <RotateCcw className="size-4" strokeWidth={2.5} />
                {copy.reopen}
              </button>
            </>
          ) : (
            <>
              <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">{copy.toggleHint}</p>

              <div className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-7">
                {presetTimes.map((presetTime) => {
                  const active = selectedSlots.includes(presetTime);
                  return (
                    <button
                      key={presetTime}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleTime(presetTime)}
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
                      onClick={() => toggleTime(slot)}
                      aria-label={`${slot} ${copy.removeTimeLabel}`}
                      className="flex items-center gap-1 rounded-lg bg-sakura-500 px-2.5 py-1.5 text-[13px] font-bold text-white"
                    >
                      {slot}
                      <X className="size-3.5" strokeWidth={3} />
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="mt-3 flex items-center gap-2">
                <label htmlFor="override-custom-time" className="sr-only">
                  {copy.customTime}
                </label>
                <input
                  id="override-custom-time"
                  type="time"
                  step={300}
                  value={customTime}
                  onChange={(event) => setCustomTime(event.target.value)}
                  className="w-32 rounded-lg border border-sakura-200 bg-white px-3 py-1.5 text-[13px] text-ink outline-none focus:border-sakura-400"
                />
                <button
                  type="button"
                  onClick={addCustomTime}
                  disabled={!TIME_PATTERN.test(customTime)}
                  className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-[12px] font-bold text-sakura-600 ring-1 ring-sakura-200 disabled:opacity-40"
                >
                  <Plus className="size-3.5" strokeWidth={3} />
                  {copy.customTime}
                </button>
              </div>

              {selectedSlots.length === 0 ? (
                <p className="mt-3 rounded-xl bg-lemon-50 p-3 text-[12px] font-bold text-ink-muted">
                  {copy.noSlotsMessage}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={closeSelectedDate}
                  className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-[13px] font-bold text-ink-muted ring-1 ring-ink-muted/20"
                >
                  <Ban className="size-4" strokeWidth={2.5} />
                  {copy.closeDay}
                </button>
                {override ? (
                  <button
                    type="button"
                    onClick={() => setOverride(selectedDate, null)}
                    className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-[13px] font-bold text-sakura-600 ring-1 ring-sakura-200"
                  >
                    <RotateCcw className="size-4" strokeWidth={2.5} />
                    {copy.resetToWeekly}
                  </button>
                ) : null}
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="rounded-xl bg-canvas p-4 text-[13px] text-ink-muted">{copy.selectHint}</p>
      )}

      {/* この日だけの設定をしている日の一覧 */}
      <div>
        <p className="mb-2 text-[12px] font-bold text-ink-muted">{copy.listTitle}</p>
        {overrideEntries.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {overrideEntries.map(([date, slots]) => {
              const isPast = date < today;
              return (
                <li
                  key={date}
                  className={`flex items-center overflow-hidden rounded-full text-[13px] font-bold ${
                    isPast ? "bg-ink-muted/10 text-ink-muted" : "bg-sakura-100 text-sakura-600"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => selectDate(date)}
                    disabled={date > lastEditableDate}
                    className="py-1.5 pl-3 pr-1.5"
                  >
                    {formatShortDate(date)}
                    <span className="ml-1 text-[11px]">
                      {slots.length > 0 ? `${slots.length}${copy.slotSuffix}` : copy.noSlotsShort}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOverride(date, null);
                      if (selectedDate === date) setCustomTime("");
                    }}
                    aria-label={`${formatShortDate(date)} ${copy.removeOverrideLabel}`}
                    className="py-1.5 pl-1 pr-2.5"
                  >
                    <X className="size-3.5" strokeWidth={3} />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-[13px] text-ink-muted">{copy.listEmpty}</p>
        )}
      </div>
    </div>
  );
}
