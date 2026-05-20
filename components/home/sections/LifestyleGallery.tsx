"use client";

import { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { useTranslations } from 'next-intl';

const defaultImages = [
  { url: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=800&auto=format&fit=crop", public_id: "" }, 
  { url: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop", public_id: "" }, 
  { url: "https://images.unsplash.com/photo-1558231580-c1143a502c33?q=80&w=800&auto=format&fit=crop", public_id: "" }, 
  { url: "https://images.unsplash.com/photo-1628003666016-0925c4db22f9?q=80&w=800&auto=format&fit=crop", public_id: "" }, 
  { url: "https://images.unsplash.com/photo-1506544777-64cfbea8590c?q=80&w=800&auto=format&fit=crop", public_id: "" }, 
  { url: "https://images.unsplash.com/photo-1511840742151-512b1cc1ed12?q=80&w=800&auto=format&fit=crop", public_id: "" }
];

export function LifestyleGallery({ images }: { images?: { url: string; public_id: string }[] | null }) {
  const t = useTranslations('LifestyleGallery');
  const [isHovered, setIsHovered] = useState(false);

  const activeImages = images && images.length > 0 ? images : defaultImages;
  
  // We triple the array so there's never a blank space on large screens during the loop
  const duplicatedImages = [...activeImages, ...activeImages, ...activeImages];

  return (
    <section className="py-24 lg:py-32 overflow-hidden bg-transparent relative z-10">
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333333%); }
        }
        .animate-marquee-scroll {
          animation: marquee-scroll 35s linear infinite;
        }
      `}</style>
      <div className="mb-16 text-center px-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-hp-primary">
          {t('eyebrow')}
        </p>
        <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-hp-foreground">
          {t('title')}
        </h2>
        <p className="mt-5 text-lg text-hp-muted max-w-xl mx-auto">
          {t('description')}
        </p>
      </div>

      <div className="relative w-full flex overflow-hidden -mx-4 sm:mx-0 py-8" dir="ltr">
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-[var(--hp-background)] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-[var(--hp-background)] to-transparent z-20 pointer-events-none" />

        <div
          className="flex whitespace-nowrap gap-6 px-3 animate-marquee-scroll"
          style={{ animationPlayState: isHovered ? 'paused' : 'running' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
           {duplicatedImages.map((img, idx) => (
             <div 
               key={idx} 
               className="relative w-[18rem] h-[24rem] sm:w-[22rem] sm:h-[30rem] rounded-[2.5rem] overflow-hidden shrink-0 shadow-hp-soft border border-white/60 bg-white/20 backdrop-blur-sm group"
             >
               {img.public_id ? (
                 <CldImage
                   src={img.public_id}
                   width={600}
                   height={800}
                   alt={t('riderAlt')}
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none" 
                 />
               ) : (
                 <img 
                   src={img.url} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none" 
                   alt={t('riderAlt')} 
                   loading="lazy" 
                 />
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8 pointer-events-none">
                  <p className="text-white font-semibold text-lg drop-shadow-md">@scooty_do</p>
               </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
