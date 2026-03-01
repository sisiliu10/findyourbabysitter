import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  await requireRole(["ADMIN"]);

  const [totalUsers, totalBookings, totalReviews, activeSitters, totalParents, totalRequests] =
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
    ]);

  const pendingBookings = await prisma.booking.count({
    where: { status: "PENDING" },
  });

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
    </div>
  );
}
