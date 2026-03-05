export default function DashboardLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-8 w-56 animate-pulse bg-surface-tertiary" />
        <div className="mt-2 h-4 w-72 animate-pulse bg-surface-tertiary" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border border-border-default bg-surface-secondary p-6">
            <div className="h-3 w-24 animate-pulse bg-surface-tertiary" />
            <div className="mt-3 h-8 w-12 animate-pulse bg-surface-tertiary" />
          </div>
        ))}
      </div>
      <div className="mt-8">
        <div className="h-5 w-40 animate-pulse bg-surface-tertiary" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-border-default bg-surface-secondary p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-32 animate-pulse bg-surface-tertiary" />
                  <div className="h-3 w-48 animate-pulse bg-surface-tertiary" />
                </div>
                <div className="h-6 w-16 animate-pulse bg-surface-tertiary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
