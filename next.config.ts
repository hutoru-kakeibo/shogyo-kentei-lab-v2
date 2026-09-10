import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 開発用インジケータが画面下部の追従CTAと重なって見た目の確認を妨げるため非表示にする
  devIndicators: false,
};

export default nextConfig;
