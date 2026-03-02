"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  UserCircle,
  ShieldCheck,
  Crown,
  Gear,
  SignOut,
  CaretRight,
} from "@phosphor-icons/react";

const profileData = {
  nickname: "활기찬시니어",
  region: "서울",
  bio: "등산과 독서를 좋아합니다",
  activityScore: 85,
  clubs: 3,
  posts: 12,
  meetings: 8,
};

const badges = [
  { type: "실명인증", verified: true },
  { type: "활동인증", verified: true },
  { type: "얼굴인증", verified: false },
  { type: "후기인증", verified: false },
];

const menuItems = [
  { label: "프로필 수정", icon: UserCircle },
  { label: "구독 관리", icon: Crown },
  { label: "설정", icon: Gear },
];

export default function MyPage() {
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">{profileData.nickname[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{profileData.nickname}</h2>
              <p className="text-base text-gray-500">{profileData.region} · {profileData.bio}</p>
              <div className="mt-2 flex gap-2">
                <Badge variant="success">
                  <ShieldCheck size={14} className="mr-1" /> 인증됨
                </Badge>
                <Badge variant="secondary">활동점수 {profileData.activityScore}</Badge>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 rounded-xl bg-gray-50 p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{profileData.clubs}</p>
              <p className="text-sm text-gray-500">클럽</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{profileData.posts}</p>
              <p className="text-sm text-gray-500">게시글</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{profileData.meetings}</p>
              <p className="text-sm text-gray-500">모임</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">인증 뱃지</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <Badge
              key={badge.type}
              variant={badge.verified ? "success" : "outline"}
            >
              {badge.verified ? "✓" : "○"} {badge.type}
            </Badge>
          ))}
        </CardContent>
      </Card>

      {/* Activity Tabs */}
      <Card>
        <CardContent className="p-4">
          <Tabs defaultValue="clubs">
            <TabsList>
              <TabsTrigger value="clubs">내 클럽</TabsTrigger>
              <TabsTrigger value="posts">내 게시글</TabsTrigger>
              <TabsTrigger value="meetings">참여 모임</TabsTrigger>
            </TabsList>
            <TabsContent value="clubs">
              <p className="py-6 text-center text-base text-gray-400">가입한 클럽이 여기에 표시됩니다</p>
            </TabsContent>
            <TabsContent value="posts">
              <p className="py-6 text-center text-base text-gray-400">작성한 게시글이 여기에 표시됩니다</p>
            </TabsContent>
            <TabsContent value="meetings">
              <p className="py-6 text-center text-base text-gray-400">참여한 모임이 여기에 표시됩니다</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Menu */}
      <Card>
        <CardContent className="p-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                className="flex w-full items-center gap-3 border-b border-gray-100 px-5 py-4 text-base text-gray-700 hover:bg-gray-50 last:border-0"
              >
                <Icon size={24} className="text-gray-400" />
                <span className="flex-1 text-left">{item.label}</span>
                <CaretRight size={20} className="text-gray-300" />
              </button>
            );
          })}
          <button
            type="button"
            className="flex w-full items-center gap-3 px-5 py-4 text-base text-red-500 hover:bg-red-50"
          >
            <SignOut size={24} />
            <span>로그아웃</span>
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
