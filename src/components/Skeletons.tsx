export function StoryCardSkeleton() {
  return (
    <div className="flex gap-4 py-4 border-b border-border md:flex-col md:border-b-0">
      <div className="w-[40%] md:w-full flex-shrink-0">
        <div className="skeleton w-full h-24 md:h-44" />
      </div>
      <div className="flex flex-col justify-center flex-1 md:pt-3 gap-2">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2 mt-1" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="container py-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="skeleton w-full h-56 md:h-96 rounded-xl" />
          <div className="skeleton h-6 w-3/4 mt-4" />
          <div className="skeleton h-4 w-1/2 mt-2" />
        </div>
        <div className="hidden md:block space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="skeleton w-full h-56 md:h-96" />
      <div className="container max-w-3xl py-6 space-y-4">
        <div className="skeleton h-5 w-20" />
        <div className="skeleton h-8 w-full" />
        <div className="skeleton h-8 w-3/4" />
        <div className="skeleton h-4 w-1/2 mt-4" />
        <div className="space-y-3 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
