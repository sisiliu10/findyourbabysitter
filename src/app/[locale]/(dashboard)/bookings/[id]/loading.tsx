export default function BookingDetailLoading() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 h-5 w-24 animate-pulse bg-surface-tertiary" />
      <div className="border border-border-default bg-surface-secondary p-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 animate-pulse bg-surface-tertiary" />
          <div className="space-y-2">
            <div className="h-5 w-40 animate-pulse bg-surface-tertiary" />
            <div className="h-4 w-28 animate-pulse bg-surface-tertiary" />
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 w-16 animate-pulse bg-surface-tertiary" />
              <div className="h-5 w-28 animate-pulse bg-surface-tertiary" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
