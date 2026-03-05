"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useMessages } from "@/hooks/useMessages";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getInitials, cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";

export default function MessageThreadPage() {
  const t = useTranslations("messageThread");
  const locale = useLocale();
  const params = useParams();
  const conversationId = params.conversationId as string;
  const { messages, isLoading, sendMessage } = useMessages(conversationId);
  const { user, loading: userLoading } = useCurrentUser();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [otherPerson, setOtherPerson] = useState<{
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null>(null);
  const [conversationType, setConversationType] = useState<"booking" | "match" | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch conversation details to get other person's name and type
  useEffect(() => {
    fetch(`/api/messages/${conversationId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data?.conversationType) {
          setConversationType(json.data.conversationType);
        }
        const msgs = json.data?.messages || json;
        if (Array.isArray(msgs) && msgs.length > 0 && user) {
          const otherMsg = msgs.find(
            (m: { senderId: string }) => m.senderId !== user.id
          );
          if (otherMsg?.sender) {
            setOtherPerson(otherMsg.sender);
          }
        }
      })
      .catch(() => {});
  }, [conversationId, user, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    const content = input.trim();
    setInput("");

    try {
      await sendMessage(content);
    } catch {
      setInput(content); // Restore on failure
    } finally {
      setSending(false);
    }
  }

  if (isLoading || userLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" className="text-accent" />
      </div>
    );
  }

  if (!user) return null;

  const otherName = otherPerson
    ? `${otherPerson.firstName} ${otherPerson.lastName}`
    : t("conversation");

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border-default bg-surface-secondary px-4 py-3">
        <Link
          href="/messages"
          className="p-1.5 text-text-tertiary transition hover:bg-surface-tertiary hover:text-text-secondary sm:hidden"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </Link>
        {otherPerson && (
          <>
            {otherPerson.avatarUrl ? (
              <img
                src={otherPerson.avatarUrl}
                alt={otherName}
                className="h-9 w-9 object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center bg-accent-muted text-xs font-semibold text-accent">
                {getInitials(otherPerson.firstName, otherPerson.lastName)}
              </div>
            )}
          </>
        )}
        <div>
          <p className="text-sm font-semibold text-text-primary">{otherName}</p>
          {conversationType === "booking" && (
            <Link
              href={`/bookings/${conversationId}`}
              className="text-xs text-text-tertiary hover:text-accent"
            >
              {t("viewBooking")}
            </Link>
          )}
          {conversationType === "match" && (
            <p className="text-xs text-text-tertiary">{t("matchConversation")}</p>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto bg-surface-primary px-4 py-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-text-tertiary">
              {t("noMessages")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => {
              const isMe = message.senderId === user.id;
              const senderInitials = getInitials(
                message.sender.firstName,
                message.sender.lastName
              );

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2",
                    isMe ? "justify-end" : "justify-start"
                  )}
                >
                  {!isMe && (
                    <>
                      {message.sender.avatarUrl ? (
                        <img
                          src={message.sender.avatarUrl}
                          alt={`${message.sender.firstName}`}
                          className="mt-1 h-7 w-7 shrink-0 object-cover"
                        />
                      ) : (
                        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center bg-surface-tertiary text-[10px] font-semibold text-text-secondary">
                          {senderInitials}
                        </div>
                      )}
                    </>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] px-4 py-2.5",
                      isMe
                        ? "bg-text-primary text-surface-primary"
                        : "bg-surface-tertiary text-text-primary"
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-[10px]",
                        isMe ? "text-surface-primary/50" : "text-text-tertiary"
                      )}
                    >
                      {new Date(message.createdAt).toLocaleTimeString(locale === "de" ? "de-DE" : "en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-3 border-t border-border-default bg-surface-secondary px-4 py-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("typeMessage")}
          className="flex-1 border border-border-default bg-transparent px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-text-primary focus:outline-none"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="flex h-10 w-10 items-center justify-center bg-text-primary text-surface-primary transition hover:bg-accent disabled:opacity-50"
        >
          {sending ? (
            <Spinner size="sm" />
          ) : (
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
