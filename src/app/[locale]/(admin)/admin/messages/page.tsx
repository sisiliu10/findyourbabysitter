import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";

export default async function AdminMessagesPage() {
  await requireRole(["ADMIN"]);

  // Load all matches with messages
  const [matches, bookings] = await Promise.all([
    prisma.match.findMany({
      where: { messages: { some: {} } },
      include: {
        user1: { select: { id: true, firstName: true, lastName: true, email: true } },
        user2: { select: { id: true, firstName: true, lastName: true, email: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { content: true, createdAt: true },
        },
        _count: { select: { messages: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.findMany({
      where: { messages: { some: {} } },
      include: {
        parent: { select: { id: true, firstName: true, lastName: true, email: true } },
        sitter: { select: { id: true, firstName: true, lastName: true, email: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { content: true, createdAt: true },
        },
        _count: { select: { messages: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  type ConvRow = {
    id: string;
    type: "match" | "booking";
    user1Name: string;
    user1Email: string;
    user2Name: string;
    user2Email: string;
    lastMessage: string;
    lastAt: Date;
    count: number;
  };

  const rows: ConvRow[] = [
    ...matches.map((m) => ({
      id: m.id,
      type: "match" as const,
      user1Name: `${m.user1.firstName} ${m.user1.lastName}`,
      user1Email: m.user1.email,
      user2Name: `${m.user2.firstName} ${m.user2.lastName}`,
      user2Email: m.user2.email,
      lastMessage: m.messages[0]?.content ?? "",
      lastAt: m.messages[0]?.createdAt ?? m.createdAt,
      count: m._count.messages,
    })),
    ...bookings.map((b) => ({
      id: b.id,
      type: "booking" as const,
      user1Name: `${b.parent.firstName} ${b.parent.lastName}`,
      user1Email: b.parent.email,
      user2Name: `${b.sitter.firstName} ${b.sitter.lastName}`,
      user2Email: b.sitter.email,
      lastMessage: b.messages[0]?.content ?? "",
      lastAt: b.messages[0]?.createdAt ?? b.createdAt,
      count: b._count.messages,
    })),
  ].sort((a, b) => b.lastAt.getTime() - a.lastAt.getTime());

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-text-primary">Chatverläufe</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Alle Konversationen zwischen Nutzern ({rows.length} total).
        </p>
      </div>

      <div className="overflow-hidden border border-border-default bg-surface-secondary">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default bg-surface-tertiary">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Nutzer 1
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Nutzer 2
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Typ
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Letzte Nachricht
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Nachrichten
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Datum
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-surface-tertiary">
                  <td className="px-5 py-4">
                    <p className="font-medium text-text-primary">{row.user1Name}</p>
                    <p className="text-xs text-text-tertiary">{row.user1Email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-text-primary">{row.user2Name}</p>
                    <p className="text-xs text-text-tertiary">{row.user2Email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                      row.type === "booking"
                        ? "bg-accent-muted text-accent"
                        : "bg-surface-tertiary text-text-secondary"
                    }`}>
                      {row.type === "booking" ? "Booking" : "Match"}
                    </span>
                  </td>
                  <td className="max-w-xs px-5 py-4">
                    <p className="truncate text-text-secondary">{row.lastMessage}</p>
                  </td>
                  <td className="px-5 py-4 text-center text-text-secondary">
                    {row.count}
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
                    {formatDate(row.lastAt)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/messages/${row.id}`}
                      className="text-xs font-medium text-accent hover:underline"
                    >
                      Ansehen →
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-text-tertiary">
                    Noch keine Nachrichten.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
