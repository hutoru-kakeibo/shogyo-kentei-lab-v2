"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, LogIn } from "lucide-react";
import { adminLogin } from "@/lib/content";
import { createAuthBrowserClient } from "@/lib/auth/client";

const inputClass =
  "w-full rounded-xl border border-sakura-200 bg-white px-4 py-3 text-[15px] text-ink outline-none placeholder:text-ink-muted/60 focus:border-sakura-400 focus:ring-2 focus:ring-sakura-200";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError(adminLogin.errors.required);
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createAuthBrowserClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError || !data.user) {
        setError(adminLogin.errors.invalidCredentials);
        setSubmitting(false);
        return;
      }

      // 管理者かどうかは admin レイアウト側でも確認するが、
      // ここで弾いておくと「ログインはできたのに何も見えない」を避けられる
      const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");

      if (rpcError || !isAdmin) {
        await supabase.auth.signOut();
        setError(adminLogin.errors.notAdmin);
        setSubmitting(false);
        return;
      }

      // Server Component 側が新しいセッションを認識できるよう、遷移前にリフレッシュする
      router.replace("/admin");
      router.refresh();
    } catch {
      setError(adminLogin.errors.generic);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block font-round text-[14px] font-bold text-ink">
          {adminLogin.emailLabel}
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block font-round text-[14px] font-bold text-ink"
        >
          {adminLogin.passwordLabel}
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClass}
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-2xl bg-sakura-100 p-4 text-[13px] font-bold leading-relaxed text-sakura-600"
        >
          <CircleAlert className="size-5 shrink-0" strokeWidth={2.5} />
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-sakura-400 to-sakura-600 px-8 py-4 font-round text-base font-bold text-white shadow-lg shadow-sakura-600/30 transition active:translate-y-0.5 disabled:opacity-60"
      >
        {submitting ? adminLogin.submittingLabel : adminLogin.submitLabel}
        {submitting ? null : <LogIn className="size-5" strokeWidth={2.5} />}
      </button>
    </form>
  );
}
