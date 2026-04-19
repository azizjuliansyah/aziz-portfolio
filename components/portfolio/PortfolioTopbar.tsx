"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";

interface PortfolioTopbarProps {
  profile: {
    email?: string | null;
    name?: string | null;
  } | null;
  activeSection?: string;
}

export function PortfolioTopbar({ profile, activeSection: activeSectionProp }: PortfolioTopbarProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const detectedSection = useActiveSection(["home", "bio", "experience", "skills", "certificates", "projects"]);
  const activeSection = activeSectionProp || detectedSection;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const navLinks = [
    { href: "/#home", label: "Home", section: "home" },
    { href: "/#bio", label: "Bio", section: "bio" },
    { href: "/#experience", label: "Experience", section: "experience" },
    { href: "/#skills", label: "Skills", section: "skills" },
    { href: "/#certificates", label: "Certificates", section: "certificates" },
    { href: "/#projects", label: "Projects", section: "projects" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false); // Close menu on click

    // Smooth scroll logic for anchors on the same page
    if (isHomePage && (href.startsWith("/#") || href.startsWith("#"))) {
      const id = href.includes("#") ? href.split("#")[1] : null;
      if (id) {
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          
          const offset = 100; // Match scroll-margin-top
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });

          // Update URL hash without jumping
          window.history.pushState(null, "", href);
        }
      }
    }
  };

  // --- DRY Helpers ---
  const NavItem = ({ href, section, label, isMobile }: { href: string; section: string; label: string; isMobile?: boolean }) => {
    const isActive = activeSection === section;
    const baseClass = "font-label transition-colors duration-300 cursor-pointer";

    if (isMobile) {
      return (
        <Link
          href={href}
          scroll={false}
          onClick={(e) => handleNavClick(e, href)}
          className={`${baseClass} text-lg ${isActive ? "text-primary font-bold" : "text-on-surface/80 font-medium hover:text-primary"
            }`}
        >
          {label}
        </Link>
      );
    }

    return (
      <Link
        href={href}
        scroll={false}
        onClick={(e) => handleNavClick(e, href)}
        className={`${baseClass} text-sm ${isActive
            ? "text-primary font-bold underline decoration-2 underline-offset-8"
            : "text-on-surface/70 font-medium hover:text-primary"
          }`}
      >
        {label}
      </Link>
    );
  };

  const ContactButton = ({ className }: { className: string }) => (
    <a
      href={profile?.email ? `mailto:${profile.email}` : "#"}
      className={`bg-primary hover:bg-primary-dim text-on-primary rounded-xl font-label font-bold transition-all active:scale-95 shadow-lg shadow-primary/20 ${className}`}
    >
      Get in Touch
    </a>
  );

  return (
    <header ref={headerRef} className="fixed top-6 right-0 left-0 mx-auto w-[90%] max-w-5xl z-50">
      <nav className="relative w-full rounded-2xl bg-surface/70 backdrop-blur-lg shadow-xl flex justify-between items-center px-6 md:px-8 py-4 border border-outline-variant/10 transform-gpu">
        <Link href="/" className="text-2xl font-bold text-on-surface italic font-headline tracking-tighter hover:text-primary transition-colors duration-300">
          {profile?.name}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <NavItem key={link.section} {...link} />
          ))}
        </div>

        {/* Desktop Button */}
        <ContactButton className="hidden md:inline-block px-5 py-2.5 text-sm" />

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden p-2 text-on-surface hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-surface/70 backdrop-blur-lg shadow-xl border border-outline-variant/10 rounded-2xl p-6 flex flex-col space-y-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-200 transform-gpu">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <NavItem key={link.section} {...link} isMobile />
            ))}
          </div>
          <div className="h-px bg-outline-variant/30 w-full" />
          <ContactButton className="w-full text-center px-5 py-3 text-base" />
        </div>
      )}
    </header>
  );
}
