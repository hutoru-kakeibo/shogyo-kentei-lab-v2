"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trialForm, trialSchedule } from "@/lib/content";
import { getTakenSlots, type TakenSlots } from "@/lib/trial-actions";

const { weekdayNames } = trialForm.schedule;

/** ローカル時刻のまま YYYY-MM-DD を作る（UTC変換で日付がずれるのを避ける） */
function toKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** その日に受け付けている時間帯を返す */
export function slotsForDate(key: string) {
  if (trialSchedule.closedDates.includes(key)) return [];
  const [year, month, day] = key.split("-").map(Number);
  const weekday = new Date(year, month - 1, day).getDay();
  return trialSchedule.slotsByWeekday[weekday] ?? [];
}

/** 「9月14日（土）」の形に整える */
export function formatDateLabel(key: string) {
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

export function TrialDateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  dateError,
  timeError,
}: Props) {
  // このコンポーネントはクライアント側でのみ読み込まれる（TrialForm 側で ssr: false 指定）ため、
  // 初期化時に現在日時を使ってもサーバーとの表示ズレは起きない。
  const [range] = useState(() => {
    const today = startOfDay(new Date());
    return {
      min: addDays(today, trialSchedule.leadDays),
      max: addDays(today, trialSchedule.rangeDays),
    };
  });
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(range.min));

  // すでに埋まっている日時。null は「取得中」、取得に失敗したときは {}（制約なしとして動く）
  const [taken, setTaken] = useState<TakenSlots | null>(null);

  useEffect(() => {
    let cancelled = false;

    getTakenSlots(toKey(range.min), toKey(range.max)).then((result) => {
      if (!cancelled) setTaken(result);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- range は初回のみ確定し、以後変わらない
  }, []);

  // 予約状況を取得できたら、すでに選択済みの日時が埋まっていないか確認し、
  // 埋まっていれば選び直してもらう（表示直後に他の人が予約していた場合の保険）
  useEffect(() => {
    if (!taken || !date || !time) return;
    if (taken[date]?.includes(time)) onTimeChange("");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- taken が変わったときだけ確認する
  }, [taken]);

  /** その日の、まだ予約が入っていない受講可能時間 */
  const availableSlotsForDate = (key: string) => {
    const bookedTimes = taken?.[key] ?? [];
    return slotsForDate(key).filter((slot) => !bookedTimes.includes(slot));
  };

  const firstDay = startOfMonth(viewMonth);
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();

  const canGoPrev = startOfMonth(range.min) < firstDay;
  const canGoNext = firstDay < startOfMonth(range.max);

  const shiftMonth = (amount: number) =>
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + amount, 1));

  // 予約状況を取得できるまでは、「一部の日だけ空きあり」のように見えてしまわないよう
  // カレンダー全体をスケルトン表示にしておく
  if (taken === null) {
    return <div className="h-72 animate-pulse rounded-2xl bg-sakura-100" aria-hidden="true" />;
  }

  const selectedSlots = date ? availableSlotsForDate(date) : [];
  // 受付枠自体はあるが、全時間が予約で埋まっている状態かどうか
  const isFullyBooked = Boolean(date) && slotsForDate(date).length > 0 && selectedSlots.length === 0;

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
            {viewMonth.getFullYear()}年{viewMonth.getMonth() + 1}月
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
            const current = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), index + 1);
            const key = toKey(current);
            const inRange = current >= range.min && current <= range.max;
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
