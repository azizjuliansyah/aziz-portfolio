"use client";

import { useState } from "react";

interface HeroSectionProps {
  profile: {
    name: string;
    title: string;
    avatar?: string | null;
  };
}

export function HeroSection({ profile }: HeroSectionProps) {
  const [avatarHovered, setAvatarHovered] = useState(false);

  return (
    <header className="relative min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20 pt-24 overflow-hidden" id="home">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container-low -z-10 transition-all"></div>
      
      <div className="w-full max-w-7xl my-10 mx-auto grid md:grid-cols-12 items-center">
        <div className="md:col-span-7 mb-4 z-10">
          <p className="font-label uppercase tracking-widest text-primary font-bold mb-4 opacity-80 animate-in fade-in slide-in-from-left-4 duration-700">
            Architecture of Code
          </p>
          <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tighter text-on-surface leading-[0.9] mb-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            {profile.name.split(' ')[0]}<br />
            <span className="text-outline">{profile.name.split(' ').slice(1).join(' ')}</span>
          </h1>
          <h2 className="font-body italic text-2xl md:text-4xl text-on-surface-variant max-w-xl animate-in fade-in slide-in-from-left-12 duration-1000 delay-200">
            {profile.title}
          </h2>
        </div>
        <div
          className="md:col-span-5 relative animate-in fade-in zoom-in duration-1000"
          onMouseEnter={() => setAvatarHovered(true)}
          onMouseLeave={() => setAvatarHovered(false)}
        >
          {/* Card Stack Container */}
          <div className="relative aspect-[4/5] w-full">
            {/* Back Card 2 - Tertiary tint, farthest */}
            <div
              style={{
                transitionProperty: 'transform, box-shadow',
                transitionDuration: '900ms',
                transitionDelay: avatarHovered ? '60ms' : '0ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                transform: avatarHovered
                  ? 'rotate(14deg) translateX(52px) translateY(20px)'
                  : 'rotate(6deg) translateX(24px) translateY(12px)',
                boxShadow: avatarHovered
                  ? '8px 20px 60px rgba(0,0,0,0.14)'
                  : '4px 8px 30px rgba(0,0,0,0.08)',
              }}
              className="absolute inset-0 rounded-2xl bg-tertiary/20 border border-tertiary/30"
            />
            {/* Back Card 1 - Primary tint, middle */}
            <div
              style={{
                transitionProperty: 'transform, box-shadow',
                transitionDuration: '700ms',
                transitionDelay: avatarHovered ? '30ms' : '0ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                transform: avatarHovered
                  ? 'rotate(7deg) translateX(26px) translateY(12px)'
                  : 'rotate(3deg) translateX(12px) translateY(6px)',
                boxShadow: avatarHovered
                  ? '6px 14px 40px rgba(18,74,240,0.14)'
                  : '4px 8px 24px rgba(0,0,0,0.06)',
              }}
              className="absolute inset-0 rounded-2xl bg-primary/10 border border-primary/20"
            />
            {/* Main Photo Card - front */}
            <div
              style={{
                transitionProperty: 'transform, box-shadow',
                transitionDuration: '600ms',
                transitionDelay: '0ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                transform: avatarHovered
                  ? 'rotate(-1.5deg) translateY(-12px)'
                  : 'rotate(0deg) translateY(0px)',
                boxShadow: avatarHovered
                  ? '0 40px 90px rgba(18,74,240,0.22), 0 10px 30px rgba(0,0,0,0.13)'
                  : '0 20px 60px rgba(18,74,240,0.12), 0 4px 16px rgba(0,0,0,0.08)',
              }}
              className="absolute inset-0 rounded-2xl overflow-hidden bg-surface-container"
            >
              {profile.avatar ? (
                <img
                  alt={profile.name}
                  style={{
                    transitionProperty: 'transform, filter',
                    transitionDuration: '800ms',
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: avatarHovered ? 'scale(1.05)' : 'scale(1)',
                    filter: avatarHovered ? 'grayscale(0%)' : 'grayscale(100%)',
                  }}
                  className="w-full h-full object-cover"
                  src={profile.avatar}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                  <span className="text-8xl text-outline opacity-20 font-headline">{profile.name.charAt(0)}</span>
                </div>
              )}
              {/* Subtle inner vignette on hover */}
              <div
                style={{
                  transitionProperty: 'opacity',
                  transitionDuration: '800ms',
                  transitionTimingFunction: 'ease-out',
                  opacity: avatarHovered ? 1 : 0,
                }}
                className="absolute inset-0 bg-gradient-to-t from-surface/30 via-transparent to-transparent pointer-events-none"
              />
            </div>
          </div>
          {/* Extended Hero Decor */}
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/30 rounded-full blur-[60px] md:blur-[80px] -z-10 animate-pulse"></div>
          <div className="absolute top-10 -right-10 w-48 h-48 bg-secondary/30 rounded-full blur-[70px] md:blur-[90px] -z-10"></div>
        </div>
      </div>
    </header>
  );
}
