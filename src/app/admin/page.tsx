import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = {
  totalUsers: 1234,
  newUsersToday: 15,
  totalClubs: 89,
  activeClubs: 67,
  pendingReports: 5,
  processedReports: 42,
};

const recentReports = [
  { id: "1", type: "user", reason: "부적절한 프로필 사진", status: "pending", date: "2024-03-02" },
  { id: "2", type: "post", reason: "스팸 게시글", status: "pending", date: "2024-03-02" },
  { id: "3", type: "chat", reason: "욕설/비방", status: "processed", date: "2024-03-01" },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-3xl font-bold text-orange-500">{stats.totalUsers.toLocaleString()}</p>
              <p className="mt-1 text-base text-gray-500">전체 회원</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-3xl font-bold text-green-500">+{stats.newUsersToday}</p>
              <p className="mt-1 text-base text-gray-500">오늘 가입</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-3xl font-bold text-blue-500">{stats.totalClubs}</p>
              <p className="mt-1 text-base text-gray-500">전체 클럽</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-3xl font-bold text-blue-400">{stats.activeClubs}</p>
              <p className="mt-1 text-base text-gray-500">활성 클럽</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-3xl font-bold text-red-500">{stats.pendingReports}</p>
              <p className="mt-1 text-base text-gray-500">미처리 신고</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-3xl font-bold text-gray-400">{stats.processedReports}</p>
              <p className="mt-1 text-base text-gray-500">처리 완료</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>최근 신고</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={report.status === "pending" ? "destructive" : "secondary"}>
                      {report.status === "pending" ? "미처리" : "처리됨"}
                    </Badge>
                    <Badge variant="outline">{report.type}</Badge>
                  </div>
                  <p className="mt-1 text-base text-gray-700">{report.reason}</p>
                  <p className="text-sm text-gray-400">{report.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
