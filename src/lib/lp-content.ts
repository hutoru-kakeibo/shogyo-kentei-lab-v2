/**
 * 新しいトップページ（MVP。/lp で表示）の文言。
 * 講師・合格者の声・受講の流れ・対応検定は content.ts / Supabase の値をそのまま使い、
 * ここにはこのページだけの文言を置く。
 *
 * ⚠️ 合格率・「よく出る」などの数字は書かない（根拠のデータがないため）。
 */

export const lp = {
  /** ヘッダー下を流れるハッシュタグ */
  tags: [
    "#全商簿記",
    "#情報処理",
    "#全商英検",
    "#ビジネス文書",
    "#商業経済",
    "#珠算・電卓",
    "#財務諸表分析",
    "#日商簿記",
    "#実用英検",
    "#進路相談",
    "#推薦対策",
  ],

  fv: {
    kicker: "全商検定に悩むすべての商業高校生へ",
    line1: "まだ検定対策",
    keyword: "“ひとり”",
    keywordAfter: "で",
    line3: "がんばってるの？",
    /**
     * iPad に映した授業の画面。塾長が GoodNotes に手書きした実際の授業ノート
     * （オンデマンド「ビジネス計算 建値計算」の画面録画の最後の場面を切り抜いたもの）
     */
    tablet: {
      live: "授業中",
      image: "/images/lp-goodnotes.jpg",
      alt: "塾長がGoodNotesに手書きした建値計算の授業ノート",
    },
    labels: [
      [{ t: "商業高校出身の講師が" }],
      [{ t: "全商検定", hl: true }, { t: "を丸ごとサポート" }],
    ],
    photo: "/images/teacher-m.jpg",
    photoAlt: "塾長 森田智信",
    barSub: ["ZENSHO KENTEI", "ONLINE", "TUTORING"],
  },

  /** 試作のあいだは、試作の申し込みページ（/lp/trial）へつなぐ。差し替えるときは /trial に戻す */
  cta: { small: "今すぐ無料で", big: "体験授業を申し込む", href: "/lp/trial" },
  stickyCta: "今すぐ無料で体験授業を申し込む",

  about: {
    eyebrow: "WHO WE ARE",
    titleAfter: "とは？",
    /** タイプライターで1文字ずつ出す行。hl はオレンジ */
    typeLines: [
      [{ t: "全商検定", hl: true }, { t: "に特化した" }],
      [{ t: "日本初の" }, { t: "商業高校生専門", hl: true }, { t: "の塾です" }],
    ],
    /** 講師カードの上に付けるタグと英字の肩書き（content.ts の講師の並び順に対応） */
    teacherCards: [
      { tag: "#講師", en: "Teacher", color: "#fb4a19" },
      { tag: "#塾長", en: "Founder", color: "#7b3fe4" },
      { tag: "#英語顧問", en: "English Advisor", color: "#ec7a6c" },
      { tag: "#講師", en: "Teacher", color: "#22a24a" },
    ],
  },

  band: "Who are we?",

  why: {
    eyebrow: "WHY LAB",
    titleBefore: "なぜ",
    titleKeyword: "“商ラボ”",
    titleAfter: "だと",
    title2: "合格に近づくのか？",
    /** カードのロゴ「商業検定ラボ」のあとに続ける文字 */
    cardLogoAfter: "が",
    cardBefore: "合格へ繋げる",
    cardNumber: "5",
    cardAfter: "つの約束",
  },

  /** 5つの約束。window はモック画面の種類（LpPromiseWindow.tsx） */
  promises: [
    {
      habit: ["商ラボの講師は商業高校出身!"],
      result: [
        [{ t: "つまずくポイントを" }],
        [{ t: "先回り", hl: true }, { t: "して指導" }],
      ],
      window: "weak" as const,
      body: "ほとんどの講師が商業高校の出身です。\n仕訳のルール、関数の組み合わせ、長文の読み方。\n自分たちも同じところでつまずいたからこそ、\nどこでわからなくなるのかを知っています。\n「どこがわからないかわからない」から、\n一緒に探していきます。",
    },
    {
      habit: ["商ラボは全商検定を", "ぜんぶ対策できる"],
      result: [
        [{ t: "簿記・情報処理・英検" }],
        [{ t: "全部" }, { t: "まとめて", hl: true }, { t: "相談できる" }],
      ],
      window: "subjects" as const,
      body: "簿記実務・情報処理・英語・ビジネス文書・商業経済・珠算電卓。\n商業高校で受ける全商検定を、ひとつの塾で対策できます。\n検定ごとに塾を探す必要はありません。\nどの検定から受けるかの順番も、一緒に考えます。",
    },
    {
      habit: ["商ラボは", "1対1でしか教えない"],
      result: [
        [{ t: "わからないところを" }],
        [{ t: "その場で", hl: true }, { t: "解決できる" }],
      ],
      window: "chat" as const,
      body: "授業はすべて講師と1対1のオンライン個別指導。\n集団授業のように、質問をためらう必要はありません。\nわかるまで何度でも、あなたのペースで進めます。\n授業のあとの質問対応や、過去問の振り返りまで\n一貫してサポートします。",
    },
    {
      habit: ["商ラボの授業は", "ぜんぶオンライン"],
      result: [
        [{ t: "部活やテスト週間と" }],
        [{ t: "両立", hl: true }, { t: "できる" }],
      ],
      window: "schedule" as const,
      body: "授業はスマホやパソコンから、家で受けられます。\n通塾の時間はかかりません。\n部活の大会やテスト週間に合わせて、\n授業の日時を自由に調整できます。\n全国どこからでも受講できます。",
    },
    {
      habit: ["商ラボは合格だけで", "満足できない"],
      result: [
        [{ t: "次の検定や" }, { t: "進路", hl: true }, { t: "まで" }],
        [{ t: "一緒に考える" }],
      ],
      window: "roadmap" as const,
      body: "検定はゴールではなく、進学や就職への通過点。\n合格したあとは、次にどの検定を受けるかを\n無料で相談できます。\n推薦入試や総合型選抜、就職試験まで、\n3年間を見すえて一緒に計画を立てます。",
    },
  ],

  must: {
    small: "全商検定の合格には",
    bigBefore: "商ラボが",
    bigKeyword: "必須",
    bigAfter: "!!",
    image: "/images/strong-point-1.jpg",
    imageAlt: "生徒の相談に乗る講師",
  },

  voice: {
    eyebrow: "VOICE",
    title: "合格者の声を一部ご紹介",
  },

  service: {
    eyebrow: "SERVICE",
    title: "対応検定",
    lead: "検定対策から進路相談まで、ぜんぶ商ラボが担当",
    moreLabel: "etc...",
    moreHref: "/subjects",
  },

  flow: {
    eyebrow: "FLOW",
    titleKeyword: "商ラボ",
    titleAfter: "で合格を",
    title2: "つかむまでの流れ",
  },

  close: {
    titleLine1: "商ラボがあなたの",
    titleKeyword: "合格",
    titleAfter: "を本気で支えます",
    selectLabel: "対策したい検定",
    required: "必須",
    selectPlaceholder: "選択してください",
    undecided: "まだ決めていない・相談したい",
    submitLabel: "無料体験を申し込む",
    note: "次の画面で、学年・連絡先・体験の日時を選べます。",
  },

  /** 申し込みページ（/lp/trial）。入力項目そのものは今のサイトと同じフォーム（TrialForm）を使う */
  trial: {
    back: "トップに戻る",
    labels: [[{ t: "まずは1時間の" }], [{ t: "無料体験", hl: true }, { t: "から!!" }]],
    title: [
      [{ t: "講師と" }],
      [{ t: "1対1", hl: true }, { t: "の授業を" }],
      [{ t: "体験しよう!!" }],
    ],
    stepsLead: "入力はかんたん",
    stepsKeyword: "3ステップ",
    eyebrow: "ENTRY",
    /** 無料体験でやること（ノート風のチェックリスト） */
    expect: {
      eyebrow: "TRIAL",
      title: "無料体験でやること",
      noteTitle: "体験授業でやること",
      items: [
        "いまの学習状況と、検定日までの期間をうかがいます",
        "講師と1対1で、実際の授業を体験できます",
        "自分に合っているかを、その場でチェックできます",
      ],
      note: "※体験は1時間・オンラインで行います",
    },
  },

  /** 申し込み完了ページ（/lp/trial/thanks） */
  thanks: {
    labels: [[{ t: "ページを閉じるのは" }], [{ t: "ちょっと待って", hl: true }, { t: "ください!!" }]],
    title: [
      [{ t: "体験の日までに" }],
      [{ t: "無料授業", hl: true }, { t: "を" }],
      [{ t: "のぞいてみよう!!" }],
    ],
    ctaLead: "体験の前に授業の雰囲気を知りたい人は",
    ctaKey: "Instagramで無料授業をチェック",
    ctaLabel: "公式Instagramを見る",
    ctaNote: "授業の切り抜き動画を投稿しています",
    instagram: "https://www.instagram.com/syougyoukenteilabo/",
    band: "Thank you!!!",
    eyebrow: "MESSAGE",
    message: ["無料体験のお申し込み", "ありがとうございます!!"],
    /** 申し込み後の連絡（今のサイトの完了メッセージと同じ内容） */
    contact: ["内容を確認のうえ、3日以内に", "ご記入いただいた連絡先へ", "ご連絡します。", "しばらくお待ちください。"],
    body: [
      [{ t: "では、" }],
      [{ t: "商業高校出身の講師が" }],
      [{ t: "つまずくポイントを先回りして", mark: true }],
      [{ t: "指導しています。" }],
    ],
    body2: [
      [{ t: "体験授業では、" }],
      [{ t: "いまの学習状況をうかがいながら" }],
      [{ t: "実際の授業を体験", mark: true }, { t: "できます。" }],
    ],
    teamNote: [{ t: "当日は講師と" }, { t: "1対1のオンライン", hl: true }, { t: "で行います。" }],
  },

  footer: {
    links: [
      { label: "特定商取引法に基づく表記", href: "/tokushoho" },
      { label: "プライバシーポリシー", href: "/privacy" },
    ],
    copyright: "© 商業検定ラボ",
  },
};

/** hl はオレンジの文字、mark は下線のマーカー */
export type LpTextPart = { t: string; hl?: boolean; mark?: boolean };
