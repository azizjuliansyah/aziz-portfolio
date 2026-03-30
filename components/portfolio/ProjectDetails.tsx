"use client";

interface ProjectDetailsProps {
  project: {
    title: string;
    description: string;
  };
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-32 items-start relative">
      {/* Simple geometric accent */}
      <div className="absolute -right-20 -bottom-20 opacity-[0.04] pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="200,20 360,110 360,270 200,360 40,270 40,110" stroke="var(--color-tertiary)" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="md:col-span-7 pr-0 lg:pr-12">
        <h2 className="font-headline text-2xl font-bold mb-8 uppercase tracking-widest text-on-surface-variant/50">
          The Narrative
        </h2>
        <div className="font-body text-lg md:text-xl text-on-surface leading-relaxed space-y-6">
          <p className="whitespace-pre-wrap">
            {project.description}
          </p>
          <p>
            In the digital landscape of 2024, scalability is no longer a luxury—it's a survival requirement.
            The {project.title} project began as a challenge to rethink how distributed systems handle state
            across disparate geographic zones without compromising the developer experience.
          </p>
        </div>
      </div>
      <aside className="md:col-span-5 bg-surface-container p-8 md:p-12 rounded-lg">
        <h3 className="font-headline text-lg font-bold mb-8 uppercase tracking-widest">Technical Stack</h3>
        <div className="grid grid-cols-2 gap-y-8 gap-x-4">
          <div>
            <span className="font-label text-[10px] uppercase tracking-widest text-outline block mb-2">Core Engine</span>
            <p className="font-label font-bold text-on-surface">React / TypeScript</p>
          </div>
          <div>
            <span className="font-label text-[10px] uppercase tracking-widest text-outline block mb-2">Development</span>
            <p className="font-label font-bold text-on-surface">Next.js / Tailwind CSS</p>
          </div>
          <div>
            <span className="font-label text-[10px] uppercase tracking-widest text-outline block mb-2">Supabase</span>
            <p className="font-label font-bold text-on-surface">PostgreSQL / Auth / Storage</p>
          </div>
        </div>
        <div className="mt-12 pt-12 border-t border-outline-variant/15">
          <h4 className="font-label text-[10px] uppercase tracking-widest text-outline mb-4">Key Metrics</h4>
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <span className="font-body italic text-on-surface-variant">Performance</span>
              <span className="font-headline font-bold text-primary text-xl">Lighthouse 100</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="font-body italic text-on-surface-variant">Responsive</span>
              <span className="font-headline font-bold text-primary text-xl">Universal</span>
            </li>
          </ul>
        </div>
      </aside>
    </section>
  );
}
