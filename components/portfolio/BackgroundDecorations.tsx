"use client";

export function BackgroundDecorations() {
  return (
    <>
      {/* Global Decorative Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft Ambient Glows */}
        <div className="hidden md:block absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[100px] md:blur-[150px]" />
        <div className="hidden md:block absolute top-[30%] left-[-15%] w-[500px] h-[500px] rounded-full bg-tertiary/20 blur-[120px] md:blur-[180px]" />
        <div className="hidden md:block absolute bottom-[-10%] right-[15%] w-[800px] h-[800px] rounded-full bg-secondary/15 blur-[120px] md:blur-[200px]" />

        {/* Prominent Geometric Floating Accents */}
        {/* 1. Large Hollow Circle */}
        <div className="hidden md:block absolute top-[25%] right-[30%] w-64 h-64 border-[6px] border-primary/40 rounded-full animate-float shadow-[0_0_40px_rgba(var(--color-primary),0.2)] backdrop-blur-3xl" />

        {/* 2. Rotating Square with Glassmorphism */}
        <div className="absolute bottom-[-8%] left-[-4%] w-56 h-56 border border-on-surface/20 bg-surface/30 backdrop-blur-xl rotate-45 animate-float-reverse shadow-2xl flex items-center justify-center">
          <div className="w-24 h-24 border-[3px] border-primary/50 rotate-45" />
        </div>

        {/* 3. Bold Glowing Cross */}
        <div className="absolute top-[45%] left-[9%] flex items-center justify-center animate-spin-slow">
          <div className="hidden md:block absolute w-40 h-[4px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(var(--color-primary),0.6)] rounded-full" />
          <div className="hidden md:block absolute h-40 w-[4px] bg-gradient-to-b from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(var(--color-primary),0.6)] rounded-full" />
        </div>

        {/* 4. Prominent Dot Grid */}
        <div className="absolute bottom-[10%] right-[-2%] grid grid-cols-4 gap-6 animate-float opacity-80">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-primary/60 shadow-[0_0_15px_rgba(var(--color-primary),0.4)]" />
          ))}
        </div>

        {/* 5. Intersecting Rings */}
        <div className="absolute -top-10 -left-10 md:top-[-8%] md:left-[9%] opacity-80 animate-spin-slow">
          <svg width="250" height="250" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
            <circle cx="125" cy="125" r="80" stroke="var(--color-tertiary)" strokeWidth="3" fill="none" strokeDasharray="12 12" />
            <circle cx="125" cy="125" r="105" stroke="var(--color-primary)" strokeWidth="2" fill="none" opacity="0.5" />
          </svg>
        </div>
      </div>

      {/* Grid Pattern Overlay (Soft Line Grid) - theme-adaptive */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.35]"
        style={{
          backgroundImage: "linear-gradient(var(--color-outline) 1px, transparent 1px), linear-gradient(90deg, var(--color-outline) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
        }}
      ></div>
    </>
  );
}
