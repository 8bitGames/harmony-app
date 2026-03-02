"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Step = "info" | "verify" | "complete";

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("info");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">회원가입</CardTitle>
        <div className="flex justify-center gap-2 pt-2">
          {(["info", "verify", "complete"] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`h-2 w-16 rounded-full ${
                i <= ["info", "verify", "complete"].indexOf(step)
                  ? "bg-orange-500"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {step === "info" && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setStep("verify");
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                placeholder="닉네임을 입력해주세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-email">이메일</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-password">비밀번호</Label>
              <Input
                id="reg-password"
                type="password"
                placeholder="8자 이상"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            <Button className="w-full" size="lg" type="submit">
              다음
            </Button>
          </form>
        )}

        {step === "verify" && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setStep("complete");
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="phone">휴대폰 번호</Label>
              <div className="flex gap-2">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="010-0000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCodeSent(true)}
                >
                  인증요청
                </Button>
              </div>
            </div>
            {codeSent && (
              <div className="space-y-2">
                <Label htmlFor="code">인증번호</Label>
                <Input
                  id="code"
                  placeholder="6자리 인증번호"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep("info")}>
                이전
              </Button>
              <Button className="flex-1" size="lg" type="submit" disabled={!codeSent}>
                가입하기
              </Button>
            </div>
          </form>
        )}

        {step === "complete" && (
          <div className="space-y-6 py-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <span className="text-4xl">🎉</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">가입 완료!</h3>
              <p className="mt-2 text-base text-gray-500">
                하모니에 오신 것을 환영합니다
              </p>
            </div>
            <Link href="/onboarding">
              <Button className="w-full" size="lg">
                시작하기
              </Button>
            </Link>
          </div>
        )}

        {step === "info" && (
          <div className="mt-6 text-center">
            <p className="text-base text-gray-500">
              이미 회원이신가요?{" "}
              <Link href="/login" className="font-medium text-orange-500 hover:underline">
                로그인
              </Link>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
