"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { admin } from "@/lib/content";
import { createAuthBrowserClient } from "@/lib/auth/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createAuthBrowserClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-1 text-xs font-bold text-ink-muted disabled:opacity-50"
    >
      <LogOut className="size-3.5" strokeWidth={2.5} />
      {admin.logoutLabel}
    </button>
  );
}
