import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "커뮤니티",
  description: "시니어를 위한 자유게시판. 건강, 여행, 취미, 재테크 정보를 나눠보세요.",
  openGraph: {
    title: "커뮤니티 | 하모니",
    description: "시니어를 위한 자유게시판",
  },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
