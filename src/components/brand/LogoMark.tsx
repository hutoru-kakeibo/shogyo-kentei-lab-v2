import { useId } from "react";

/**
 * 商業検定ラボのマーク（フラスコ）。2026-10-19 に決まったロゴ。
 * 元データは C:\商業検定ラボ\ロゴ\logo-mark.svg。形や色を変えるときは元データと揃える。
 * 1ページに複数置いても clipPath の id がぶつからないよう useId で作る。
 */
export function LogoMark({ className }: { className?: string }) {
  const clipId = useId();
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clipId}>
          <path d="M44 38 L24 76 Q19 88 31 88 H69 Q81 88 76 76 L56 38 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <path d="M10 60 Q22 54 34 60 T58 60 T82 60 T106 60 V100 H10 Z" fill="#fb6f9d" />
      </g>
      <path
        d="M37 73 L46 81 L63 64"
        fill="none"
        stroke="#ffffff"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="46" cy="50" r="3.2" fill="#f8c721" />
      <circle cx="54" cy="44" r="2.2" fill="#34c9a7" />
      <circle cx="50" cy="27" r="2" fill="#00a2e7" />
      <path
        d="M41 10 H59 M44 10 V38 L24 76 Q19 88 31 88 H69 Q81 88 76 76 L56 38 V10"
        fill="none"
        stroke="#43304a"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M72 4 L74 11 L81 13 L74 15 L72 22 L70 15 L63 13 L70 11 Z" fill="#f8c721" />
    </svg>
  );
}
