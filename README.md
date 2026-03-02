# 🍀 하모니 (Harmony)

> 취미·정보 기반 액티브 시니어 라이프 플랫폼

## 기술 스택

- **Next.js 16** / React 19 / TypeScript
- **Tailwind v4** + Radix UI + Phosphor Icons + Framer Motion
- **Supabase** (PostgreSQL) + Drizzle ORM
- **Firebase** Realtime DB (채팅, 추상화 레이어 적용)
- **카카오맵** API
- **토스페이먼츠** (구독 결제)
- **Gemini API** (운세/콘텐츠 자동화)
- **Biome** (lint/format)
- **Vercel** (배포)

## 시작하기

```bash
bun install
cp .env.example .env.local
# .env.local에 각 API 키 입력 후:
bun dev
```

## DB 관리

```bash
bun db:generate   # 마이그레이션 파일 생성
bun db:migrate    # 마이그레이션 실행
bun db:studio     # Drizzle Studio 열기
```

## 프로젝트 구조

```
src/
├─ app/             Next.js App Router
├─ components/      공통 컴포넌트
├─ lib/
│   ├─ supabase/    Supabase 클라이언트 (client/server)
│   ├─ firebase/    Firebase 채팅 (추상화 레이어)
│   ├─ kakao/       카카오맵 API
│   └─ toss/        토스페이먼츠
└─ db/
    └─ schema/      Drizzle ORM 스키마
```

## 개발 로드맵

- **Phase 1** (1개월): 클럽 MVP — 회원가입/클럽/게시판/정기모임/채팅
- **Phase 2** (2~3개월): 지도/1:1채팅/결제
- **Phase 3** (4개월): 운세/정보콘텐츠/SEO
- **Phase 4** (5~6개월): 추천알고리즘/안정화
