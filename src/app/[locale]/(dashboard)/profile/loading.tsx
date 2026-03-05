export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 w-40 animate-pulse bg-surface-tertiary" />
        <div className="h-10 w-28 animate-pulse bg-surface-tertiary" />
      </div>
      <div className="border border-border-default bg-surface-secondary p-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 animate-pulse bg-surface-tertiary" />
          <div className="space-y-2">
            <div className="h-6 w-40 animate-pulse bg-surface-tertiary" />
            <div className="h-4 w-48 animate-pulse bg-surface-tertiary" />
            <div className="h-5 w-20 animate-pulse bg-surface-tertiary" />
          </div>
        </div>
      </div>
      <div className="mt-6 border border-border-default bg-surface-secondary p-6">
        <div className="h-4 w-24 animate-pulse bg-surface-tertiary" />
        <div className="mt-3 space-y-2">
          <div className="h-4 w-full animate-pulse bg-surface-tertiary" />
          <div className="h-4 w-3/4 animate-pulse bg-surface-tertiary" />
        </div>
      </div>
    </div>
  );
}
