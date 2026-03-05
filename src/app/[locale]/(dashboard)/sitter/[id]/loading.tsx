export default function SitterProfileLoading() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 h-5 w-24 animate-pulse bg-surface-tertiary" />
      <div className="border border-border-default bg-surface-secondary p-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 animate-pulse bg-surface-tertiary" />
          <div className="space-y-2">
            <div className="h-6 w-40 animate-pulse bg-surface-tertiary" />
            <div className="h-4 w-24 animate-pulse bg-surface-tertiary" />
            <div className="h-4 w-32 animate-pulse bg-surface-tertiary" />
          </div>
        </div>
      </div>
      <div className="mt-6 border border-border-default bg-surface-secondary p-6">
        <div className="h-4 w-16 animate-pulse bg-surface-tertiary" />
        <div className="mt-3 space-y-2">
          <div className="h-4 w-full animate-pulse bg-surface-tertiary" />
          <div className="h-4 w-3/4 animate-pulse bg-surface-tertiary" />
        </div>
      </div>
    </div>
  );
}
