"use client";

import { useTranslations } from "next-intl";
import { Modal, ModalBody } from "@/components/ui/Modal";
import { getInitials } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

interface MatchedUser {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

interface MatchModalProps {
  open: boolean;
  onClose: () => void;
  matchedUser: MatchedUser | null;
  matchId: string | null;
}

export function MatchModal({
  open,
  onClose,
  matchedUser,
  matchId,
}: MatchModalProps) {
  const t = useTranslations("search");

  if (!matchedUser || !matchId) return null;

  const initials = getInitials(matchedUser.firstName, matchedUser.lastName);

  return (
    <Modal open={open} onClose={onClose} className="max-w-sm">
      <ModalBody className="flex flex-col items-center text-center py-10 px-8">
        <div className="mb-6">
          {matchedUser.avatarUrl ? (
            <img
              src={matchedUser.avatarUrl}
              alt={`${matchedUser.firstName} ${matchedUser.lastName}`}
              className="h-24 w-24 rounded-full object-cover border-4 border-accent"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent-muted border-4 border-accent text-2xl font-semibold text-accent">
              {initials}
            </div>
          )}
        </div>

        <h2 className="font-serif text-3xl text-text-primary mb-2">
          {t("itsAMatch")}
        </h2>
        <p className="text-sm text-text-secondary mb-8">
          {t("matchDescription", { name: matchedUser.firstName })}
        </p>

        <div className="flex flex-col gap-3 w-full">
          <Link
            href={`/messages/${matchId}`}
            className="w-full bg-text-primary px-6 py-3 text-sm font-medium text-surface-primary text-center transition-colors hover:bg-accent"
            onClick={onClose}
          >
            {t("sendMessage")}
          </Link>
          <button
            onClick={onClose}
            className="w-full border border-border-default px-6 py-3 text-sm font-medium text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
          >
            {t("keepSwiping")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}
