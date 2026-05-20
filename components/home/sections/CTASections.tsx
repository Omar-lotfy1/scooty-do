"use client";

import type { CtaSectionItem } from '@/types/homepage';
import { HpButton } from '@/components/home/ui/Button';
import { HpContainer } from '@/components/home/ui/Container';
import { Reveal } from '@/components/motion/reveal';

interface CTASectionsProps {
  items: CtaSectionItem[];
  featuredImageUrl?: string;
}

export function CTASections({ items, featuredImageUrl }: CTASectionsProps) {
  return (
    <section id="cta" className="scroll-mt-28 py-24 lg:py-32">
      <HpContainer className="space-y-8">
        {items.map((item, index) => (
          <Reveal
            key={item.id}
            delay={0.08 * index}
            className={`overflow-hidden rounded-[2.5rem] border border-hp-border shadow-hp-soft ${
              item.variant === 'split' ? 'bg-white' : 'hp-gradient-orange text-white'
            }`}
          >
            {item.variant === 'split' ? (
              <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="p-8 sm:p-10 lg:p-14">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-hp-primary">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-4 font-display text-3xl font-bold tracking-tight text-hp-foreground sm:text-4xl">
                    {item.title}
                  </h3>
                  <p className="mt-5 max-w-2xl text-base leading-7 text-hp-muted">{item.description}</p>
                  {item.bullets?.length ? (
                    <ul className="mt-6 space-y-3 text-sm text-hp-muted">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-center gap-3">
                          <span className="h-2.5 w-2.5 rounded-full bg-hp-primary" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a href={item.primaryCta.href}>
                      <HpButton>{item.primaryCta.label}</HpButton>
                    </a>
                    {item.secondaryCta ? (
                      <a href={item.secondaryCta.href}>
                        <HpButton variant="secondary">{item.secondaryCta.label}</HpButton>
                      </a>
                    ) : null}
                  </div>
                </div>
                {item.image ? (
                  <div className="bg-hp-surface p-8 lg:p-12">
                    <div className="mx-auto h-80 w-full max-w-md overflow-hidden rounded-[2rem] bg-zinc-950">
                      <img
                        src={item.id === 'cta-primary' && featuredImageUrl ? featuredImageUrl : item.image.src}
                        alt={item.image.alt}
                        width={item.image.width}
                        height={item.image.height}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="px-6 py-12 text-center sm:px-10 lg:px-16 lg:py-16">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
                  {item.eyebrow}
                </p>
                <h3 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  {item.title}
                </h3>
                <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/80">
                  {item.description}
                </p>
                {item.bullets?.length ? (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    {item.bullets.map((bullet) => (
                      <span
                        key={bullet}
                        className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium"
                      >
                        {bullet}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="mt-8">
                  <a href={item.primaryCta.href}>
                    <HpButton variant="secondary">{item.primaryCta.label}</HpButton>
                  </a>
                </div>
              </div>
            )}
          </Reveal>
        ))}
      </HpContainer>
    </section>
  );
}
