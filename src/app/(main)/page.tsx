import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, UsersThree, Fire } from "@phosphor-icons/react/dist/ssr";

const fortunePreview = {
  zodiac: "용띠",
  summary: "오늘은 새로운 인연을 만나기 좋은 날입니다",
  luck: "★★★★☆",
};

const recommendedClubs = [
  { id: "1", name: "서울 등산 모임", category: "등산", members: 45, coverEmoji: "⛰️" },
  { id: "2", name: "골프 친구들", category: "골프", members: 32, coverEmoji: "⛳" },
  { id: "3", name: "독서 클럽", category: "독서", members: 28, coverEmoji: "📚" },
];

const popularPosts = [
  { id: "1", title: "봄 등산 코스 추천합니다", author: "산사랑", likes: 24, comments: 8 },
  { id: "2", title: "퇴직 후 재테크 팁 공유", author: "현명한투자", likes: 18, comments: 12 },
  { id: "3", title: "제주도 3박4일 여행 후기", author: "여행가", likes: 31, comments: 15 },
];

export default function HomePage() {
  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold text-gray-900">안녕하세요! 👋</h1>
        <p className="mt-1 text-base text-gray-500">오늘도 즐거운 하루 보내세요</p>
      </div>

      {/* Fortune Preview */}
      <Card className="bg-gradient-to-r from-purple-50 to-orange-50">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
              🐉
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-gray-900">{fortunePreview.zodiac} 오늘의 운세</span>
                <Star size={18} weight="fill" className="text-yellow-400" />
              </div>
              <p className="mt-1 text-base text-gray-600">{fortunePreview.summary}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Clubs */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <UsersThree size={24} className="text-orange-500" />
            추천 클럽
          </h2>
          <Link href="/club" className="text-base text-orange-500 font-medium">
            전체보기
          </Link>
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {recommendedClubs.map((club) => (
            <Link key={club.id} href={`/club/${club.id}`} className="min-w-[160px]">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">{club.coverEmoji}</div>
                  <h3 className="text-base font-semibold text-gray-900 truncate">{club.name}</h3>
                  <Badge variant="secondary" className="mt-2">{club.category}</Badge>
                  <p className="mt-2 text-sm text-gray-400">멤버 {club.members}명</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Posts */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Fire size={24} className="text-red-500" />
          인기 게시글
        </h2>
        <div className="mt-3 space-y-3">
          {popularPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <h3 className="text-base font-semibold text-gray-900">{post.title}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-400">{post.author}</span>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
