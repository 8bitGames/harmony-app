import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "@phosphor-icons/react/dist/ssr";

export default function MapPage() {
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-gray-900">지도</h1>

      {/* Map placeholder - 카카오맵 연동 예정 */}
      <div className="h-80 rounded-2xl bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <MapPin size={48} className="mx-auto text-gray-400" />
          <p className="mt-2 text-base text-gray-400">카카오맵 연동 예정</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900">시니어 추천 장소</h2>
      <div className="space-y-3">
        {[
          { name: "북한산 둘레길", category: "공원", desc: "초보자도 걷기 좋은 코스" },
          { name: "종로 문화센터", category: "문화", desc: "다양한 시니어 프로그램 운영" },
          { name: "양재 시민의 숲", category: "공원", desc: "산책하기 좋은 도심 속 자연" },
        ].map((place) => (
          <Card key={place.name}>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{place.name}</h3>
              <p className="text-sm text-orange-500">{place.category}</p>
              <p className="text-base text-gray-500">{place.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
