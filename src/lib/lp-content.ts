/**
 * 新しいトップページ（MVP。/lp で表示）の文言。
 * 講師・合格者の声・受講の流れ・対応検定は content.ts / Supabase の値をそのまま使い、
 * ここにはこのページだけの文言を置く。
 *
 * ⚠️ 合格率・「よく出る」などの数字は、運営者が実績として示したものだけ書く（約束05の「検定合格率100%」と
 *    大学の合格実績は 2026-11-05 に運営者が指定）。こちらで数字を作らない。
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

  cta: { small: "今すぐ無料で", big: "体験授業を申し込む", href: "/trial" },
  stickyCta: "今すぐ無料で体験授業を申し込む",

  about: {
    eyebrow: "WHO WE ARE",
    titleAfter: "とは？",
    /** タイプライターで1文字ずつ出す行。hl はオレンジ */
    typeLines: [
      [{ t: "全商検定", hl: true }, { t: "に特化した" }],
      [{ t: "日本初の" }, { t: "商業高校生専門", hl: true }, { t: "の塾です" }],
    ],
    /** 講師カードの上に付けるタグと英字の肩書き・色（content.ts の講師の id ごと） */
    teacherCards: {
      "teacher-2": { tag: "#塾長", en: "Founder", color: "#7b3fe4" },
      "teacher-3": { tag: "#英語顧問", en: "English Advisor", color: "#ec7a6c" },
      "teacher-4": { tag: "#講師", en: "Teacher", color: "#22a24a" },
      "teacher-5": { tag: "#インターン生", en: "Intern", color: "#fb4a19" },
      "teacher-6": { tag: "#インターン生", en: "Intern", color: "#0ea5e9" },
    } as Record<string, { tag: string; en: string; color: string }>,
  },

  band: "Who are we?",

  /** 「こんなお悩みはありませんか？」（WHY LAB の直前）。下の5つの約束につながるお悩みを並べる */
  worries: {
    eyebrow: "YOUR WORRIES",
    titleBefore: "こんな",
    titleKeyword: "お悩み",
    titleAfter: "は",
    title2: "ありませんか？",
    noteTitle: "検定のお悩みチェック",
    items: [
      [{ t: "仕訳や関数でつまずいて、" }, { t: "どこがわからないのかもわからない", hl: true }],
      [{ t: "受ける検定が多くて、" }, { t: "何から手をつければいいか", hl: true }, { t: "迷っている" }],
      [{ t: "学校の授業だけでは" }, { t: "合格できるか不安", hl: true }],
      [{ t: "授業中に" }, { t: "質問しづらくて", hl: true }, { t: "、わからないまま進んでしまう" }],
      [{ t: "部活やテスト週間で忙しくて、" }, { t: "塾に通う時間がない", hl: true }],
      [{ t: "検定だけでなく、" }, { t: "推薦入試や就職のことも", hl: true }, { t: "相談したい" }],
    ],
    answer: [[{ t: "そのお悩み、" }], [{ t: "商ラボ", hl: true }, { t: "が解決します" }]],
  },

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
      body: "英語以外の講師は商業高校の出身です。\n仕訳のルール、関数の組み合わせ、長文の読み方。\n自分たちも同じところでつまずいたからこそ、\nどこでわからなくなるのかを知っています。\n「どこがわからないかわからない」から、\n一緒に探していきます。",
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
      // 2026-11-05 運営者の指示で、実績とアフターフォローの約束に変えた
      habit: ["圧倒的実績と", "充実したアフターフォロー"],
      result: [
        [{ t: "検定合格に" }, { t: "責任", hl: true }, { t: "を持ち" }],
        [{ t: "合格の" }, { t: "先", hl: true }, { t: "まで考える" }],
      ],
      window: "results" as const,
      body: "検定合格率100%。\n進学でも、関西大学・文教大学・\n広島修道大学・専修大学への\n合格実績があります。\n合格したあとも、次に受ける検定の相談から\n推薦入試・総合型選抜、就職試験の対策まで、\n3年間を見すえてサポートします。",
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

  /**
   * ページ上のメニュー（全ページ共通）。トップの場所へ飛ぶものは、下のページからも動くよう "/#..." にする
   */
  nav: [
    { label: "商業検定ラボについて", href: "/#about" },
    { label: "合格へ繋げる5つの約束", href: "/#promise" },
    { label: "合格者の声", href: "/#voice" },
    { label: "対応検定", href: "/subjects" },
    { label: "受講の流れ", href: "/#flow" },
    { label: "講師紹介", href: "/teachers" },
    { label: "よくある質問", href: "/#faq" },
    { label: "コラム", href: "/columns" },
    { label: "新着情報", href: "/news" },
  ],
  /** メニューの下の段に小さく出すリンク */
  navSub: [
    { label: "プライバシーポリシー", href: "/privacy" },
    { label: "特定商取引法に基づく表記", href: "/tokushoho" },
    { label: "ログイン", href: "/login" },
  ],
  menuCta: "無料体験を申し込む",

  /** 申し込みページ（/trial）。入力項目そのものは今のサイトと同じフォーム（TrialForm）を使う */
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
