/**
 * 検定ページに出す「今年度の試験日程」。
 *
 * Search Console で「全商英検 日程」「全商英検 いつ」「全商英検 申し込み」のような検索が多いのに、
 * ページに日程が無くてクリックされていなかったため追加した。
 *
 * ⚠️ 内容は全国商業高等学校協会の公式の試験要項（PDF）から転記している
 *    （実用英検だけは、日本英語検定協会の公式サイトの日程表から転記）。
 *    年度が変わったら必ず新しい要項で確認して書き換えること（古い日程を載せたままにしない）。
 *    書き換えたら checkedAt も更新する。
 */

export type ExamRound = {
  /** 例：第77回 */
  name: string;
  /** 画面に出す試験日（CBTのように期間で実施するものは期間で書く） */
  examDate: string;
  /** 画面に出す申込期間 */
  applyPeriod: string;
  /** この回の最初の試験日（YYYY-MM-DD）。CBTのように期間で実施する回で「実施中」を判定するのに使う */
  firstDate: string;
  /** この回の最後の試験日（YYYY-MM-DD）。過ぎたら「終了」、次に来る回に「次回」を付けるのに使う */
  lastDate: string;
};

export type ExamSchedule = {
  /** 例：令和8年度 */
  fiscalYear: string;
  rounds: ExamRound[];
  /** 表の下に出す補足 */
  notes: string[];
  source: { label: string; href: string };
  /** 公式の要項と突き合わせた日（YYYY-MM-DD） */
  checkedAt: string;
};

export const examSchedules: Record<string, ExamSchedule> = {
  "zensho-eiken": {
    fiscalYear: "令和8年度",
    rounds: [
      {
        name: "第76回",
        examDate: "2026年9月6日（日）",
        applyPeriod: "6月3日（水）〜6月16日（火）",
        firstDate: "2026-09-06",
        lastDate: "2026-09-06",
      },
      {
        name: "第77回",
        examDate: "2026年12月20日（日）",
        applyPeriod: "9月17日（木）〜10月5日（月）",
        firstDate: "2026-12-20",
        lastDate: "2026-12-20",
      },
    ],
    notes: [
      "全国一斉で実施されます。試験時間は1級 9:00〜10:30、2級 11:00〜12:20、3級 9:00〜10:00です。",
      "受験料は1級・2級が1,600円、3級が1,500円（税込）。高校生は原則として在籍校で申し込みます。",
      "合格発表は試験後1か月以内です。",
    ],
    source: {
      label: "全国商業高等学校協会「令和8年度 英語検定試験要項」",
      href: "https://zensho.or.jp/puf/download/exam/guidelines/R8_english.pdf",
    },
    checkedAt: "2026-10-08",
  },
  "zensho-boki": {
    fiscalYear: "令和8年度",
    rounds: [
      {
        name: "第102回",
        examDate: "1・2級：2026年6月28日（日）／3級（CBT）：6月6日〜7月26日のうち試験場校が指定する日",
        applyPeriod: "4月13日（月）〜4月22日（水）",
        firstDate: "2026-06-06",
        lastDate: "2026-07-26",
      },
      {
        name: "第103回",
        examDate: "3級（CBT）：2026年9月5日〜10月25日のうち試験場校が指定する日",
        applyPeriod: "7月3日（金）〜7月13日（月）",
        firstDate: "2026-09-05",
        lastDate: "2026-10-25",
      },
      {
        name: "第104回",
        examDate: "3級（CBT）：2026年11月7日〜12月27日のうち試験場校が指定する日",
        applyPeriod: "10月9日（金）〜10月19日（月）",
        firstDate: "2026-11-07",
        lastDate: "2026-12-27",
      },
      {
        name: "第105回",
        examDate:
          "1級：2027年1月24日（日）／2・3級（CBT）：1月5日〜2月7日のうち試験場校が指定する日",
        applyPeriod: "10月26日（月）〜12月4日（金）",
        firstDate: "2027-01-05",
        lastDate: "2027-02-07",
      },
    ],
    notes: [
      "CBTは学校のパソコンで解答する方式で、試験日と開始時間は試験場校が一人ずつ指定します。試験時間は2級60分、3級50分です。",
      "受験料は各級1,600円（1級は会計・原価計算の1部門ごと）。高校生は原則として在籍校で申し込みます。",
      "合格発表は試験後1か月以内です。",
    ],
    source: {
      label: "全国商業高等学校協会「令和8年度 簿記実務検定試験要項」",
      href: "https://zensho.or.jp/puf/download/exam/guidelines/R8_bk.pdf",
    },
    checkedAt: "2026-10-08",
  },
  // 実用英検（従来型）。日本英語検定協会の公式サイトの日程表から転記。
  // 一次試験は本会場の日付、申込期間は学校・塾でまとめて申し込む「団体申込」の期間（個人申込は期間が異なる）
  eiken: {
    fiscalYear: "2026年度",
    rounds: [
      {
        name: "第1回",
        examDate: "一次：2026年5月31日（日）／二次：7月5日（日）・7月12日（日）",
        applyPeriod: "団体申込：3月23日（月）〜4月28日（火）",
        firstDate: "2026-05-31",
        lastDate: "2026-07-12",
      },
      {
        name: "第2回",
        examDate: "一次：2026年10月4日（日）／二次：11月8日（日）・11月15日（日）",
        applyPeriod: "団体申込：6月30日（火）〜9月4日（金）",
        firstDate: "2026-10-04",
        lastDate: "2026-11-15",
      },
      {
        name: "第3回",
        examDate: "一次：2027年1月24日（日）／二次：2月28日（日）・3月7日（日）",
        applyPeriod: "団体申込：10月30日（金）〜12月14日（月）",
        firstDate: "2027-01-24",
        lastDate: "2027-03-07",
      },
    ],
    notes: [
      "一次試験の日付は本会場のものです。学校などの準会場では、一次試験の前の金・土・日に実施されることがあります。",
      "二次試験（面接）は、一次試験に合格した人だけが受けます。A日程・B日程のどちらになるかは英検協会が指定します。",
      "申込期間は、学校や塾でまとめて申し込む「団体申込」の期間です。個人で申し込む場合の期間は英検公式サイトで確認してください。コンピューターで受ける英検S-CBTは、これとは別の日程で実施されています。",
    ],
    source: {
      label: "日本英語検定協会「試験日程（団体申込）」",
      href: "https://www.eiken.or.jp/eiken/schedule/group/schedule/",
    },
    checkedAt: "2026-10-10",
  },
};

/** 回ごとの状態。today は日本時間の YYYY-MM-DD */
export function roundStatuses(rounds: ExamRound[], today: string) {
  // 実施中の回があればその回、なければまだ始まっていない最初の回を「次回」とする
  const nextIndex = rounds.findIndex((round) => round.firstDate > today);
  return rounds.map((round, index) => {
    if (round.lastDate < today) return "done" as const;
    if (round.firstDate <= today) return "ongoing" as const;
    return index === nextIndex ? ("next" as const) : ("upcoming" as const);
  });
}
