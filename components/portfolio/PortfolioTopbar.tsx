"use client";

import Link from "next/link";

interface PortfolioTopbarProps {
  profile: {
    email?: string | null;
    name?: string | null;
  } | null;
  activeSection?: string;
}

export function PortfolioTopbar({ profile, activeSection = "home" }: PortfolioTopbarProps) {
  const navLinks = [
    { href: "#home", label: "Home", section: "home" },
    { href: "#bio", label: "Bio", section: "bio" },
    { href: "#experience", label: "Experience", section: "experience" },
    { href: "#skills", label: "Skills", section: "skills" },
    { href: "#certificates", label: "Certificates", section: "certificates" },
    { href: "#projects", label: "Projects", section: "projects" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const elementId = href.replace('#', '');
    const element = document.getElementById(elementId);
    if (element) {
      const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl rounded-2xl bg-surface/80 backdrop-blur-xl shadow-xl z-50 flex justify-between items-center px-8 py-4 border border-outline-variant/10">
      <Link href="/" className="text-2xl font-bold text-on-surface italic font-headline tracking-tighter hover:text-primary transition-colors duration-300">
        {profile?.name}
      </Link>
      <div className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <a
            key={link.section}
            className={`font-label text-sm transition-colors duration-300 cursor-pointer ${
              activeSection === link.section
                ? "text-primary font-bold underline decoration-2 underline-offset-8"
                : "text-on-surface/70 font-medium hover:text-primary"
            }`}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
          >
            {link.label}
          </a>
        ))}
      </div>
      {/* <a
        href={profile?.email ? `mailto:${profile.email}` : "#"}
        className="bg-primary hover:bg-primary-dim text-on-primary px-5 py-2.5 rounded-xl font-label text-sm font-bold transition-all active:scale-95 shadow-lg shadow-primary/20"
      >
        Get in Touch
      </a> */}
    </nav>
  );
}
