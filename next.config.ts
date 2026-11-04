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
