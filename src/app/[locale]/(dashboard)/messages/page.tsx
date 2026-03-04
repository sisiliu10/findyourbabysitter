import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getInitials } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";

export default async function MessagesListPage() {
  const session = await requireAuth();
  const t = await getTranslations("messagesList");
  const locale = await getLocale();

  // Fetch all bookings where user is parent or sitter, that are not declined
  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        { parentId: session.userId },
        { sitterId: session.userId },
      ],
      status: {
        notIn: ["DECLINED"],
      },
    },
    include: {
      parent: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
      sitter: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          content: true,
          createdAt: true,
          senderId: true,
          isRead: true,
        },
      },
      request: {
        select: { title: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Count unread messages per booking
  const unreadCounts = await Promise.all(
    bookings.map((booking) =>
      prisma.message.count({
        where: {
          bookingId: booking.id,
          senderId: { not: session.userId },
          isRead: false,
        },
      })
    )
  );

  // Build conversation list
  const conversations = bookings.map((booking, index) => {
    const isParent = booking.parentId === session.userId;
    const otherPerson = isParent ? booking.sitter : booking.parent;
    const lastMessage = booking.messages[0] || null;
    const unreadCount = unreadCounts[index];

    return {
      bookingId: booking.id,
      otherPerson,
      lastMessage,
      unreadCount,
      requestTitle: booking.request?.title || "",
      status: booking.status,
    };
  });

  // Sort by last message time (most recent first), then by those without messages
  conversations.sort((a, b) => {
    if (a.lastMessage && b.lastMessage) {
      return (
        new Date(b.lastMessage.createdAt).getTime() -
        new Date(a.lastMessage.createdAt).getTime()
      );
    }
    if (a.lastMessage) return -1;
    if (b.lastMessage) return 1;
    return 0;
  });

  function formatMessageTime(date: Date | string): string {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return t("justNow");
    if (diffMins < 60) return t("minutesAgo", { count: diffMins });
    if (diffHours < 24) return t("hoursAgo", { count: diffHours });
    if (diffDays < 7) return t("daysAgo", { count: diffDays });
    return d.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", { month: "short", day: "numeric" });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-text-primary">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {t("subtitle")}
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="border border-border-default bg-surface-secondary p-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-surface-tertiary">
            <svg
              className="h-6 w-6 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
          </div>
          <p className="text-sm text-text-secondary">{t("noConversations")}</p>
          <p className="mt-1 text-sm text-text-tertiary">
            {t("noConversationsHint")}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border-default border border-border-default bg-surface-secondary">
          {conversations.map((conv) => {
            const { otherPerson } = conv;
            const initials = getInitials(
              otherPerson.firstName,
              otherPerson.lastName
            );

            return (
              <Link
                key={conv.bookingId}
                href={`/messages/${conv.bookingId}`}
                className="flex items-center gap-4 px-5 py-4 transition hover:bg-surface-tertiary"
              >
                <div className="relative">
                  {otherPerson.avatarUrl ? (
                    <img
                      src={otherPerson.avatarUrl}
                      alt={`${otherPerson.firstName} ${otherPerson.lastName}`}
                      className="h-12 w-12 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center bg-accent-muted text-sm font-semibold text-accent">
                      {initials}
                    </div>
                  )}
                  {conv.unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-accent text-[10px] font-bold text-white">
                      {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm font-medium ${
                        conv.unreadCount > 0
                          ? "text-text-primary"
                          : "text-text-secondary"
                      }`}
                    >
                      {otherPerson.firstName} {otherPerson.lastName}
                    </p>
                    {conv.lastMessage && (
                      <span className="text-xs text-text-tertiary">
                        {formatMessageTime(conv.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  {conv.requestTitle && (
                    <p className="text-xs text-text-tertiary">{conv.requestTitle}</p>
                  )}
                  {conv.lastMessage ? (
                    <p
                      className={`mt-0.5 truncate text-sm ${
                        conv.unreadCount > 0
                          ? "font-medium text-text-primary"
                          : "text-text-secondary"
                      }`}
                    >
                      {conv.lastMessage.senderId === session.userId
                        ? t("you")
                        : ""}
                      {conv.lastMessage.content}
                    </p>
                  ) : (
                    <p className="mt-0.5 text-sm italic text-text-tertiary">
                      {t("noMessages")}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
