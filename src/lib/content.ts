/**
 * 全コピー・データの単一ソース。
 * 文言の修正は原則このファイルだけを編集する（コンポーネント側にコピーを持たせない）。
 */

export const siteMeta = {
  name: "商業検定ラボ",
  tagline: "日本初の商業高校生専門検定塾",
  /** ヘッダー内で1行に収めるための短縮版 */
  headerTagline: "商業高校生専門の検定塾",
  description:
    "全商簿記・情報処理・全商英検など、全商検定のすべてを対策できる日本初の商業高校生専門オンライン検定塾。部活と両立しながら、最短ルートで合格へ。無料体験受付中。",
  url: "https://shogyo-kentei-lab.vercel.app",
};

/**
 * ハンバーガーメニューの中身。
 * ページ内アンカーは、検定詳細ページ・申込ページなど下層ページからも機能するよう
 * 必ず "/#..." の形にする（"#..." のままだと、そのページ内でハッシュが足されるだけで
 * トップページへ移動しない）。
 */
export const globalNav = [
  { label: "商業検定ラボについて", href: "/#about" },
  { label: "選ばれる理由", href: "/#strong-point" },
  { label: "検定を探す", href: "/#course" },
  { label: "受講の流れ", href: "/#flow" },
  { label: "講師紹介", href: "/#teachers" },
  { label: "合格者の声", href: "/#voice" },
  { label: "無料教材", href: "/#materials" },
  { label: "よくある質問", href: "/#faq" },
  { label: "新着情報", href: "/#news" },
  { label: "ログイン", href: "/login" },
];

/** 画面下部に常時固定される3つのCTA */
export const bottomNav = [
  // 下層ページからも飛べるよう、ページ内アンカーは "/#..." の形にしている
  { label: "対応検定", href: "/#course", icon: "Search", tone: "lemon" },
  { label: "無料体験", href: "/trial", icon: "PencilLine", tone: "sakura" },
  { label: "講師紹介", href: "/#teachers", icon: "GraduationCap", tone: "sky" },
] as const;

export type BottomNavTone = (typeof bottomNav)[number]["tone"];

/** ファーストビュー */
export const hero = {
  /** キャッチコピー（2行のハイライトバー） */
  copyLines: ["ひとりじゃないから、", "全商、ぜんぶ受かる！"],
  leadTop: "商業検定ラボが",
  leadBottom: "あなたの「受かりたい」を全力サポート",
  script: "Pass Every Test!",
  /** 斜めグリッドに敷き詰める写真タイル（Step2時点はプレースホルダー） */
  tiles: [
    { label: "オンライン授業", icon: "Laptop", tone: "sakura", span: "col-span-2" },
    { label: "仕訳の演習", icon: "Calculator", tone: "lemon", span: "" },
    { label: "質問チャット", icon: "MessageCircleHeart", tone: "sky", span: "" },
    { label: "合格の瞬間", icon: "PartyPopper", tone: "lemon", span: "col-span-2" },
    { label: "過去問トレーニング", icon: "NotebookPen", tone: "sakura", span: "col-span-2" },
    { label: "進路相談", icon: "Sparkles", tone: "mint", span: "" },
  ],
  /** 写真の上に散らす丸バッジ */
  badges: [
    { label: "元商業高校生\nの講師", tone: "lemon" },
    { label: "1対1の\n個別サポート", tone: "sakura" },
    { label: "同じ目標の\n仲間", tone: "sky" },
  ],
} as const;

/**
 * 商業検定ラボについて（会社・塾の紹介）。
 * ⚠️ 「対応エリア」「対応検定」以外の項目、塾長メッセージの文面は暫定。実情に合わせて確認すること。
 */
export const about = {
  eyebrow: "どんなの？",
  title: "商業検定ラボとは",
  englishTitle: "ABOUT",
  /** マーカーで強調する短いミッション文 */
  mission: "全商検定の「わからない」を、\nひとりで抱えなくていい場所に。",
  lead: [
    "商業検定ラボは、全商検定に特化した、日本初の商業高校生専門のオンライン個別指導塾です。",
    "「検定に合格する」だけでなく「どう学べば力がつくのか」を身につけてほしいという思いから、授業だけでなく質問対応・個別相談・過去問の振り返りまでを一貫してサポートしています。",
  ],
  founder: {
    name: "森田智信（塾長）",
    photo: "/images/teacher-m.jpg",
    message:
      "中学生の頃から勉強を教えることが好きで、この検定塾を作りました。商業高校で同じように苦しんだ経験を持つ講師陣と一緒に、たくさんの方の力になりたいです。",
  },
  /** 基本情報テーブル */
  facts: [
    { label: "運営", value: "商業検定ラボ" },
    { label: "代表", value: "森田智信" },
    { label: "対応エリア", value: "全国（オンライン個別指導）" },
    { label: "対応検定", value: "全商検定 各科目、日商簿記 など" },
    { label: "指導形式", value: "1対1のオンライン個別指導" },
  ],
} as const;

/** STRONG POINT（強み） */
export const strongPoint = {
  eyebrow: "イイじゃん！",
  brandName: "商業検定ラボ",
  englishTitle: "STRONG POINT",
  lead: [
    "「簿記1級に合格したい」「情報処理も英検もぜんぶ取りたい」「推薦入試で有利になりたい」",
    "けれど何から手をつければいいかわからない・・・",
    "商業検定ラボは、授業だけでなく、質問対応・個別相談・過去問の振り返りまで、合格までの行動を一緒に整える、日本初の商業高校生専門の検定塾です。",
  ],
  points: [
    {
      no: "Point 1",
      imageLabel: "オンライン自習室のイメージ",
      icon: "Users",
      tone: "sakura",
      headline: "同じ目標の仲間がいる、\n一緒にがんばれる学習空間",
    },
    {
      no: "Point 2",
      imageLabel: "講師に質問しているイメージ",
      icon: "MessageCircleHeart",
      tone: "lemon",
      headline: "つまずいた瞬間に、\n講師へ気軽に質問できる",
    },
    {
      no: "Point 3",
      imageLabel: "個別面談のイメージ",
      icon: "ClipboardCheck",
      tone: "sky",
      headline: "検定情報も進路相談も、\nスタッフがまるごとフォロー",
    },
  ],
} as const;

/** 受講の流れ */
export const flow = {
  title: "受講の流れ",
  englishTitle: "FLOW",
  lead: "簡単4ステップ！\n初めての塾でも大丈夫！",
  steps: [
    {
      no: "01",
      icon: "PencilLine",
      tone: "sakura",
      title: "対策したい検定を探す",
      description:
        "困っている検定を上の一覧から選びます。",
    },
    {
      no: "02",
      icon: "CalendarCheck",
      tone: "lemon",
      title: "無料体験に申し込む",
      description:
        "まずは1時間の無料体験で、自分に合っているかをチェックできます！",
    },
    {
      no: "03",
      icon: "Laptop",
      tone: "sky",
      title: "オンライン授業",
      description:
        "場所を選ばず、部活やテスト週間などに合わせて自由に調整できます。",
    },
    {
      no: "04",
      icon: "Trophy",
      tone: "mint",
      title: "合格！",
      description:
        "徹底したサポートで、最短合格を目指します。合格後は次の検定戦略を無料で相談することもできます。",
    },
  ],
  ctaLabel: "まずは無料で体験！",
  ctaHref: "/trial",
} as const;

/**
 * 講師紹介。
 * 氏名・経歴・コメントはすべて仮のプレースホルダー。実際の講師情報に差し替えること。
 */
export const teachers = {
  title: "講師紹介",
  englishTitle: "TEACHERS",
  lead: "ほとんどが商業高校の出身。\nつまずくポイントを知っている先生が教えます。",
  /** 各項目のラベル */
  labels: {
    school: "出身校",
    qualifications: "保有資格",
    intro: "自己紹介",
  },
  items: [
    {
      id: "teacher-1",
      name: "後藤もか（講師）",
      tone: "sakura",
      imageLabel: "後藤もか（講師）の写真",
      /** public/images 配下の写真パス。null のときはプレースホルダーを表示する */
      photo: "/images/teacher-k.jpg",
      school: "宮崎学園高校→立命館大学",
      qualifications: ["全商9冠", "実用英検2級", "日商簿記2級", "秘書検定準1級"],
      intro:
        "商業高校で簿記に出会って、そのまま会計の道へ進みました。「なぜその仕訳になるのか」から説明するので、暗記に頼らず解けるようになります。",
    },
    {
      id: "teacher-2",
      name: "森田智信（塾長）",
      tone: "lemon",
      imageLabel: "森田智信（塾長）の写真",
      photo: "/images/teacher-m.jpg",
      school: "岡山東商業高校→立命館大学",
      qualifications: [
        "全商7冠（そろばん・英語以外）",
        "日商簿記2級、ビジネス会計検定3級",
        "ITパスポートなど",
      ],
      intro:
        "中学生の頃から勉強を教えることが好きで、この検定塾を作りました。たくさんの方の力になりたいです！よろしくお願いします！",
    },
    {
      id: "teacher-3",
      name: "阪井たくみ（英語顧問・講師）",
      tone: "sky",
      imageLabel: "Y先生の写真",
      photo: null,
      school: "○○県立○○商業高等学校 卒業",
      qualifications: ["共通テスト英語満点","TOEIC790スコア"],
      intro:
        "検定は進学・就職でそのまま武器になります。合格のその先まで見据えて、志望理由書や面接の相談にも乗ります。",
    },
  ],
} as const;

/**
 * 検定を探す（参考サイトの「講座を探す（COURSE）」に対応）。
 * href は科目詳細ページ用に用意してあるが、ページ自体は未実装のため現時点では遷移させていない。
 */
export const courseSearch = {
  title: "検定を探す",
  englishTitle: "COURSE",
  categories: [
    {
      name: "全商検定",
      items: [
        { name: "簿記実務検定", href: "/subjects/zensho-boki", ready: false },
        { name: "情報処理検定（ビジネス情報）", href: "/subjects/business-joho", ready: false },
        { name: "情報処理検定（プログラミング）", href: "/subjects/programming", ready: false },
        { name: "英語検定", href: "/subjects/zensho-eiken", ready: true },
        { name: "ビジネス文書実務検定", href: "/subjects/bunsho-sakusei", ready: false },
        { name: "商業経済検定", href: "/subjects/shogyo-keizai", ready: false },
        { name: "珠算・電卓実務検定", href: "/subjects/dentaku-jitsumu", ready: false },
        { name: "財務諸表分析", href: "/subjects/zaimu-shohyo-bunseki", ready: false },
      ],
    },
    {
      name: "その他の検定",
      items: [{ name: "日商簿記検定", href: "/subjects/nissho-boki", ready: false }],
    },
    {
      name: "進学・就職対策",
      items: [
        { name: "推薦・総合型選抜対策", href: "/subjects/suisen", ready: false },
        { name: "就職試験対策", href: "/subjects/shushoku", ready: false },
      ],
    },
  ],
} as const;

/**
 * 無料体験の受付枠。
 * ⚠️ 曜日ごとの受講可能時間・受付期間は仮の設定。実際の稼働時間に合わせて調整すること。
 */
export const trialSchedule = {
  /** 何日先から受け付けるか（2 なら明後日以降） */
  leadDays: 2,
  /** 何日先まで受け付けるか */
  rangeDays: 45,
  /** 曜日ごとの受講可能時間（0=日曜 … 6=土曜）。空配列の曜日は受付なし */
  slotsByWeekday: {
    0: ["10:00", "11:00", "13:00", "14:00", "15:00"],
    1: ["17:00", "18:00", "19:00", "20:00", "21:00"],
    2: ["17:00", "18:00", "19:00", "20:00", "21:00"],
    3: ["17:00", "18:00", "19:00", "20:00", "21:00"],
    4: ["17:00", "18:00", "19:00", "20:00", "21:00"],
    5: ["17:00", "18:00", "19:00", "20:00", "21:00"],
    6: ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
  } as Record<number, string[]>,
  /** 休講日など、受付を止める日（YYYY-MM-DD） */
  closedDates: [] as string[],
} as const;

/** 無料体験の申し込みフォーム */
export const trialForm = {
  title: "無料体験のお申し込み",
  englishTitle: "TRIAL",
  lead: "1時間の無料体験で、いまの学習状況をうかがいながら実際の授業を体験いただけます。\n下のフォームからお申し込みください。",
  requiredLabel: "必須",
  optionalLabel: "任意",
  submitLabel: "この内容で申し込む",
  submittingLabel: "送信しています…",
  /** 学年の選択肢 */
  gradeYears: ["高校1年", "高校2年", "高校3年", "その他"],
  /** 受験予定の級の選択肢 */
  targetGrades: ["3級", "2級", "1級", "まだ決めていない"],
  /** 検定の選択肢に加える項目 */
  undecidedSubject: "まだ決めていない・相談したい",
  /** 希望日時の選択まわり */
  schedule: {
    label: "体験の希望日時",
    dateHint: "カレンダーから希望日を選んでください",
    timeHint: "この日の受講可能な時間から選んでください",
    beforeDateSelected: "先に希望日を選んでください",
    noSlots: "この日は受け付けていません。別の日を選んでください。",
    /** その日の受講可能時間がすべて予約で埋まっているとき */
    full: "この日はすべて予約済みです。別の日を選んでください。",
    weekdayNames: ["日", "月", "火", "水", "木", "金", "土"],
    selectedPrefix: "選択中：",
  },
  /** 保護者同意のチェック文言 */
  consent: "未成年のため、保護者の同意を得たうえで申し込みます（20歳以上の方もチェックしてください）",
  /** 送信完了画面 */
  done: {
    title: "お申し込みありがとうございます",
    message:
      "内容を確認のうえ、3日以内にご記入いただいた連絡先へご連絡します。しばらくお待ちください。",
    backLabel: "トップページに戻る",
  },
  /** 入力エラーの文言 */
  errors: {
    required: "入力してください",
    select: "選択してください",
    email: "メールアドレスの形式が正しくありません",
    consent: "確認のうえチェックしてください",
    date: "希望日を選んでください",
    time: "希望時間を選んでください",
    /** 送信そのものに失敗したとき */
    send: "送信できませんでした。通信環境をご確認のうえ、もう一度お試しください。",
    /** サーバー側の検証で弾かれたとき */
    invalid: "入力内容に不足があります。必須項目をご確認ください。",
    /** 選んだ日時が、送信の直前に他の人の予約で埋まってしまったとき */
    slotTaken:
      "その日時はちょうど他の方の予約で埋まってしまいました。お手数ですが、別の日時を選び直してください。",
  },
};

/**
 * 合格者の声（合格体験記カード）。
 * 通常は Supabase の voices テーブルから取得する（src/lib/voice.ts）。
 * ここに書く items は、Supabase 未設定・取得失敗時のフォールバック用の仮データ。
 */
export const voice = {
  title: "合格者の声",
  englishTitle: "VOICE",
  lead: "商業検定ラボで学んだ先輩たちの学習記録です。",
  prevLabel: "前の声",
  nextLabel: "次の声",
  /** 合格体験記が1件も無いときの文言 */
  emptyMessage: "現在、合格体験記を準備中です。",
  /** 学習実績テーブルの項目ラベル */
  labels: {
    totalHours: "合計時間",
    mockBestScore: "模擬最高点",
    totalDays: "合計日数",
    mockCount: "模擬試験回数",
    /** 2行までのフリーテキスト。改行は \n で指定する */
    recommendPoint: "塾の推しポイント",
  },
  items: [
    {
      id: "voice-1",
      gradeLabel: "日商簿記2級合格！",
      bio: "生徒会副会長をやりながら",
      name: "Mさん",
      tone: "sakura",
      photo: "/images/voice-m.jpg",
      totalHours: "90h",
      mockBestScore: "64点",
      totalDays: "70日",
      mockCount: "15回",
      recommendPoint: "なんど同じ問題で間違えてもわかるまで何度も教えてくれるところが良かった",
    },
  ],
} as const;

/**
 * 無料教材。
 * 現在は「全商英検対策アプリ」のみ掲載。新しい教材が増えたら items に追加する
 * （href が無い項目は準備中としてリンクにせず表示する。FreeMaterials.tsx 参照）。
 */
export const freeMaterials = {
  title: "無料教材",
  englishTitle: "FREE",
  lead: "登録不要で試せる、無料のコンテンツです。",
  items: [
    {
      id: "material-1",
      /** "zensho-eiken-logo" は FreeMaterials.tsx 側で専用の四角いロゴバッジとして描画する */
      icon: "zensho-eiken-logo",
      tone: "sky",
      tag: "アプリ",
      title: "全商英検対策アプリ",
      description: "スキマ時間に取り組める、全商英検対策の無料アプリです。",
      badgeLabel: "公開中",
      available: true,
      href: "https://www.zensho-eiken-taisaku.com/",
    },
  ],
} as const;

/**
 * よくある質問。
 * 回答はサイト上の記載（オンライン個別授業・1時間の無料体験・チャットでの質問対応）から
 * 組み立てた暫定文。実際の運用と異なる箇所は差し替えること。
 */
export const faq = {
  title: "よくある質問",
  englishTitle: "FAQ",
  lead: "申し込み前によくいただく質問をまとめました。",
  items: [
    {
      id: "faq-1",
      question: "全商検定のどの科目に対応していますか？",
      answer:
        "簿記実務・情報処理（ビジネス情報／プログラミング）・英語・ビジネス文書実務・珠算・電卓実務など、全商検定の主要科目に対応しています。日商簿記や、推薦入試・就職試験の対策も相談できます。対応状況は「検定を探す」の一覧をご覧ください。",
    },
    {
      id: "faq-2",
      question: "部活や学校行事と両立できますか？",
      answer:
        "できます。授業はオンラインなので移動時間がかからず、部活の予定やテスト週間に合わせて日時を調整できます。忙しい時期は回数を減らし、検定前に戻すといった進め方も可能です。",
    },
    {
      id: "faq-3",
      question: "パソコンがなくても受講できますか？",
      answer:
        "スマートフォンやタブレットでも受講できます。ただし情報処理検定の実技対策など、パソコンでの操作が必要な科目もあります。お持ちの機器に合わせた進め方をご提案しますので、無料体験のときにご相談ください。",
    },
    {
      id: "faq-4",
      question: "授業がない日でも質問できますか？",
      answer:
        "はい。授業のない日もチャットで質問を受け付けています。「解説を読んでも分からない」「答えは合っていたけれど解き方が不安」といった小さな疑問も、その日のうちに解消してください。",
    },
    {
      id: "faq-5",
      question: "検定の直前だけ受講することもできますか？",
      answer:
        "可能です。直前期は頻出パターンの総復習と過去問演習に絞って対策します。ただし範囲が広い級では期間に余裕があるほど有利なので、まずは無料体験で残り期間から逆算した計画をご提案します。",
    },
    {
      id: "faq-6",
      question: "無料体験では何をしますか？",
      answer:
        "1時間で、いまの学習状況のヒアリングと実際の授業を体験していただきます。対策したい検定・級と、受けたい日時をフォームからお送りください。当日はいただいた情報を元に授業をさせていただきます。",
    },
    {
      id: "faq-7",
      question: "商業高校生でなくても受講できますか？",
      answer:
        "受講いただけます。普通科から全商検定・日商簿記に挑戦したい方や、社会人の学び直しにも対応しています。まずは無料体験でご相談ください。",
    },
    {
      id: "faq-8",
      question: "申し込みに保護者の同意は必要ですか？",
      answer:
        "未成年の方は保護者の同意が必要です。申し込みフォームで保護者の方の連絡先をご記入いただき、内容を確認したうえで受講開始となります。",
    },
  ],
} as const;

/** 管理者ログイン画面 */
export const adminLogin = {
  title: "管理者ログイン",
  emailLabel: "メールアドレス",
  passwordLabel: "パスワード",
  submitLabel: "ログイン",
  submittingLabel: "ログインしています…",
  errors: {
    required: "メールアドレスとパスワードを入力してください",
    invalidCredentials: "メールアドレスまたはパスワードが正しくありません",
    notAdmin: "このアカウントには管理者権限がありません",
    generic: "ログインできませんでした。時間をおいて再度お試しください。",
  },
} as const;

/** 管理画面（ダッシュボード） */
export const admin = {
  title: "管理画面",
  backToSite: "サイトを見る",
  logoutLabel: "ログアウト",
  /** ダッシュボードから各管理画面への入口 */
  sections: [
    {
      id: "news",
      href: "/admin/news",
      label: "新着情報",
      description: "一覧・作成・編集・削除・公開のON/OFF",
    },
    {
      id: "trials",
      href: "/admin/trials",
      label: "無料体験の申し込み",
      description: "一覧の確認、対応状況の更新",
    },
    {
      id: "voices",
      href: "/admin/voices",
      label: "合格体験記",
      description: "追加・削除",
    },
    {
      id: "subjects",
      href: "/admin/subjects",
      label: "検定ページ",
      description: "内容の編集",
    },
  ],
} as const;

/** 管理画面：新着情報 */
export const adminNews = {
  title: "新着情報の管理",
  newLabel: "新しい記事を作成",
  editLabel: "編集",
  deleteLabel: "削除",
  deleteConfirm: "この記事を削除します。よろしいですか？（元に戻せません）",
  emptyMessage: "まだ記事がありません。",
  publishedLabel: "公開中",
  draftLabel: "非公開",
  /** 作成・編集フォームの項目 */
  form: {
    dateLabel: "公開日",
    categoryLabel: "カテゴリ",
    titleLabel: "タイトル",
    publishedLabel: "公開する（チェックを外すと下書きとして非表示になります）",
    submitCreateLabel: "作成する",
    submitEditLabel: "更新する",
    submittingLabel: "保存しています…",
    cancelLabel: "キャンセル",
  },
  errors: {
    required: "入力してください",
    generic: "保存できませんでした。時間をおいて再度お試しください。",
    notFound: "記事が見つかりませんでした。",
  },
} as const;

/** 管理画面：無料体験の申し込み */
export const adminTrials = {
  title: "無料体験の申し込み",
  emptyMessage: "まだ申し込みがありません。",
  backLabel: "一覧に戻る",
  statusLabel: "対応状況",
  /** status カラムの値と、画面上の表示・バッジ色の対応 */
  statusOptions: [
    { value: "new", label: "新規", badgeClass: "bg-sakura-100 text-sakura-600" },
    { value: "contacted", label: "連絡済み", badgeClass: "bg-lemon-200 text-ink" },
    { value: "done", label: "完了", badgeClass: "bg-mint-100 text-mint-500" },
    { value: "canceled", label: "キャンセル", badgeClass: "bg-ink-muted/10 text-ink-muted" },
  ] as const,
  /** 詳細画面の項目ラベル */
  fields: {
    subject: "受けたい検定",
    targetGrade: "受験予定の級",
    name: "お名前",
    kana: "ふりがな",
    gradeYear: "学年",
    school: "学校名",
    email: "メールアドレス",
    tel: "電話番号",
    preferred: "希望日時",
    message: "相談したいこと",
    createdAt: "申し込み日時",
  },
  noMessage: "（記入なし）",
  noTel: "（未記入）",
  updateSubmitLabel: "対応状況を更新する",
  updatingLabel: "更新しています…",
  updatedLabel: "更新しました",
  errors: {
    generic: "更新できませんでした。時間をおいて再度お試しください。",
    notFound: "申し込みが見つかりませんでした。",
  },
} as const;

/** 管理画面：合格体験記 */
export const adminVoices = {
  title: "合格体験記の管理",
  newLabel: "新しい体験記を作成",
  deleteLabel: "削除",
  deleteConfirm: "この合格体験記を削除します。よろしいですか？（元に戻せません）",
  emptyMessage: "まだ合格体験記がありません。",
  /** カードの色（4色から選ぶ） */
  toneLabel: "カードの色",
  toneOptions: [
    { value: "sakura", label: "ピンク" },
    { value: "lemon", label: "イエロー" },
    { value: "sky", label: "ブルー" },
    { value: "mint", label: "ミント" },
  ] as const,
  /** 作成フォームの項目 */
  form: {
    gradeLabelLabel: "合格した検定・級（見出し）",
    gradeLabelPlaceholder: "例：日商簿記2級合格！",
    bioLabel: "一言プロフィール",
    bioPlaceholder: "例：生徒会副会長をやりながら",
    nameLabel: "お名前・呼び名",
    photoLabel: "写真",
    photoHint: "任意。未設定の場合はプレースホルダーが表示されます。",
    uploadingLabel: "アップロードしています…",
    totalHoursLabel: "合計時間",
    mockBestScoreLabel: "模擬最高点",
    totalDaysLabel: "合計日数",
    mockCountLabel: "模擬試験回数",
    recommendPointLabel: "塾の推しポイント（2行まで）",
    recommendPointHint: "改行すると2行で表示されます。",
    submitLabel: "作成する",
    submittingLabel: "保存しています…",
    cancelLabel: "キャンセル",
  },
  errors: {
    required: "入力してください",
    uploadFailed: "写真のアップロードに失敗しました。もう一度お試しください。",
    generic: "保存できませんでした。時間をおいて再度お試しください。",
  },
} as const;

/** 管理画面：検定ページ */
export const adminSubjects = {
  title: "検定ページの管理",
  editLabel: "編集",
  saveLabel: "保存する",
  savingLabel: "保存しています…",
  savedLabel: "保存しました",
  cancelLabel: "キャンセル",
  addRowLabel: "＋ 行を追加",
  removeRowLabel: "削除",
  /** セクション見出し */
  sections: {
    basicInfo: "基本情報",
    basics: "基本情報テーブル",
    training: `対策内容`,
    pricing: "料金プラン",
    pricingPlans: "級ごとの受講料",
    pricingOptions: "追加オプション（任意）",
    struggles: "つまずきやすいポイント",
  },
  /** 各入力欄のラベル */
  fields: {
    name: "検定名（短い表記）",
    fullName: "正式名称",
    category: "カテゴリ",
    organizer: "主催団体",
    tone: "アクセント色",
    catchCopy: "キャッチコピー",
    overview: "概要",
    basicsLabel: "項目名（例：実施回数）",
    basicsValue: "内容（例：年2回）",
    trainingItem: "対策内容の1項目",
    pricingLead: "料金プランのリード文",
    pricingNote: "料金プラン下部の注記",
    planGrade: "級",
    planPrice: "金額",
    planUnit: "単位（例：円 / 1時間）",
    optionName: "オプション名",
    optionPrice: "金額",
    optionDescription: "説明",
    struggleProblem: "つまずきポイント",
    struggleSolution: "解決方法",
  },
  toneOptions: [
    { value: "sakura", label: "ピンク" },
    { value: "lemon", label: "イエロー" },
    { value: "sky", label: "ブルー" },
    { value: "mint", label: "ミント" },
  ] as const,
  errors: {
    required: "入力してください",
    generic: "保存できませんでした。時間をおいて再度お試しください。",
    notFound: "検定が見つかりませんでした。",
  },
} as const;

/**
 * 新着情報。
 * 通常は Supabase の news テーブルから取得する（src/lib/news.ts）。
 * ここに書く items は、Supabase 未設定・取得失敗時のフォールバック用の仮データ。
 */
export const news = {
  title: "新着情報",
  englishTitle: "NEWS",
  moreLabel: "一覧を見る",
  /** トップページのセクションからは、全件を見られる一覧ページへ遷移させる */
  moreHref: "/news",
  /** 一覧ページでの説明文 */
  listLead: "商業検定ラボからのお知らせをまとめています。",
  /** 表示できる記事が1件も無いときの文言 */
  emptyMessage: "現在お知らせはありません。",
  /**
   * カテゴリの選択肢。NewsCategoryTag.tsx の色分けとセットになっている
   * （ここに無いカテゴリ名を管理画面で入力しても保存はできるが、表示色は既定のブルーになる）。
   */
  categories: ["お知らせ", "講座情報", "合格実績"] as const,
  items: [
    {
      id: "1",
      date: "2026.09.05",
      category: "講座情報",
      title: "第100回 全商簿記実務検定1級 直前対策講座の受付を開始しました",
    },
    {
      id: "2",
      date: "2026.08.28",
      category: "合格実績",
      title: "2026年度 第1回検定の合格実績を公開しました",
    },
    {
      id: "3",
      date: "2026.09.05",
      category: "お知らせ",
      title: "全商英検対策アプリをリリースしました。",
    },
  ],
} as const;
