# 商業検定ラボ v2 — 仕様書

> このファイルはプロジェクトの現状をまとめた仕様書です。実装の詳細は各ファイルのコメントを参照してください。
> **固定の文言・データは `src/lib/content.ts` が情報源です。** 新着情報・合格体験記・検定ページ・コラム・
> 無料体験の受付設定は **Supabase（管理画面から編集）** が情報源で、`content.ts` / `subjects.ts` の値は
> DBが使えないときのフォールバックです。このドキュメントとコードが食い違ったら、コードを正としてこのファイルを更新してください。
>
> ⚠️ **GitHubリポジトリは公開（public）です。** パスワード・APIキー・授業申し込みページの秘密の文字列・
> 生徒の個人情報は、このファイルを含めリポジトリに書かないこと（`.env.local` と Vercel の環境変数だけに置く）。

最終更新: 2026-09-18

---

## 1. プロジェクト概要

| 項目 | 内容 |
|---|---|
| サイト名 | 商業検定ラボ |
| キャッチコピー | 日本初の商業高校生専門検定塾 |
| コンセプト | 全商検定（簿記・情報処理・英語・ビジネス文書・珠算電卓 など）に特化した、商業高校生専門のオンライン個別指導塾のサイト |
| ターゲット | 15〜18歳の商業高校生（メインは女子高生を想定） |
| デザイン方針 | パステルピンク（sakura）＋パステルイエロー（lemon）が基調、スカイブルー（sky）とミント（mint）がアクセント。レイアウトの型は「東京アカデミー」のスマホサイトを参考にし、文言・データは独自 |
| 技術スタック | Next.js 16（App Router / Turbopack）+ TypeScript + Tailwind CSS v4 + lucide-react |
| バックエンド | Supabase（DB・認証・画像ストレージ）＋ Gmail（Nodemailer 経由の自動返信・通知メール） |
| 本番URL | **https://shogyo-kentei-lab-academy.com**（ムームードメインで取得。`www` 付きは `www` なしへ 308 転送） |
| リポジトリ | GitHub `hutoru-kakeibo/shogyo-kentei-lab-v2`（**public**）。`main` ブランチ |
| デプロイ | Vercel（プロジェクト `shogyo-kentei-lab-v2`）。`main` への push で自動デプロイ |

> Next.js 16 は従来と仕様が異なる点がある（例：`middleware.ts` は `proxy.ts` に改名）。実装前に
> `node_modules/next/dist/docs/` の該当ガイドを確認すること（[AGENTS.md](AGENTS.md)）。

---

## 2. ディレクトリ構成

```
website2/
├── .env.local              # 接続情報・秘密の値（Git管理外）
├── .env.local.example      # ↑のひな形（Git管理あり。値は空）
├── next.config.ts          # devIndicators 無効化、Supabase Storage の画像を next/image で許可
├── scripts/                # セットアップ・動作確認用のCLI（6章）
├── supabase/               # Supabase の SQL Editor で実行するSQL（5.1）
├── public/images/          # サイト内に置く画像（講師写真・OGP画像・STRONG POINT・合格体験記の画像など）
└── src/
    ├── proxy.ts            # /admin 配下でログインセッションを更新（Next.js 16 の proxy）
    ├── app/
    │   ├── layout.tsx      # ルート。フォント読み込み・サイト共通のメタデータ（title / OGP / robots）
    │   ├── sitemap.ts      # /sitemap.xml（7.4）
    │   ├── robots.ts       # /robots.txt（7.4）
    │   ├── (site)/         # 生徒向けページ。ヘッダー・ボトムナビ・スマホ幅の枠はこの layout.tsx が持つ
    │   │   ├── page.tsx                 # トップページ
    │   │   ├── trial/page.tsx           # 無料体験の申し込み（4章）
    │   │   ├── lesson/[token]/page.tsx  # 既存生徒用の授業申し込み（4.5）
    │   │   ├── subjects/[slug]/page.tsx # 検定詳細ページ（8章）
    │   │   ├── news/page.tsx            # 新着情報の一覧
    │   │   └── columns/                 # コラム一覧・記事ページ（9章）
    │   ├── login/page.tsx  # 管理者ログイン
    │   └── admin/          # 管理画面（6章。layout.tsx で管理者以外を /login へ転送）
    ├── components/
    │   ├── layout/         # SiteHeader / BottomNav / ScrollTopButton
    │   ├── sections/       # トップページの各セクション（2.1）
    │   ├── forms/          # 申し込みフォーム・日時ピッカー・ログインフォーム
    │   ├── admin/          # 管理画面の一覧・フォーム
    │   ├── seo/JsonLd.tsx  # 構造化データ（7.3）
    │   └── ui/             # 汎用パーツ（ImagePlaceholder、コラム本文の表示 など）
    └── lib/
        ├── content.ts          # 固定の文言・データ、DBのフォールバック値
        ├── subjects.ts         # 検定詳細のフォールバックデータ（公開できる検定の一覧もここが正）
        ├── supabase.ts         # 匿名キーのクライアント（未設定なら null）
        ├── auth/               # Cookie でログイン状態を持つクライアント、管理者判定
        ├── admin/*-actions.ts  # 管理画面のサーバーアクション（必ず管理者かを再確認）
        ├── trial-actions.ts    # 申し込みの保存・受付設定と予約状況の取得
        ├── trial-schedule.ts   # 受付日時の計算（日本時間基準。ブラウザ・サーバー共通）
        ├── trial-schedule-data.ts # 受付設定のDB取得
        ├── lesson-token.ts     # 授業申し込みページの秘密の文字列の照合
        ├── emails.ts / mailer.ts  # メール文面と送信
        ├── news.ts / voice.ts / subjects-data.ts / articles.ts # 各DBの読み取り（失敗時はフォールバック）
        ├── article-body.ts     # コラム本文の記法の変換
        └── seo.ts              # OGPの補完、検定ページの呼び名、公開判定
```

### 2.1 トップページのセクション（`src/app/(site)/page.tsx` の並び順）

1. **Hero** — 斜めに敷き詰めた画像タイル（現状プレースホルダー）、キャッチコピー「ひとりじゃないから、／全商、ぜんぶ受かる！」（ページ唯一の `h1`）、丸バッジ3つ
2. **About**（`#about`）— 商業検定ラボとは。塾長メッセージと基本情報
3. **StrongPoint**（`#strong-point`）— Point 1〜3。`content.ts` の `hidden: true` のポイントは非表示（現状 Point 2・3 は本格実装まで非表示）。`image` があれば写真、なければプレースホルダー
4. **CourseSearch**（`#course`）— 検定を探す（8.3）
5. **Flow**（`#flow`）— 受講の流れ STEP 01〜04
6. **Teachers**（`#teachers`）— 講師紹介。講師3名とも実写真。自己紹介欄は改行（`\n`）を表示する
7. **Voice**（`#voice`）— 合格者の声（10章）
8. **FreeMaterials**（`#materials`）— 無料教材（全商英検対策アプリ）
9. **Columns** — 最新コラム3件。**公開中のコラムが0件ならセクションごと表示しない**
10. **Faq**（`#faq`）— よくある質問
11. **News**（`#news`）— 新着情報の最新3件

ハンバーガーメニュー（`globalNav`）の「コラム」は、欄が非表示のこともあるためアンカーではなく `/columns` へリンクする。

---

## 3. デザインシステム

### 3.1 カラーパレット（`src/app/globals.css` の `@theme`）

| トークン | 役割 | 代表色 |
|---|---|---|
| `sakura-50〜600` | メイン1（パステルピンク） | `sakura-500` = `#fb6f9d` |
| `lemon-50〜600` | メイン2（パステルイエロー）。**白文字は読めないため濃いインク色と組み合わせる** | `lemon-500` = `#f8c721` |
| `sky-50〜600` | サブ（スカイブルー） | `sky-500` = `#00a2e7` |
| `mint-100/300/500` | サブ（合格・チェックなどのポジティブ強調） | `mint-500` = `#34c9a7` |
| `canvas` | 背景色（薄ピンク寄りの白） | `#fff9fb` |
| `ink` / `ink-muted` | 本文色／補助テキスト色 | `#43304a` / `#8b7a90` |

各カード・セクションは `tone: "sakura" | "lemon" | "sky" | "mint"` で色を切り替え、`Record<PlaceholderTone, string>` 形式のトーン別クラスマップを各コンポーネントで持つのが定着したパターン。

### 3.2 タイポグラフィ

- 本文：Noto Sans JP（`font-sans`）／見出し：Zen Maru Gothic（`font-round`）／英字の手書き風：Caveat（`font-script`）
- 日本語Googleフォントは `next/font/google` の `subsets: ["japanese"]` がビルドエラーになるため、`src/app/layout.tsx` の `<head>` で手動 `<link>` している

### 3.3 レイアウトの型

- モバイルファースト。`max-w-[480px]` のスマホ幅の枠を画面中央に置く（`(site)/layout.tsx`）
- 見出しは「`font-round` のタイトル → `font-script` の英字 → リード文」が基本
- カードは `rounded-2xl〜3xl` ＋ `shadow-md shadow-sakura-600/10` ＋ `ring-1 ring-sakura-100`

---

## 4. 申し込みフォーム（無料体験・授業）

無料体験（`/trial`）と既存生徒の授業（4.5）は、同じフォーム部品（`TrialForm` の `kind` で切り替え）と同じ受付枠を使う。

### 4.1 入力項目

| 項目 | 種類 | 必須 |
|---|---|---|
| 受けたい検定（授業では「受講する検定」） | プルダウン（`courseSearch` の全項目 ＋「まだ決めていない・相談したい」） | ● |
| 受験予定の級 | プルダウン（3級／2級／1級／まだ決めていない） | ● |
| お名前 | テキスト | ● |
| ふりがな | テキスト | 任意 |
| 学年 | プルダウン（高1／高2／高3／その他） | ● |
| 学校名 | テキスト | ● |
| メールアドレス | メール（形式チェックあり） | ● |
| 電話番号 | 電話 | 任意 |
| 希望日時 | カレンダーで日付 → その日の空いている時間を選択（`TrialDateTimePicker`、クライアント専用で読み込み） | ● |
| 相談したいこと（授業では「先生に伝えたいこと」） | 複数行テキスト | 任意 |
| 保護者の同意 | チェックボックス | ● |

### 4.2 受付日時のルール（管理画面「無料体験の受付設定」で変更）

設定は Supabase の `trial_settings` テーブル（1行のみ）に保存され、管理画面から変更する（6.2）。テーブルが無い・取得に失敗したときは `content.ts` の `trialSchedule` を使う。

| 設定 | 内容 |
|---|---|
| 受付開始 | 今日から何日後から申し込めるか（0 = 当日から） |
| 受付期間 | 今日から何日先まで申し込めるか |
| 曜日ごとの受付時間 | 曜日ごとの時間の一覧。空の曜日は受付なし |
| 日ごとの受付時間 | その日だけの時間（`date_overrides`）。曜日の設定より優先 |
| 休講日 | 受付を止める日（`closed_dates`）。最優先 |

- 優先順位は **休講日 → 日ごとの設定 → 曜日ごとの設定**（`src/lib/trial-schedule.ts` の `slotsForDate`）
- 日付計算はすべて **日本時間**（サーバーはUTCのため）。当日受付のときは、**日本時間で過ぎた時間は選べない・申し込めない**
- カレンダーは受付設定と予約状況をサーバーアクション（`getTrialSchedule` / `getTakenSlots`）で毎回取得するので、管理画面での変更がすぐ反映される

### 4.3 予約の重複防止と受付枠の共有

- `trial_applications` に `(preferred_date, preferred_time)` の一意インデックス（`status <> 'canceled'` の行のみ）があり、**同じ日時には1件しか入らない**。種別を区別しないため、**無料体験と授業は同じ枠を共有**する
- 空き状況は `trial_taken_slots` 関数（SECURITY DEFINER）で、個人情報を含めず日付・時間だけを返す
- 申し込みを管理画面で「キャンセル」にすると、その枠は再び空く

### 4.4 送信フロー（`submitTrialApplication`）

1. ブラウザ側で入力チェック（エラー項目へ自動スクロール）
2. サーバー側で再チェック。ボット対策の隠し項目 `website` が埋まっていれば保存せず正常終了扱い
3. 授業（`kind: "lesson"`）の場合は、ページURLの秘密の文字列が正しいかを再確認（4.5）
4. 選ばれた日時が受付期間・受付時間内かを確認（`isBookable`）。外れていれば「現在受け付けていません」
5. `trial_applications` に保存。同じ日時が埋まっていれば（一意制約違反）「ちょうど埋まってしまいました」
6. 申込者への自動返信と、塾への通知メールを送信（種別ごとに文面を切り替え）。メールが失敗しても申し込みは成立
7. 日時のエラーのときは選択を外し、カレンダーを作り直して最新の空き状況を取り直す

### 4.5 既存生徒用の授業申し込み（`/lesson/<秘密の文字列>`）

- 在籍中の生徒だけが使う申し込みページ。**サイト内のどこからもリンクせず、サイトマップ・robots.txt にも載せない**
- 秘密の文字列は **環境変数 `LESSON_FORM_TOKEN` にだけ置く**（公開リポジトリに書かない）。一致しないURLは404
- `noindex, nofollow, nocache`、canonical なし、`referrer: no-referrer`
- URLが外部に漏れた場合は、Vercel の `LESSON_FORM_TOKEN` を新しいランダムな値に変えて再デプロイすれば、古いURLは使えなくなる
- 保存時は `kind = 'lesson'`。無料体験は `kind` を送らず、列の既定値（`trial`）になる

---

## 5. バックエンド連携

### 5.1 Supabase

| 用途 | テーブル・関数 | SQL |
|---|---|---|
| 管理者の判定 | `admins`、`is_admin()` | [admin.sql](supabase/admin.sql) |
| 新着情報 | `news` | [news.sql](supabase/news.sql) |
| 申し込み（無料体験・授業） | `trial_applications`（`kind` 列）、`trial_taken_slots()` | [trial_applications.sql](supabase/trial_applications.sql)、[trial_applications_kind.sql](supabase/trial_applications_kind.sql) |
| 受付設定 | `trial_settings`（`date_overrides` 列） | [trial_settings.sql](supabase/trial_settings.sql)、[trial_settings_date_overrides.sql](supabase/trial_settings_date_overrides.sql) |
| 合格体験記 | `voices`、Storage バケット `voice-photos` | [voices.sql](supabase/voices.sql) |
| 検定詳細ページ | `subjects` | [subjects.sql](supabase/subjects.sql)、[subjects-add-3.sql](supabase/subjects-add-3.sql)、[subjects-fix-3.sql](supabase/subjects-fix-3.sql) |
| コラム | `articles` | [articles.sql](supabase/articles.sql) |

いずれも実行済み。

**アクセス制御（RLS）の方針**

- 公開コンテンツ（公開済みの新着情報・コラム、合格体験記、検定ページ、受付設定）は誰でも読める。書き込みは `is_admin()` の管理者だけ
- `trial_applications` は **誰でも INSERT のみ可**。読み取り・更新は管理者だけ。匿名キーでは他人の申し込み（氏名・連絡先）を読めない
- 管理画面のサーバーアクションでも、RLSとは別に必ず `isCurrentUserAdmin()` で管理者かを確認する

**キャッシュと反映**

| ページ | 再生成の間隔 | 備考 |
|---|---|---|
| トップ | 5分 | 新着情報・合格体験記・コラムを含む |
| `/news` | 1分 | |
| 検定詳細・コラム | 5分 | コラムは保存時に `revalidatePath` で即時反映 |
| `/sitemap.xml` | 1時間 | コラム保存時にも即時反映 |
| 申し込みフォームのカレンダー | 毎回取得 | 受付設定の保存時に `/trial` も再生成 |

DBの取得に失敗しても、各 `lib` はフォールバック（`content.ts` / `subjects.ts` の値、または空）で表示を続け、ページを落とさない。

### 5.2 メール（Gmail / Nodemailer）

- `src/lib/mailer.ts` — 送信クライアント。環境変数が未設定なら送らず `false` を返す（例外を投げない）
- `src/lib/emails.ts` — 文面。種別で件名・本文を切り替える
  - 申込者：「【商業検定ラボ】無料体験（授業）のお申し込みを受け付けました」
  - 塾：「【体験申込】」または「【授業申込】」＋氏名・検定・希望日時。`replyTo` が申込者なので、そのまま返信できる
- 通知の宛先は環境変数 `NOTIFY_EMAIL`

### 5.3 環境変数

| 変数 | 内容 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase の接続情報（匿名キー） |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | 送信元のGmailと、Googleで発行した16桁のアプリパスワード |
| `NOTIFY_EMAIL` | 申し込み通知の宛先（未設定なら `GMAIL_USER`） |
| `LESSON_FORM_TOKEN` | 授業申し込みページの秘密の文字列（未設定ならページは404） |

- ローカルは `.env.local`（Git管理外）、本番は **Vercel の Settings → Environment Variables** に同じ6つを登録済み
- 本番の値を変えたら、Vercel で **Redeploy** しないと反映されない
- ひな形は [.env.local.example](.env.local.example)（値は空）

---

## 6. 管理画面（`/admin`）

- `/login` で Supabase Auth のメールアドレス＋パスワードでログイン。`admins` テーブルに載っているメールアドレスだけが管理者
- `/admin` 配下は `admin/layout.tsx` で管理者以外を `/login` へ転送。`/login` と `/admin` は noindex、robots.txt でもクロール対象外
- `/admin` と `/login` は生徒向けのヘッダー・ボトムナビを持たない（`(site)` グループの外）

### 6.1 機能一覧（ダッシュボードの並び順）

| メニュー | できること |
|---|---|
| 新着情報 | 一覧・作成・編集・削除・公開／非公開 |
| 申し込み（無料体験・授業） | 一覧・詳細、対応状況（新規／連絡済み／完了／キャンセル）の更新。種別バッジで無料体験と授業を区別 |
| 無料体験の受付設定 | 受付期間、曜日ごとの受付時間、日ごとの受付時間（カレンダー）、休講日（6.2） |
| 合格体験記 | 追加・削除（**編集は不可**。直すときは削除して追加し直すか、SQLで更新） |
| 検定ページ | 既存の検定ページの内容編集（**追加・削除は不可**。追加はSQLで行う：8.4） |
| コラム | 一覧・作成・編集・削除・下書き（9章） |

### 6.2 無料体験の受付設定の画面

- 受付期間は「今日時点で選べる期間」をその場で表示
- 曜日ごとの受付時間は、9:00〜22:00 をタップで切り替え＋任意の時刻を追加
- 日ごとの受付時間は月のカレンダーで日付を選ぶ。**予約が入っている日には水色の点**、選んだ日の**予約済みの時間は「予約あり」で切り替え不可**（生徒側と同じ予約状況を表示）。「この日を休講にする」「曜日の設定に戻す」も可能
- 設定を変えても、すでに入っている申し込みは取り消されない（管理画面の申し込み一覧から個別に対応）

---

## 7. SEO

### 7.1 ドメイン・Search Console

- 本番は独自ドメイン `shogyo-kentei-lab-academy.com`。旧URL（`*.vercel.app`）は削除済み
- `siteMeta.url`（`content.ts`）を変えると、canonical・OGP・サイトマップのURLが一括で変わる
- Google Search Console はドメインプロパティで登録済み（ムームーDNSにTXTレコード）。サイトマップ送信済み

### 7.2 タイトル・メタデータ

- トップの `<title>` は `siteMeta.title`（「商業検定ラボ｜全商検定対策のオンライン個別指導塾」）。下層は「ページ名｜商業検定ラボ」
- 検定ページのタイトルは「全商〇〇の対策・勉強法」。「全商」は **全商検定カテゴリの科目だけ**に付け、英語検定は `subjectSearchNames` で「全商英検（英語検定）」にする（`src/lib/seo.ts`）
- 公開ページは canonical を設定。OGP画像は `/images/og.png`（1200×630）。下層ページで `openGraph` を指定するとルートの設定が丸ごと上書きされるため、`withDefaultOpenGraph()` で画像・サイト名を補う

### 7.3 構造化データ（`src/components/seo/JsonLd.tsx`）

| 種類 | 置き場所 |
|---|---|
| `EducationalOrganization`（`sameAs` に公式Instagram） | トップ |
| `FAQPage` | トップ |
| `Course` ＋ `BreadcrumbList` | 検定詳細 |
| `BlogPosting` ＋ `BreadcrumbList` | コラム記事 |
| `BreadcrumbList` | コラム一覧 |

公式SNSは `content.ts` の `socialLinks`。JSON-LD の出力では `<` をエスケープし、入力文字列で `</script>` を閉じられないようにしている。

### 7.4 サイトマップ・robots.txt

- `/sitemap.xml`：トップ、`/trial`、`/columns`、`/news`、**公開中の検定ページ**、公開中のコラム記事
- `/robots.txt`：全体を許可し、`/admin` と `/login` を除外。サイトマップの場所を記載
- 授業申し込みページは、どちらにも載せない

---

## 8. 検定詳細ページ（`/subjects/[slug]`）

### 8.1 データ

- 内容は Supabase の `subjects` テーブル（管理画面で編集）。取得できないときは `src/lib/subjects.ts` の値を使う
- **ページを持つ検定の一覧（slug）は `subjects.ts` が正**（`generateStaticParams` と「検定を探す」のリンク判定に使う）

### 8.2 ページ構成

ヒーロー → どんな検定？（概要＋基本情報） → 商業検定ラボの対策 → 料金プラン（級ごと＋任意のオプション） → つまずきやすいポイント → 無料体験へのCTA。料金は検定ごとに管理画面で設定する。

### 8.3 公開状態と「検定を探す」

公開するかどうかは `content.ts` の `courseSearch` の `ready` で決まる（`isSubjectPublished`）。

| 状態 | 一覧 | 検索・サイトマップ |
|---|---|---|
| `ready: true` かつページあり | リンクあり | 検索対象、サイトマップに掲載 |
| `ready: false` だがページあり（下書き） | 「準備中」・リンクなし | `noindex`、サイトマップに載せない |
| ページなし | 「準備中」・リンクなし | — |

**公開中（9件）**：簿記実務検定、情報処理検定（ビジネス情報）、情報処理検定（プログラミング）、英語検定、ビジネス文書実務検定、珠算・電卓実務検定、商業経済検定、財務諸表分析検定、日商簿記検定

**準備中（ページなし）**：推薦・総合型選抜対策、就職試験対策

### 8.4 検定ページを追加する手順

1. `src/lib/subjects.ts` に下書きを追加（slug・内容・料金）
2. 同じ内容を `subjects` テーブルに入れるSQLを Supabase で実行（例：[subjects-add-3.sql](supabase/subjects-add-3.sql)）
3. 管理画面で内容を仕上げる（`ready: false` の間は検索に出ない）
4. `courseSearch` の該当項目を `ready: true` にしてデプロイ

---

## 9. コラム（`/columns`）

- 勉強法などの記事。一覧 `/columns`、記事 `/columns/<URL>`。カテゴリは「勉強法」「検定情報」「進路・就職」
- 管理画面で作成・編集・削除・下書き。URL（slug）は半角英小文字・数字・ハイフン（**公開後は変えない**）
- 本文は記号で書く：`## 見出し`、`### 小見出し`、`- 箇条書き`、`1. 番号付き`、`**太字**`、`[文字](URL)`。HTMLとしては解釈しないため、本文に `<script>` などを書いても文字として表示される。リンクは `https://` かサイト内パスのみ
- 記事の最後に無料体験への案内を表示

---

## 10. 合格者の声（合格体験記）

- データは Supabase の `voices` テーブル（管理画面で追加・削除）。新しい順に表示
- カードは1枚ずつ表示。**左右スワイプ**（横に40px以上、かつ縦より大きく動かしたとき）と、下の**ドット**で切り替え。スマホ幅を使い切るため左右の矢印は置かない
- 「塾の推しポイント」は任意。**空欄のときは欄ごと表示しない**
- 写真は Storage（`voice-photos`）の公開URL、またはサイト内の画像パス（`/images/...`）

---

## 11. 運用スクリプト（`scripts/`）

`npm run <script>`、または `node scripts/<file>.mjs` で実行（PowerShellの実行ポリシーで `npm` 経由が失敗する場合は後者）。

| コマンド | 役割 |
|---|---|
| `npm run setup:supabase -- <URL> <ANON_KEY>` | Supabaseの接続情報を `.env.local` に書き込む |
| `npm run check:supabase` | 接続とテーブルの存在を確認 |
| `npm run setup:gmail -- <アドレス> <アプリパスワード> [通知先]` | Gmail送信設定を `.env.local` に書き込む |
| `npm run check:mail` | Gmailへの接続確認＋テストメール送信 |

---

## 12. 未着手・今後の課題

### 12.1 コンテンツ

| 項目 | 現状 |
|---|---|
| ヒーローの画像タイル | すべてプレースホルダー（アイコン代替） |
| STRONG POINT の Point 2・3 | 本格実装まで非表示（`hidden: true`）。Point 3 はイラストを用意済み |
| 財務諸表分析検定の合格基準 | 公式の記載を確認できず未掲載。確認できたら管理画面で追加 |
| 合格体験記 | 推しポイント未入力のものがある（聞けたらSQLで更新）。写真が仮置きのものがある |
| コラム | 継続して記事を増やす |

### 12.2 機能・ページ

- 推薦・総合型選抜対策、就職試験対策のページ
- 合格体験記の編集機能（現状は追加・削除のみ）
- 管理画面からの検定ページの追加（現状はSQL）

### 12.3 運用

- Search Console でインデックス状況・検索キーワードを定期的に確認
- 表示速度の計測（PageSpeed Insights）と改善
- 外部からのリンク（アプリの説明欄・SNSのプロフィールにサイトURLを掲載）

---

## 13. 旧プロジェクトとの関係

`C:\商業検定ラボ\website`（GitHub `hutoru-kakeibo/shogyo-kentei-lab`）は、Funda簿記を参考にした先行プロジェクト。本プロジェクトはそのコード・データを引き継がず、ゼロから作り直したもの。
**旧サイトの Vercel プロジェクトは削除済み**で、本番は本プロジェクトのみ。旧プロジェクトのリポジトリとローカルの作業中ファイルは残っている。
