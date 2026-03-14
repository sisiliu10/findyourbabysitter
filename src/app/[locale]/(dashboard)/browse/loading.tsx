export default function BrowseLoading() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-8 w-40 animate-pulse bg-surface-tertiary" />
          <div className="mt-2 h-4 w-56 animate-pulse bg-surface-tertiary" />
        </div>
        <div className="h-8 w-32 animate-pulse bg-surface-tertiary" />
      </div>
      <div className="mb-4 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-20 animate-pulse bg-surface-tertiary" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border border-border-default bg-surface-secondary">
            <div className="aspect-square animate-pulse bg-surface-tertiary" />
            <div className="p-3 space-y-2">
              <div className="h-4 w-3/4 animate-pulse bg-surface-tertiary" />
              <div className="h-3 w-1/2 animate-pulse bg-surface-tertiary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
