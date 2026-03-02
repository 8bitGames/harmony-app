import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오늘의 운세",
  description: "띠별 오늘의 운세를 확인하세요. 종합운, 건강운, 금전운을 매일 제공합니다.",
  openGraph: {
    title: "오늘의 운세 | 하모니",
    description: "띠별 오늘의 운세를 확인하세요",
  },
};

export default function FortuneLayout({ children }: { children: React.ReactNode }) {
  return children;
}
