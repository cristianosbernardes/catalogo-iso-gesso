export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
      <div className="h-4 w-64 bg-muted rounded mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="aspect-square w-full rounded-2xl bg-muted" />

        <div className="space-y-4">
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="h-10 w-3/4 bg-muted rounded" />
          <div className="h-4 w-28 bg-muted rounded" />
          <div className="h-px w-full bg-border my-4" />
          <div className="h-8 w-40 bg-muted rounded" />
          <div className="h-px w-full bg-border my-4" />
          <div className="flex gap-2">
            <div className="h-9 w-28 bg-muted rounded" />
            <div className="h-9 w-32 bg-muted rounded" />
            <div className="h-9 w-28 bg-muted rounded" />
          </div>
          <div className="space-y-2 pt-4">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-6 w-16 bg-muted rounded-md" />
              ))}
            </div>
          </div>
          <div className="h-12 w-full bg-muted rounded-lg mt-6" />
        </div>
      </div>

      <div className="space-y-10">
        <div className="h-px w-full bg-border" />
        <div className="space-y-3">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-5/6 bg-muted rounded" />
            <div className="h-4 w-4/6 bg-muted rounded" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-6 w-20 bg-muted rounded" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shrink-0 w-40 space-y-2">
                <div className="aspect-square w-full rounded-xl bg-muted" />
                <div className="h-3 w-20 mx-auto bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
