import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Project Detail Page Skeleton
 * Mimics the structure of the project detail page during loading
 */

export function ProjectDetailSkeleton() {
  return (
    <div className="bg-surface text-on-surface font-body relative overflow-x-hidden min-h-screen">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(var(--color-on-surface) 1px, transparent 1px), linear-gradient(90deg, var(--color-on-surface) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      ></div>

      {/* Topbar Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Skeleton width={120} height={32} />
          <div className="flex items-center gap-4">
            <Skeleton circle width={40} height={40} />
            <Skeleton width={150} height={40} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-24 pb-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        {/* Project Hero Skeleton */}
        <section className="mb-12">
          <Skeleton width={300} height={40} className="mb-4" />
          <Skeleton width={500} height={24} className="mb-6" />
          <div className="flex gap-3">
            <Skeleton width={100} height={32} />
            <Skeleton width={100} height={32} />
          </div>
        </section>

        {/* Featured Image Skeleton */}
        <section className="mb-12">
          <div className="relative aspect-video w-full bg-surface-container rounded-2xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <Skeleton circle width={64} height={64} />
                <Skeleton width={200} height={24} />
              </div>
            </div>
          </div>
        </section>

        {/* Project Details Skeleton */}
        <section className="mb-12">
          <Skeleton width={200} height={28} className="mb-6" />
          <div className="space-y-4">
            <Skeleton width="100%" height={20} />
            <Skeleton width="100%" height={20} />
            <Skeleton width="100%" height={20} />
            <Skeleton width="80%" height={20} />
          </div>
        </section>

        {/* Project Gallery Skeleton */}
        <section className="mb-12">
          <Skeleton width={200} height={28} className="mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square bg-surface-container rounded-xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <Skeleton circle width={48} height={48} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Skeleton */}
        <section className="mb-12">
          <Skeleton width={200} height={28} className="mb-6" />
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} width={100} height={36} />
            ))}
          </div>
        </section>

        {/* CTA Section Skeleton */}
        <section className="mb-12">
          <div className="p-8 bg-surface-container rounded-2xl text-center">
            <Skeleton width={300} height={24} className="mx-auto mb-4" />
            <Skeleton width={400} height={20} className="mx-auto mb-6" />
            <Skeleton width={150} height={40} className="mx-auto" />
          </div>
        </section>
      </main>

      {/* Footer Skeleton */}
      <footer className="py-12 px-6 md:px-12 border-t border-outline/10">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <Skeleton width={200} height={20} />
          <Skeleton width={300} height={16} />
        </div>
      </footer>
    </div>
  );
}
