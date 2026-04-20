"use client";

import { User, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";

interface ProfilePreviewCardProps {
  name: string;
  email: string;
  avatar: File | string | null;
}

export function ProfilePreviewCard({ name, email, avatar }: ProfilePreviewCardProps) {
  return (
    <Card className="shadow-sm h-[max-content]">
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <div className="relative group w-28 h-28 rounded-full overflow-hidden border-4 border-surface shadow-lg bg-surface-container-high flex items-center justify-center">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-dim opacity-20 transition duration-1000"></div>
          {avatar ? (
            <Image
              src={typeof avatar === "string" ? avatar : URL.createObjectURL(avatar)}
              alt="Profile Preview"
              fill
              sizes="112px"
              priority
              className="w-full h-full object-cover relative z-10"
            />
          ) : (
            <User className="w-10 h-10 text-gray-400 relative z-10" />
          )}
        </div>

        <div className="space-y-1 w-full px-2">
          <h2 className="text-lg font-bold text-on-surface truncate">{name || "Admin User"}</h2>
          <p className="text-sm text-on-surface/60 truncate">{email}</p>
        </div>

        <div className="w-full pt-4 mt-2 border-t border-outline/10">
          <span className="inline-flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider text-on-tertiary-container bg-tertiary-container px-3 py-1.5 rounded-full font-bold w-max mx-auto">
            <ShieldCheck className="w-3.5 h-3.5" /> Admin Account
          </span>
        </div>
      </div>
    </Card>
  );
}
