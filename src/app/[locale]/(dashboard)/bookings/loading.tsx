export default function BookingsLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-8 w-40 animate-pulse bg-surface-tertiary" />
        <div className="mt-2 h-4 w-56 animate-pulse bg-surface-tertiary" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-border-default border-l-4 bg-surface-secondary p-5">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 animate-pulse bg-surface-tertiary" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-36 animate-pulse bg-surface-tertiary" />
                <div className="h-3 w-48 animate-pulse bg-surface-tertiary" />
              </div>
              <div className="h-6 w-20 animate-pulse bg-surface-tertiary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
