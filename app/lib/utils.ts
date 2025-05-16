import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-h1-l",
        "text-h1-m",
        "text-h1-r",
        "text-h1-s",
        "text-h1-xs",
        "text-h2-l",
        "text-h2-m",
        "text-h2-r",
        "text-h2-s",
        "text-title-l",
        "text-title-m",
        "text-title-s",
        "text-title-xs",
        "text-subtitle-l",
        "text-subtitle-m",
        "text-subtitle-s",
        "text-subtitle-xs",
        "text-body-l",
        "text-body-m",
        "text-body-s",
        "text-display-1",
        "text-display-2",
        "text-display-3",
        "text-display-4",
        "text-title-1",
        "text-title-2",
        "text-title-3",
        "text-title-4",
        "text-heading-1",
        "text-heading-2",
        "text-heading-3",
        "text-heading-4",
        "text-heading-5",
        "text-headline-1",
        "text-headline-2",
        "text-headline-3",
        "text-body-1",
        "text-body-2",
        "text-body-3",
        "text-body-4",
        "text-caption",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

/**
 * 주어진 타임스탬프를 상대적 시간 형식으로 포맷팅합니다.
 * 예: "방금 전", "1분 전", "3시간 전", "어제" 등
 */
export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(date.getTime())) {
    return timestamp; // 유효하지 않은 날짜인 경우 원본 문자열 반환
  }

  if (diffInSeconds < 60) {
    return "방금 전";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}분 전`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}시간 전`;
  } else if (diffInSeconds < 172800) {
    return "어제";
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}일 전`;
  } else {
    // YYYY-MM-DD 형식으로 표시
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(date.getDate()).padStart(2, "0")}`;
  }
}

/**
 * \( … \)  → $ … $
 * \[ … \]  → $$ … $$
 */
export function formatLatex(src: string) {
  return (
    src
      // 블록 수식 변환
      .replace(/\\\[\s*([\s\S]+?)\s*\\\]/g, (_, exp) => `$$${exp}$$`)
      // 인라인 수식 변환 - 공백과 특수문자를 더 정확하게 처리
      .replace(/\\\(\s*([\s\S]+?)\s*\\\)/g, (_, exp) => `$${exp}$`)
      // 테이블 내 수식 처리를 위한 추가 변환
      .replace(/\\\\\(/g, "\\(")
      .replace(/\\\\\)/g, "\\)")
  );
}
