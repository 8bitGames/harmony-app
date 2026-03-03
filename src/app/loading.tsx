export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-3 border-orange-500 border-t-transparent" />
        <p className="mt-4 text-sm text-gray-500">로딩 중...</p>
      </div>
    </div>
  );
}
