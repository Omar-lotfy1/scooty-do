"use client";

import { ArrowRight } from 'lucide-react';
import type { HeroContent } from '@/types/homepage';
import { getIcon } from '@/lib/icon-map';
import { HpButton } from '@/components/home/ui/Button';
import { HpContainer } from '@/components/home/ui/Container';
import { Reveal, ScaleIn } from '@/components/motion/reveal';

import Image from 'next/image';
import { CldImage } from 'next-cloudinary';

interface HeroSectionProps {
  hero: HeroContent;
  headlineOverride?: string;
  subOverride?: string;
  ctaOverride?: string;
  imageOverride?: string;
  imagePublicIdOverride?: string;
  statsOverride?: { value: string; label: string }[];
}

export function HeroSection({
  hero,
  headlineOverride,
  subOverride,
  ctaOverride,
  imageOverride,
  imagePublicIdOverride,
  statsOverride,
}: HeroSectionProps) {
  const title = headlineOverride || hero.title;
  const description = subOverride || hero.description;
  const ctaLabel = ctaOverride || hero.primaryCta.label;
  const imageSrc = imageOverride || hero.image.src;
  const stats = statsOverride ?? hero.stats;

  const hasPublicId = typeof imagePublicIdOverride === 'string' && imagePublicIdOverride.trim().length > 0;
  const isCloudinaryUrl = imageSrc && !imageSrc.startsWith('/') && (!imageSrc.startsWith('http') || imageSrc.includes('res.cloudinary.com'));
  const isCloudinary = hasPublicId || isCloudinaryUrl;
  const cloudinarySrc = hasPublicId ? imagePublicIdOverride : (isCloudinaryUrl ? imageSrc : undefined);

  return (
    <section id="top" className="relative overflow-hidden pt-36 sm:pt-40 lg:pt-44">
      <HpContainer className="relative grid items-center gap-14 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28">
        <Reveal className="relative z-10">
          <h1 className="mt-0 max-w-3xl font-display text-5xl font-bold tracking-tight text-hp-foreground sm:text-6xl lg:text-7xl xl:text-[5.5rem] xl:leading-[0.95]">
            <span className="block">Scooty <span className="text-hp-primary">DO</span></span>
            <span className="block">Ride. Move. <span className="text-hp-primary">DO</span></span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-hp-muted lg:text-xl">{description}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row rtl:sm:flex-row-reverse">
            <a 
              href={hero.primaryCta.href}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hp-primary/40 bg-hp-primary text-white shadow-hp-glow hover:-translate-y-0.5 hover:bg-hp-primary-bright h-14 px-7 text-base"
            >
              {ctaLabel}
              <ArrowRight size={18} className="rtl:rotate-180" />
            </a>
            <a 
              href={hero.secondaryCta.href}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hp-primary/40 bg-hp-card text-hp-foreground border border-hp-border shadow-hp-soft hover:-translate-y-0.5 hover:border-hp-primary/30 h-14 px-7 text-base"
            >
              {hero.secondaryCta.label}
            </a>
          </div>

          <div className="mt-10 grid gap-4 grid-cols-1 min-[400px]:grid-cols-3">
            {stats.map((stat, index) => (
              <ScaleIn
                key={`${stat.label}-${index}`}
                delay={0.08 * index}
                className="rounded-[1.75rem] border border-hp-border bg-white/90 p-5 shadow-hp-soft"
              >
                <div className="font-display text-2xl font-bold text-hp-foreground lg:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-hp-muted">{stat.label}</div>
              </ScaleIn>
            ))}
          </div>
        </Reveal>

        <ScaleIn delay={0.15} className="relative flex items-center justify-center lg:justify-end">
          <div className="absolute inset-0 m-auto h-[24rem] w-[24rem] rounded-full bg-hp-primary/10 blur-3xl sm:h-[30rem] sm:w-[30rem]" />
          {isCloudinary && cloudinarySrc ? (
            <CldImage
              src={cloudinarySrc}
              alt={hero.image.alt}
              width={hero.image.width}
              height={hero.image.height}
              priority={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              className="relative z-10 w-full max-w-xl hp-animate-float object-contain drop-shadow-[0_40px_80px_rgba(255,107,0,0.18)]"
            />
          ) : (
            <Image
              src={imageSrc}
              alt={hero.image.alt}
              width={hero.image.width}
              height={hero.image.height}
              priority={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              className="relative z-10 w-full max-w-xl hp-animate-float object-contain drop-shadow-[0_40px_80px_rgba(255,107,0,0.18)]"
            />
          )}
        </ScaleIn>
      </HpContainer>
    </section>
  );
}
