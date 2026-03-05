export default function MessagesLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse bg-surface-tertiary" />
        <div className="mt-2 h-4 w-64 animate-pulse bg-surface-tertiary" />
      </div>
      <div className="divide-y divide-border-default border border-border-default bg-surface-secondary">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className="h-12 w-12 animate-pulse bg-surface-tertiary" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 animate-pulse bg-surface-tertiary" />
              <div className="h-3 w-48 animate-pulse bg-surface-tertiary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
