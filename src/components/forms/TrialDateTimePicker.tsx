"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trialForm } from "@/lib/content";
import { getTakenSlots, getTrialSchedule, type TakenSlots } from "@/lib/trial-actions";
import {
  bookableRange,
  fallbackTrialSchedule,
  slotsForDate,
  type TrialSchedule,
} from "@/lib/trial-schedule";

const { weekdayNames } = trialForm.schedule;

/** カレンダーのマス（年・月・日）から YYYY-MM-DD を作る */
function toKey(year: number, monthIndex: number, day: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** YYYY-MM-DD が属する月の1日 */
function monthStartOfKey(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

/** 「9月14日（土）」の形に整える */
function formatDateLabel(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  const weekday = weekdayNames[new Date(year, month - 1, day).getDay()];
  return `${month}月${day}日（${weekday}）`;
}

type Props = {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  dateError?: string;
  timeError?: string;
};

type Loaded = {
  schedule: TrialSchedule;
  taken: TakenSlots;
  range: { from: string; to: string };
};

export function TrialDateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  dateError,
  timeError,
}: Props) {
  // 受付設定（管理画面で変更可能）と予約状況。null は「取得中」
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [viewMonth, setViewMonth] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      let schedule = fallbackTrialSchedule;
      let taken: TakenSlots = {};
      try {
        schedule = await getTrialSchedule();
        const range = bookableRange(schedule);
        taken = await getTakenSlots(range.from, range.to);
      } catch (error) {
        // 通信に失敗してもフォームは使えるようにする（送信時にサーバー側で受付可否を再確認する）
        console.error("[trial] 受付設定・予約状況を取得できませんでした:", error);
      }
      if (cancelled) return;

      const range = bookableRange(schedule);
      setLoaded({ schedule, taken, range });
      setViewMonth(monthStartOfKey(range.from));
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // 予約状況を取得できたら、すでに選択済みの日時が埋まっていないか確認し、
  // 埋まっていれば選び直してもらう（表示直後に他の人が予約していた場合の保険）
  useEffect(() => {
    if (!loaded || !date || !time) return;
    if (loaded.taken[date]?.includes(time)) onTimeChange("");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 取得が終わったときだけ確認する
  }, [loaded]);

  // 取得できるまでは、「一部の日だけ空きあり」のように見えてしまわないよう
  // カレンダー全体をスケルトン表示にしておく
  if (!loaded || !viewMonth) {
    return <div className="h-72 animate-pulse rounded-2xl bg-sakura-100" aria-hidden="true" />;
  }

  const { schedule, taken, range } = loaded;

  /** その日の、まだ予約が入っていない受講可能時間 */
  const availableSlotsForDate = (key: string) => {
    const bookedTimes = taken[key] ?? [];
    return slotsForDate(schedule, key).filter((slot) => !bookedTimes.includes(slot));
  };

  const year = viewMonth.getFullYear();
  const monthIndex = viewMonth.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingBlanks = viewMonth.getDay();

  const canGoPrev = monthStartOfKey(range.from) < viewMonth;
  const canGoNext = viewMonth < monthStartOfKey(range.to);

  const shiftMonth = (amount: number) => setViewMonth(new Date(year, monthIndex + amount, 1));

  const selectedSlots = date ? availableSlotsForDate(date) : [];
  // 受付枠自体はあるが、全時間が予約で埋まっている状態かどうか
  const isFullyBooked =
    Boolean(date) && slotsForDate(schedule, date).length > 0 && selectedSlots.length === 0;

  return (
    <div>
      {/* カレンダー */}
      <p className="mb-2 text-[12px] font-bold text-ink-muted">{trialForm.schedule.dateHint}</p>
      <div className="rounded-2xl bg-white p-3 ring-1 ring-sakura-200">
        <div className="flex items-center justify-between px-1 pb-2">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            disabled={!canGoPrev}
            aria-label="前の月"
            className="grid size-8 place-items-center rounded-full text-sakura-500 disabled:opacity-30"
          >
            <ChevronLeft className="size-5" strokeWidth={3} />
          </button>
          <span className="font-round text-[15px] font-bold text-ink">
            {year}年{monthIndex + 1}月
          </span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            disabled={!canGoNext}
            aria-label="次の月"
            className="grid size-8 place-items-center rounded-full text-sakura-500 disabled:opacity-30"
          >
            <ChevronRight className="size-5" strokeWidth={3} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 pb-1">
          {weekdayNames.map((name, index) => (
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
            const inRange = key >= range.from && key <= range.to;
            const selectable = inRange && availableSlotsForDate(key).length > 0;
            const isSelected = key === date;

            return (
              <button
                key={key}
                type="button"
                disabled={!selectable}
                aria-pressed={isSelected}
                onClick={() => {
                  onDateChange(key);
                  onTimeChange("");
                }}
                className={`grid aspect-square place-items-center rounded-full text-[13px] font-bold transition ${
                  isSelected
                    ? "bg-gradient-to-br from-sakura-400 to-sakura-600 text-white shadow-md shadow-sakura-600/30"
                    : selectable
                      ? "text-ink hover:bg-sakura-100"
                      : "text-ink-muted/30"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
      {dateError ? (
        <p role="alert" className="mt-1.5 text-[12px] font-bold text-sakura-600">
          {dateError}
        </p>
      ) : null}

      {/* 時間帯 */}
      <p className="mb-2 mt-5 text-[12px] font-bold text-ink-muted">
        {date ? trialForm.schedule.timeHint : trialForm.schedule.beforeDateSelected}
      </p>

      {date ? (
        selectedSlots.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {selectedSlots.map((slot) => {
              const isSelected = slot === time;
              return (
                <button
                  key={slot}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onTimeChange(slot)}
                  className={`rounded-xl py-3 font-round text-[15px] font-bold transition ${
                    isSelected
                      ? "bg-gradient-to-br from-sakura-400 to-sakura-600 text-white shadow-md shadow-sakura-600/30"
                      : "bg-white text-ink ring-1 ring-sakura-200"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="rounded-xl bg-lemon-50 p-4 text-[13px] font-bold text-ink-muted">
            {isFullyBooked ? trialForm.schedule.full : trialForm.schedule.noSlots}
          </p>
        )
      ) : (
        <div className="rounded-xl bg-white/60 p-4 text-[13px] text-ink-muted/70 ring-1 ring-sakura-100">
          - - -
        </div>
      )}
      {timeError ? (
        <p role="alert" className="mt-1.5 text-[12px] font-bold text-sakura-600">
          {timeError}
        </p>
      ) : null}

      {/* 選択中の内容 */}
      {date && time ? (
        <p className="mt-4 rounded-xl bg-mint-100 px-4 py-3 text-center font-round text-[15px] font-bold text-ink">
          {trialForm.schedule.selectedPrefix}
          {formatDateLabel(date)} {time}
        </p>
      ) : null}
    </div>
  );
}
