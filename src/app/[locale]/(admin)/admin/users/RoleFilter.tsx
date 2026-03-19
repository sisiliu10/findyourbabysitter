"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const options = [
  { label: "All", value: "" },
  { label: "Parents", value: "PARENT" },
  { label: "Babysitters", value: "BABYSITTER" },
];

export function RoleFilter({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("role", value);
    } else {
      params.delete("role");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setFilter(opt.value)}
          className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
            current === opt.value
              ? "bg-text-primary text-surface-secondary border-text-primary"
              : "bg-surface-secondary text-text-secondary border-border-default hover:border-text-secondary"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
