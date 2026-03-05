export default function ProfileEditLoading() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 h-8 w-40 animate-pulse bg-surface-tertiary" />
      <div className="border border-border-default bg-surface-secondary p-6">
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 w-20 animate-pulse bg-surface-tertiary" />
              <div className="h-10 w-full animate-pulse bg-surface-tertiary" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
