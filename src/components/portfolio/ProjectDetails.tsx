"use client";

interface ProjectDetailsProps {
  project: {
    title: string;
    overview: string;
    narrative?: string;
    core_engine?: string;
    development_stack?: string;
    database_stack?: string;
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
            {project.overview}
          </p>
          {project.narrative && (
            <p className="whitespace-pre-wrap font-light opacity-90">
              {project.narrative}
            </p>
          )}
        </div>
      </div>
      <aside className="md:col-span-5 bg-surface-container p-8 md:p-12 rounded-lg border border-outline-variant/10 shadow-sm">
        <h3 className="font-headline text-lg font-bold mb-8 uppercase tracking-widest">Technical Stack</h3>
        <div className="grid grid-cols-1 gap-y-8">
          {project.core_engine && (
            <div>
              <span className="font-label text-[10px] uppercase tracking-widest text-outline block mb-2">Core Engine</span>
              <p className="font-label font-bold text-on-surface">{project.core_engine}</p>
            </div>
          )}
          {project.development_stack && (
            <div>
              <span className="font-label text-[10px] uppercase tracking-widest text-outline block mb-2">Development</span>
              <p className="font-label font-bold text-on-surface">{project.development_stack}</p>
            </div>
          )}
          {project.database_stack && (
            <div>
              <span className="font-label text-[10px] uppercase tracking-widest text-outline block mb-2">Database</span>
              <p className="font-label font-bold text-on-surface">{project.database_stack}</p>
            </div>
          )}
        </div>
      </aside>
    </section>
  );
}
