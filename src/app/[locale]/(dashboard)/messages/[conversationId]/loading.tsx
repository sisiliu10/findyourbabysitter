export default function ConversationLoading() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-5 w-5 animate-pulse bg-surface-tertiary" />
        <div className="h-10 w-10 animate-pulse bg-surface-tertiary" />
        <div className="h-5 w-32 animate-pulse bg-surface-tertiary" />
      </div>
      <div className="border border-border-default bg-surface-secondary p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
              <div className={`h-12 animate-pulse bg-surface-tertiary ${i % 2 === 0 ? "w-2/3" : "w-1/2"}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
