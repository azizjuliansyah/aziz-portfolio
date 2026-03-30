"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Award, Calendar } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { Certificate } from "@/types/certificate";
import { ProjectLightbox } from "./ProjectLightbox";

interface CertificatesGridProps {
  certificates: Certificate[];
}

export function CertificatesGrid({ certificates }: CertificatesGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!certificates || certificates.length === 0) return null;

  return (
    <section className="pt-24 pb-12 px-6 md:px-20 bg-surface relative overflow-hidden" id="certificates">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-outline/10 to-transparent"></div>

      <ScrollReveal variant="slideUp">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div className="space-y-2">
              <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface">
                Certifications
              </h2>
              <div className="w-20 h-1 bg-primary rounded-full"></div>
            </div>
            <p className="font-body text-sm md:text-base text-on-surface-variant max-w-sm text-left md:text-right">
              Professional credentials and validations from industry-leading organizations.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert, index) => (
                <ScrollReveal key={cert.id} variant="slideUp" delay={index * 100}>
                  <div className="group flex flex-col h-full bg-surface-container-low rounded-2xl overflow-hidden border border-outline/10 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                    <div 
                      className="relative aspect-video w-full overflow-hidden bg-surface-container-high cursor-pointer"
                      onClick={() => cert.image_url && setSelectedImage(cert.image_url as string)}
                    >
                      {cert.image_url ? (
                        <Image
                          src={cert.image_url as string}
                          alt={cert.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20">
                          <Award className="w-16 h-16" />
                        </div>
                      )}
                      
                      {/* Overlay gradient for text readability if needed */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                          title="View Credential"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                          <Award className="w-3 h-3 md:w-3.5 md:h-3.5" />
                          {cert.issuer}
                        </span>
                      </div>
                      
                      <h3 className="font-headline text-base sm:text-lg font-bold text-on-surface mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {cert.title}
                      </h3>
                      
                      <div className="mt-auto pt-3 border-t border-outline/10 space-y-1">
                        <div className="flex items-center text-xs text-on-surface-variant">
                          <Calendar className="w-4 h-4 mr-2 text-primary" />
                          <span className="font-mono">{cert.date_issued}</span>
                        </div>
                        
                        {cert.credential_id && (
                          <div className="flex items-center text-xs text-on-surface-variant/80">
                            <span className="font-semibold mr-1">Credential ID:</span>
                            <span className="font-mono break-all">{cert.credential_id}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

        </div>
      </ScrollReveal>

      <ProjectLightbox
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </section>
  );
}
