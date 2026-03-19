import { notFound } from "next/navigation";
import { requireOwner } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";

export default async function AdminConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  await requireOwner();

  const { conversationId } = await params;

  // Try booking first, then match
  const booking = await prisma.booking.findUnique({
    where: { id: conversationId },
    include: {
      parent: { select: { id: true, firstName: true, lastName: true, email: true } },
      sitter: { select: { id: true, firstName: true, lastName: true, email: true } },
      messages: {
        include: {
          sender: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const match = !booking
    ? await prisma.match.findUnique({
        where: { id: conversationId },
        include: {
          user1: { select: { id: true, firstName: true, lastName: true, email: true } },
          user2: { select: { id: true, firstName: true, lastName: true, email: true } },
          messages: {
            include: {
              sender: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
      })
    : null;

  if (!booking && !match) notFound();

  const participants = booking
    ? [booking.parent, booking.sitter]
    : [match!.user1, match!.user2];

  const messages = booking ? booking.messages : match!.messages;
  const convType = booking ? "Booking" : "Match";

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/messages"
          className="text-xs text-text-tertiary hover:text-text-primary"
        >
          ← Zurück zu Chatverläufen
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-text-primary">
          Chatverlauf — {convType}
        </h1>
        <div className="mt-2 flex gap-6">
          {participants.map((p) => (
            <div key={p.id}>
              <p className="text-sm font-medium text-text-primary">
                {p.firstName} {p.lastName}
              </p>
              <p className="text-xs text-text-tertiary">{p.email}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-text-tertiary py-10">Keine Nachrichten.</p>
        )}
        {messages.map((msg) => {
          const isFirst = participants[0].id === msg.senderId;
          return (
            <div
              key={msg.id}
              className={`flex ${isFirst ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-lg rounded border px-4 py-3 ${
                  isFirst
                    ? "border-border-default bg-surface-secondary"
                    : "border-accent/20 bg-accent-muted"
                }`}
              >
                <p className="mb-1 text-xs font-medium text-text-secondary">
                  {msg.sender.firstName} {msg.sender.lastName}
                </p>
                <p className="whitespace-pre-wrap text-sm text-text-primary">
                  {msg.content}
                </p>
                <p className="mt-1 text-right text-xs text-text-tertiary">
                  {new Date(msg.createdAt).toLocaleString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
