"use client";

import { useState } from 'react';
import { m } from 'framer-motion';
import type { FeatureSectionContent } from '@/types/homepage';
import { getIcon } from '@/lib/icon-map';
import { HpContainer } from '@/components/home/ui/Container';
import { CldImage } from 'next-cloudinary';

interface FeaturesSectionProps {
  content: FeatureSectionContent;
}

const imageTransforms = [
  { scale: 1.4, x: "15%", y: "15%" },  // 0: Motor / Front wheel (Speed)
  { scale: 1.6, x: "0%", y: "-15%" },  // 1: Deck / Base (Battery)
  { scale: 1.5, x: "-15%", y: "0%" },  // 2: Stem / Fold (Portable)
  { scale: 1.2, x: "0%", y: "0%" },    // 3: Frame (Durable)
  { scale: 1.4, x: "-20%", y: "20%" }, // 4: Rear wheel (Braking)
  { scale: 1.0, x: "0%", y: "0%" },    // 5: Full body (Aesthetic)
];

export function FeaturesSection({ content }: FeaturesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="features" className="scroll-mt-28 py-24 lg:py-32 relative z-10">
      <HpContainer>
        
        {/* Mobile View: Standard stacked cards, hidden on lg */}
        <div className="block lg:hidden space-y-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-hp-primary">
              {content.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-hp-foreground">
              {content.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-hp-muted">
              {content.description}
            </p>
          </div>
          
          <div className="mx-auto max-w-sm mb-12 relative">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.1),transparent_60%)] pointer-events-none" />
             <CldImage 
               src="h7x1466ee9ckng1yk37a" 
               alt="Scooter" 
               width={800} 
               height={800} 
               className="w-full h-auto object-contain relative z-10 drop-shadow-xl" 
             />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {content.items.map((feature) => {
              const Icon = getIcon(feature.icon);
              return (
                <div key={feature.title} className="rounded-[2rem] bg-white/60 backdrop-blur-md p-6 shadow-hp-soft border border-hp-border">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-hp-primary/10 text-hp-primary mb-4">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-xl font-semibold text-hp-foreground">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-hp-muted">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop View: Alternating Sticky Story */}
        <div className="hidden lg:block relative w-full">
          
          {/* Header Title Section */}
          <div className="pt-10 pb-20 max-w-2xl mx-auto text-center relative z-20">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-hp-primary">
              {content.eyebrow}
            </p>
            <h2 className="mt-5 font-display text-5xl font-bold tracking-tight text-hp-foreground leading-[1.15]">
              {content.title}
            </h2>
            <p className="mt-6 text-lg leading-8 text-hp-muted">
              {content.description}
            </p>
          </div>

          <div className="relative w-full">
            {/* Sticky Image Container */}
            <div className="sticky top-0 h-screen w-full flex items-center pointer-events-none z-0">
              <m.div 
                className="absolute w-1/2 p-12"
                animate={{
                  left: activeIndex % 2 === 0 ? "50%" : "0%"
                }}
                transition={{ type: "spring", stiffness: 45, damping: 20 }}
              >
                <div className="relative w-full aspect-[4/5] rounded-[3rem] bg-white/50 backdrop-blur-3xl border border-white/60 shadow-hp-soft overflow-hidden flex items-center justify-center p-12">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.06),transparent_60%)] pointer-events-none" />
                  <m.div
                    className="w-full h-full relative z-10 drop-shadow-2xl flex items-center justify-center"
                    animate={{
                      scale: imageTransforms[activeIndex]?.scale || 1,
                      x: imageTransforms[activeIndex]?.x || "0%",
                      y: imageTransforms[activeIndex]?.y || "0%",
                      rotateY: activeIndex % 2 === 0 ? 0 : 180
                    }}
                    transition={{ type: "spring", stiffness: 50, damping: 18, mass: 1 }}
                  >
                    <CldImage
                      src="h7x1466ee9ckng1yk37a"
                      alt="Scooter Details"
                      width={800}
                      height={800}
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  </m.div>
                </div>
              </m.div>
            </div>

            {/* Scrolling Text Content */}
            <div className="relative z-10 w-full -mt-[100vh] pb-[30vh]">
              {content.items.map((feature, index) => {
                const Icon = getIcon(feature.icon);
                const isActive = activeIndex === index;
                const isEven = index % 2 === 0;
                
                return (
                  <m.div 
                    key={feature.title}
                    className={`min-h-[80vh] flex flex-col justify-center py-10 w-1/2 ${isEven ? 'pr-20 mr-auto' : 'pl-20 ml-auto'}`}
                    onViewportEnter={() => setActiveIndex(index)}
                    viewport={{ amount: 0.5, margin: "-20% 0px -20% 0px" }}
                  >
                    <m.div 
                      animate={{ opacity: isActive ? 1 : 0.25, scale: isActive ? 1 : 0.95 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="max-w-md bg-white/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/60 shadow-hp-soft opacity-25 scale-95"
                    >
                      <div className="flex items-center gap-5 mb-6">
                        <div className={`flex h-16 w-16 items-center justify-center rounded-3xl transition-colors duration-500 ${isActive ? 'bg-hp-primary text-white shadow-hp-glow' : 'bg-hp-surface text-hp-muted border border-hp-border'}`}>
                          <Icon size={28} />
                        </div>
                        <p className={`text-sm font-semibold uppercase tracking-[0.2em] transition-colors duration-500 ${isActive ? 'text-hp-primary' : 'text-hp-muted'}`}>
                          {feature.stat}
                        </p>
                      </div>
                      <h3 className="text-4xl font-display font-bold text-hp-foreground">{feature.title}</h3>
                      <p className="mt-5 text-lg leading-relaxed text-hp-muted">{feature.description}</p>
                    </m.div>
                  </m.div>
                );
              })}
            </div>
          </div>
        </div>
      </HpContainer>
    </section>
  );
}
