"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, UsersThree, MapPin, ChatsCircle, UserCircle, Info } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "홈", icon: House },
  { href: "/club", label: "클럽", icon: UsersThree },
  { href: "/map", label: "지도", icon: MapPin },
  { href: "/info", label: "정보", icon: Info },
  { href: "/chat", label: "채팅", icon: ChatsCircle },
  { href: "/mypage", label: "마이", icon: UserCircle },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white safe-area-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-sm transition-colors",
                isActive ? "text-orange-500" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon size={24} weight={isActive ? "fill" : "regular"} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
