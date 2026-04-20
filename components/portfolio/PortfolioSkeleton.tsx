import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Portfolio Main Page Skeleton
 * Accurately mimics the structure of the main portfolio page during loading
 */

export function PortfolioSkeleton() {
  return (
    <div className="bg-surface text-on-surface font-body relative overflow-hidden min-h-screen">
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

      {/* Hero Section Skeleton - Full Height with Card Stack Avatar */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20 pt-24">
        {/* Background gradient */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container-low -z-10"></div>

        <div className="w-full max-w-7xl my-10 mx-auto grid md:grid-cols-12 items-center">
          {/* Text Content - 7 columns */}
          <div className="md:col-span-7 mb-4 z-10">
            <Skeleton width={200} height={24} className="mb-4" />
            <Skeleton width="90%" height={80} className="mb-12" />
            <Skeleton width="70%" height={32} className="mb-4" />
          </div>

          {/* Card Stack Avatar - 5 columns */}
          <div className="md:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full">
              {/* Back Cards */}
              <div className="absolute inset-0 rounded-2xl bg-tertiary/20 border border-tertiary/30" style={{ transform: 'rotate(6deg) translateX(12px) translateY(6px)' }} />
              <div className="absolute inset-0 rounded-2xl bg-primary/10 border border-primary/20" style={{ transform: 'rotate(3deg) translateX(12px) translateY(6px)' }} />
              {/* Main Card */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden bg-surface-container" />
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section Skeleton - Dot Grid Background */}
      <section className="py-24 bg-surface-container-low relative overflow-hidden">
        {/* Top line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-outline/10 to-transparent"></div>

        {/* Dot Grid Pattern */}
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, var(--color-outline) 1.2px, transparent 1.2px)", backgroundSize: "32px 32px" }} />

        <div className="max-w-7xl mx-auto px-6 md:px-20 grid md:grid-cols-12 gap-16 relative z-10">
          {/* Left Column - Contact & Social */}
          <div className="md:col-span-4 space-y-12">
            {/* Contact Details */}
            <div className="space-y-6">
              <Skeleton width={140} height={20} className="mb-4" />
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton circle width={20} height={20} />
                  <Skeleton width={200} height={16} />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton circle width={20} height={20} />
                  <Skeleton width={150} height={16} />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton circle width={20} height={20} />
                  <Skeleton width={180} height={16} />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <Skeleton width={140} height={20} className="mb-4" />
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} circle width={48} height={48} />
                ))}
              </div>
            </div>

            {/* CV Button */}
            <Skeleton width={240} height={48} />
          </div>

          {/* Right Column - Bio Content */}
          <div className="md:col-span-8">
            <Skeleton width="100%" height={40} className="mb-8" />
            <div className="space-y-4">
              <Skeleton width="90%" height={24} />
              <Skeleton width="90%" height={24} />
              <Skeleton width="90%" height={24} />
              <Skeleton width={80} height={24} />
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline Skeleton - Diagonal Stripe Pattern */}
      <section className="py-24 bg-surface relative overflow-hidden">
        {/* Diagonal Stripe Pattern */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(-45deg, var(--color-on-surface) 0px, var(--color-on-surface) 1px, transparent 1px, transparent 20px)" }} />

        {/* Concentric Circle Rings */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 opacity-30">
          <div className="w-[700px] h-[700px] rounded-full border border-primary border-dashed opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10">
          <Skeleton width={250} height={48} className="mb-12" />

          {/* Timeline Items */}
          <div className="max-w-4xl space-y-8 border-l border-outline-variant/30 pl-8 ml-4 relative">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[41px] top-6 w-5 h-5 rounded-full bg-surface border-[4px] border-primary animate-pulse" />

                <div className="bg-surface-container-low rounded-xl p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div className="space-y-2">
                      <Skeleton width={200} height={28} />
                      <Skeleton width={180} height={20} />
                    </div>
                    <Skeleton width={160} height={32} />
                  </div>

                  {/* Responsibilities */}
                  <div className="space-y-2">
                    <Skeleton width="100%" height={20} />
                    <Skeleton width="90%" height={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Grid Skeleton - Hex Pattern */}
      <section className="py-24 bg-surface-container-low relative overflow-hidden">
        {/* Top line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-outline/10 to-transparent"></div>

        {/* Hexagon Pattern */}
        <div className="absolute -right-24 -bottom-24 opacity-[0.06]">
          <div className="w-[560px] h-[560px] border-2 border-primary rounded-xl opacity-30" />
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(var(--color-on-surface) 1px, transparent 1px), linear-gradient(90deg, var(--color-on-surface) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <Skeleton width={180} height={48} />
            <Skeleton width={150} height={20} />
          </div>

          {/* Skills - Flex Layout */}
          <div className="flex flex-wrap justify-center gap-y-16 gap-x-8 md:gap-x-12 lg:gap-x-16 pt-12">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div key={i} className="flex flex-col items-center justify-end w-[80px] md:w-[100px]">
                <div className="w-14 h-14 md:w-[72px] md:h-[72px] flex items-center justify-center bg-surface-container rounded-lg mb-4" />
                <Skeleton width={80} height={16} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Certifications Skeleton - Carousel Layout */}
      <section className="py-24 bg-surface relative overflow-hidden">
        {/* Blueprint Grid Pattern Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
          style={{ 
            backgroundImage: "linear-gradient(var(--color-on-surface) 1px, transparent 1px), linear-gradient(90deg, var(--color-on-surface) 1px, transparent 1px)", 
            backgroundSize: "40px 40px" 
          }} 
        />
        
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-outline/10 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton width={100} height={12} />
              </div>
              <Skeleton width={250} height={48} />
            </div>
            
            {/* Nav arrows skeleton */}
            <div className="flex gap-2">
              <Skeleton circle width={48} height={48} />
              <Skeleton circle width={48} height={48} />
            </div>
          </div>
          
          {/* Certificates Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline/10">
                <div className="aspect-video w-full bg-surface-container-high" />
                <div className="p-6 space-y-4">
                  <Skeleton width={100} height={20} className="rounded-full" />
                  <Skeleton width="100%" height={24} />
                  <div className="pt-4 border-t border-outline/10 flex items-center gap-2">
                    <Skeleton circle width={16} height={16} />
                    <Skeleton width={120} height={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Bento Grid Skeleton - Bento Layout */}
      <section className="py-24 bg-surface relative overflow-hidden">
        {/* Gradient Light */}
        <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-tl from-primary/5 to-transparent -z-10"></div>

        {/* Scan lines */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "repeating-linear-gradient(0deg, var(--color-on-surface) 0px, var(--color-on-surface) 1px, transparent 1px, transparent 6px)" }} />

        <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10">
          <Skeleton width={200} height={48} className="mb-16" />

          {/* Bento Grid - 4 cards (8, 4, 4, 8 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Card 1 - Large (8 cols) */}
            <div className="md:col-span-8 h-[500px] bg-surface-container-lowest rounded-lg relative overflow-hidden">
              <Skeleton width="100%" height="100%" />
            </div>

            {/* Card 2 - Medium (4 cols) */}
            <div className="md:col-span-4 h-[500px] bg-surface-container-lowest rounded-lg relative overflow-hidden">
              <Skeleton width="100%" height="100%" />
            </div>

            {/* Card 3 - Medium (4 cols) */}
            <div className="md:col-span-4 h-[500px] bg-surface-container-lowest rounded-lg relative overflow-hidden">
              <Skeleton width="100%" height="100%" />
            </div>

            {/* Card 4 - Large (8 cols) */}
            <div className="md:col-span-8 h-[500px] bg-surface-container-lowest rounded-lg relative overflow-hidden">
              <Skeleton width="100%" height="100%" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="py-6 px-8 border-t border-outline/10">
        <div className="max-w-7xl mx-auto text-center space-y-4 flex flex-col md:flex-row justify-between items-center">
          <Skeleton width={400} height={24} />
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
            <Skeleton width={50} height={14} />
            <Skeleton width={50} height={14} />
            <Skeleton width={50} height={14} />
          </div>
        </div>
      </footer>
    </div>
  );
}

