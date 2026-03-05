export default function RequestDetailLoading() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 h-5 w-24 animate-pulse bg-surface-tertiary" />
      <div className="border border-border-default bg-surface-secondary p-6">
        <div className="space-y-2">
          <div className="h-6 w-48 animate-pulse bg-surface-tertiary" />
          <div className="h-4 w-32 animate-pulse bg-surface-tertiary" />
        </div>
        <div className="mt-6 space-y-4">
          <div className="h-4 w-full animate-pulse bg-surface-tertiary" />
          <div className="h-4 w-3/4 animate-pulse bg-surface-tertiary" />
        </div>
      </div>
    </div>
  );
}
