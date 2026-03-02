"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChatsCircle } from "@phosphor-icons/react";

const chatRooms = [
  { id: "1", name: "서울 등산 모임", type: "club" as const, lastMessage: "내일 몇 시에 모이나요?", time: "오후 3:24", unread: 5 },
  { id: "2", name: "골프 친구들", type: "club" as const, lastMessage: "다음 주 라운딩 확정!", time: "오전 11:02", unread: 0 },
  { id: "3", name: "산사랑", type: "private" as const, lastMessage: "등산화 정보 감사합니다", time: "어제", unread: 1 },
];

export default function ChatListPage() {
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-gray-900">채팅</h1>

      {chatRooms.length === 0 ? (
        <div className="py-16 text-center">
          <ChatsCircle size={64} className="mx-auto text-gray-300" />
          <p className="mt-4 text-base text-gray-400">아직 채팅방이 없어요</p>
        </div>
      ) : (
        <div className="space-y-2">
          {chatRooms.map((room) => (
            <Card key={room.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-3 p-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="text-lg">{room.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900 truncate">{room.name}</h3>
                    {room.type === "club" && <Badge variant="secondary" className="text-xs">클럽</Badge>}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{room.lastMessage}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-400">{room.time}</span>
                  {room.unread > 0 && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                      {room.unread}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
