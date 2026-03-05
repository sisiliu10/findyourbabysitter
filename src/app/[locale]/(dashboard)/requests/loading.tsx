export default function RequestsLoading() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="h-8 w-44 animate-pulse bg-surface-tertiary" />
          <div className="mt-2 h-4 w-56 animate-pulse bg-surface-tertiary" />
        </div>
        <div className="h-10 w-32 animate-pulse bg-surface-tertiary" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border border-border-default bg-surface-secondary p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-40 animate-pulse bg-surface-tertiary" />
                <div className="h-3 w-52 animate-pulse bg-surface-tertiary" />
              </div>
              <div className="h-6 w-16 animate-pulse bg-surface-tertiary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
