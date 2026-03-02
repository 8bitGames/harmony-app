"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CaretRight, Bell, Lock, Trash, Info, FileText } from "@phosphor-icons/react";

const settingsItems = [
  { label: "알림 설정", icon: Bell, href: "/mypage" },
  { label: "비밀번호 변경", icon: Lock, href: "#" },
  { label: "개인정보 처리방침", icon: FileText, href: "#" },
  { label: "이용약관", icon: Info, href: "#" },
  { label: "계정 삭제", icon: Trash, href: "#", danger: true },
];

export default function SettingsPage() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-3">
        <Link href="/mypage" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">설정</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex w-full items-center gap-3 border-b border-gray-100 px-5 py-4 text-base hover:bg-gray-50 last:border-0 ${
                  item.danger ? "text-red-500" : "text-gray-700"
                }`}
              >
                <Icon size={24} className={item.danger ? "text-red-400" : "text-gray-400"} />
                <span className="flex-1 text-left">{item.label}</span>
                <CaretRight size={20} className="text-gray-300" />
              </Link>
            );
          })}
        </CardContent>
      </Card>

      <p className="text-center text-sm text-gray-400">하모니 v1.0.0</p>
    </div>
  );
}
