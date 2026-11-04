import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 開発用インジケータが画面下部の追従CTAと重なって見た目の確認を妨げるため非表示にする
  devIndicators: false,
  // 新デザインの試作を置いていたURL（2026-11）。共有したリンクを開いた人が、本番の同じページへ移るようにする
  async redirects() {
    return [
      { source: "/lp", destination: "/", permanent: true },
      { source: "/lp/trial", destination: "/trial", permanent: true },
      { source: "/lp/trial/thanks", destination: "/trial/thanks", permanent: true },
      // 無料体験の申し込み・受付設定は、生徒管理アプリ（LINE）の管理画面「体験」へ移した（2026-11-05）
      { source: "/admin/trials/:path*", destination: "https://liff.line.me/2012302910-kaWguuEa/admin/trials", permanent: false },
      { source: "/admin/trial-settings", destination: "https://liff.line.me/2012302910-kaWguuEa/admin/trials/settings", permanent: false },
    ];
  },
  images: {
    // 管理画面からアップロードする合格体験記の写真は Supabase Storage に置かれるため、
    // next/image がその配信元を最適化対象として許可する必要がある。
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xxkcczdryhkoxrvbmqez.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
