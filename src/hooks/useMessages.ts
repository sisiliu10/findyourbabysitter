"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  sender: {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}

export function useMessages(bookingId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const lastMessageId = useRef<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const after = lastMessageId.current ? `?after=${lastMessageId.current}` : "";
      const res = await fetch(`/api/messages/${bookingId}${after}`);
      if (!res.ok) return;
      const json = await res.json();
      const data: Message[] = json.data?.messages ?? [];

      if (data.length > 0) {
        lastMessageId.current = data[data.length - 1].id;
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMessages = data.filter((m) => !existingIds.has(m.id));
          return [...prev, ...newMessages];
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const sendMessage = useCallback(
    async (content: string) => {
      const res = await fetch(`/api/messages/${bookingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        await fetchMessages();
      }
    },
    [bookingId, fetchMessages]
  );

  return { messages, isLoading, sendMessage };
}
