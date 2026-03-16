import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { SignupChart } from "./SignupChart";

function getWeekLabel(date: Date): string {
  // Returns "MMM DD" label for the Monday of the week containing `date`
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function AdminDashboardPage() {
  await requireRole(["ADMIN"]);

  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const [totalUsers, totalBookings, totalReviews, activeSitters, totalParents, totalRequests, recentSignups] =
    await Promise.all([
      prisma.user.count(),
      prisma.booking.count(),
      prisma.review.count(),
      prisma.babysitterProfile.count({
        where: {
          isActive: true,
          user: { isDisabled: false },
        },
      }),
      prisma.user.count({ where: { role: "PARENT" } }),
      prisma.childcareRequest.count(),
      prisma.user.findMany({
        where: {
          createdAt: { gte: ninetyDaysAgo },
          role: { in: ["PARENT", "BABYSITTER"] },
        },
        select: { createdAt: true, role: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

  const pendingBookings = await prisma.booking.count({
    where: { status: "PENDING" },
  });

  // Group signups by ISO week (last 13 weeks)
  const weekMap = new Map<string, { parents: number; sitters: number }>();
  for (let w = 12; w >= 0; w--) {
    const d = new Date();
    d.setDate(d.getDate() - w * 7);
    const label = getWeekLabel(d);
    if (!weekMap.has(label)) weekMap.set(label, { parents: 0, sitters: 0 });
  }
  for (const u of recentSignups) {
    const label = getWeekLabel(new Date(u.createdAt));
    if (weekMap.has(label)) {
      const entry = weekMap.get(label)!;
      if (u.role === "PARENT") entry.parents++;
      else entry.sitters++;
    }
  }
  const chartData = Array.from(weekMap.entries()).map(([label, counts]) => ({
    label,
    ...counts,
  }));

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      color: "text-info",
    },
    {
      label: "Active Sitters",
      value: activeSitters,
      color: "text-success",
    },
    {
      label: "Parents",
      value: totalParents,
      color: "text-accent",
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      color: "text-warning",
    },
    {
      label: "Pending Bookings",
      value: pendingBookings,
      color: "text-warning",
    },
    {
      label: "Total Reviews",
      value: totalReviews,
      color: "text-accent",
    },
    {
      label: "Total Requests",
      value: totalRequests,
      color: "text-info",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-text-primary">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Platform overview and statistics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-border-default bg-surface-secondary p-6"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
              {stat.label}
            </p>
            <p className={`mt-2 text-3xl font-medium ${stat.color}`}>
              {stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 border border-border-default bg-surface-secondary p-6">
        <h2 className="mb-1 font-serif text-lg text-text-primary">Signups over time</h2>
        <p className="mb-6 text-xs text-text-secondary">Parents vs sitters — last 13 weeks</p>
        <SignupChart data={chartData} />
      </div>
    </div>
  );
}
