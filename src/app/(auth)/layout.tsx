export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-white px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-orange-500">하모니</h1>
          <p className="mt-2 text-base text-gray-500">액티브 시니어 라이프 플랫폼</p>
        </div>
        {children}
      </div>
    </div>
  );
}
