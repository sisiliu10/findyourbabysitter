import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { ToggleUserButton } from "./ToggleUserButton";

const roleVariants: Record<string, BadgeVariant> = {
  PARENT: "info",
  BABYSITTER: "success",
  ADMIN: "warning",
};

export default async function AdminUsersPage() {
  await requireRole(["ADMIN"]);

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isDisabled: true,
      onboarded: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-text-primary">Users</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Manage all platform users ({users.length} total).
        </p>
      </div>

      <div className="overflow-hidden border border-border-default bg-surface-secondary">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default bg-surface-tertiary">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Name
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Email
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Role
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Joined
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-surface-tertiary"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-text-primary">
                      {user.firstName} {user.lastName}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-text-secondary">{user.email}</td>
                  <td className="px-5 py-4">
                    <Badge variant={roleVariants[user.role] || "neutral"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    {user.isDisabled ? (
                      <Badge variant="danger">Disabled</Badge>
                    ) : (
                      <Badge variant="success">Active</Badge>
                    )}
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
                    <span>{formatDate(user.createdAt)}</span>
                    <span className="ml-1.5 text-text-tertiary text-xs">
                      {new Date(user.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {user.role !== "ADMIN" && (
                      <ToggleUserButton
                        userId={user.id}
                        isDisabled={user.isDisabled}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
