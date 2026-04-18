"use client";

import Link from "next/link";

interface PortfolioFooterProps {
  profile: {
    name?: string | null;
    social_links?: Array<{
      id: string | number;
      name: string;
      link: string;
    }>;
  } | null;
}

export function PortfolioFooter({ profile }: PortfolioFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-low w-full py-8 px-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline-variant/15 relative overflow-hidden">
      {/* Footer dot grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, var(--color-outline) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Gradient top bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="font-label text-xs uppercase tracking-widest text-outline relative z-10">
        © {currentYear} {profile?.name || "Portfolio"}. All rights reserved.
      </div>

      <div className="flex flex-wrap gap-6 md:gap-8 justify-center relative z-10">
        {profile?.social_links?.map((social) => (
          <a
            key={social.id}
            className="font-label text-xs uppercase tracking-widest text-outline hover:text-on-surface transition-all"
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {social.name}
          </a>
        ))}
        <Link
          href="/login"
          className="font-label text-xs uppercase tracking-widest text-outline hover:text-on-surface transition-all flex items-center gap-1.5 opacity-40 hover:opacity-100"
        >
          Admin
        </Link>
      </div>
    </footer>
  );
}
