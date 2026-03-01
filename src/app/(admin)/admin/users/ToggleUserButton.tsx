"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleUserDisabled } from "@/actions/admin.actions";
import { Button } from "@/components/ui/Button";

interface ToggleUserButtonProps {
  userId: string;
  isDisabled: boolean;
}

export function ToggleUserButton({ userId, isDisabled }: ToggleUserButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleToggle() {
    setLoading(true);
    setError("");

    try {
      const result = await toggleUserDisabled(userId);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Failed to update user");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        size="sm"
        variant={isDisabled ? "primary" : "danger"}
        loading={loading}
        onClick={handleToggle}
      >
        {isDisabled ? "Enable" : "Disable"}
      </Button>
      {error && (
        <p className="mt-1 text-xs text-danger">{error}</p>
      )}
    </div>
  );
}
