"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDots, MapPin, Users, ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";

const meetingData = {
  title: "3월 정기 산행",
  date: "2024-03-15 (토) 오전 9:00",
  location: "북한산 우이역 1번 출구",
  description: "3월 정기모임입니다. 북한산 백운대 코스로 진행합니다. 점심은 하산 후 함께 먹어요!",
  maxParticipants: 20,
  currentCount: 12,
};

const participants = [
  { id: "u1", nickname: "산사랑", status: "joined" },
  { id: "u2", nickname: "등산매니아", status: "joined" },
  { id: "u3", nickname: "건강한인생", status: "joined" },
];

export default function MeetingDetailPage() {
  const params = useParams();
  const [joined, setJoined] = useState(false);

  return (
    <div className="space-y-4 p-4">
      <Link href={`/club/${params.id}`} className="inline-flex items-center gap-1 text-base text-gray-500 hover:text-gray-700">
        <ArrowLeft size={20} />
        클럽으로 돌아가기
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{meetingData.title}</CardTitle>
            <Badge>{meetingData.currentCount}/{meetingData.maxParticipants}명</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-base text-gray-700">
              <CalendarDots size={24} className="text-orange-500" />
              {meetingData.date}
            </div>
            <div className="flex items-center gap-3 text-base text-gray-700">
              <MapPin size={24} className="text-orange-500" />
              {meetingData.location}
            </div>
            <div className="flex items-center gap-3 text-base text-gray-700">
              <Users size={24} className="text-orange-500" />
              {meetingData.currentCount}명 참여 중 (최대 {meetingData.maxParticipants}명)
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-base text-gray-700">{meetingData.description}</p>
          </div>

          {/* Map placeholder */}
          <div className="h-48 rounded-xl bg-gray-200 flex items-center justify-center">
            <span className="text-base text-gray-400">🗺️ 지도 (카카오맵 연동 예정)</span>
          </div>

          <Button
            className="w-full"
            size="lg"
            variant={joined ? "outline" : "default"}
            onClick={() => setJoined(!joined)}
            disabled={!joined && meetingData.currentCount >= meetingData.maxParticipants}
          >
            {joined ? "참여 취소" : "참여하기"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">참여자 ({participants.length}명)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {participants.map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{p.nickname[0]}</AvatarFallback>
              </Avatar>
              <span className="text-base font-medium text-gray-900">{p.nickname}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
