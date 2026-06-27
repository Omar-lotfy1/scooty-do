"use client";

import type { ProductSectionContent } from '@/types/homepage';
import { HpButton } from '@/components/home/ui/Button';
import { HpContainer } from '@/components/home/ui/Container';
import { HpSectionHeading } from '@/components/home/ui/SectionHeading';
import { Link } from '@/i18n/routing';
import { Reveal, ScaleIn } from '@/components/motion/reveal';

interface ProductGridSectionProps {
  content: ProductSectionContent;
}

export function ProductGridSection({ content }: ProductGridSectionProps) {
  return (
    <section id="products" className="scroll-mt-28 py-24 lg:py-32">
      <HpContainer>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <HpSectionHeading
              eyebrow={content.eyebrow}
              title={content.title}
              description={content.description}
            />
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {content.items.map((item, index) => (
            <ScaleIn
              key={item.id}
              delay={0.06 * index}
              className="group rounded-[2rem] border border-hp-border bg-white p-6 shadow-hp-soft transition-all duration-300 hover:-translate-y-1 hover:border-hp-primary/20 hover:shadow-hp-glow"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-full bg-hp-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-hp-primary">
                    {item.category}
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold text-hp-foreground">{item.name}</h3>
                  <p className="mt-3 max-w-md text-base leading-7 text-hp-muted line-clamp-2">{item.tagline}</p>
                </div>

              </div>

              <div className="mt-6 grid items-center gap-6 md:grid-cols-[1fr_0.9fr]">
                <div className="rounded-[1.75rem] bg-hp-surface p-5">
                  <img
                    src={item.image.src}
                    alt={item.image.alt}
                    width={item.image.width}
                    height={item.image.height}
                    loading="lazy"
                    className="mx-auto h-72 w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div>
                  <div className="text-sm text-hp-muted">Starting from</div>
                  <div className="mt-2 font-display text-4xl font-bold tracking-tight text-hp-foreground">
                    <span className="text-xl mr-1 text-hp-primary">EGP</span>{item.price.toLocaleString()}
                  </div>
                  <ul className="mt-6 space-y-3 text-sm text-hp-muted">
                    {item.specs.map((spec) => (
                      <li
                        key={spec.label}
                        className="flex items-start justify-between gap-4 border-b border-hp-border/70 pb-3"
                      >
                        <span>{spec.label}</span>
                        <span className="font-medium text-hp-foreground">{spec.value}</span>
                      </li>
                    ))}
                  </ul>
                  <a 
                    href={item.primaryCta.href} 
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-hp-primary px-5 h-12 text-sm font-semibold text-white shadow-hp-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-hp-primary-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hp-primary/40"
                  >
                    {item.primaryCta.label}
                  </a>
                </div>
              </div>
            </ScaleIn>
          ))}
        </div>

        {(content.viewMoreLabel && content.viewMoreHref) && (
          <Reveal delay={0.2} className="mt-16 flex justify-center">
            <Link 
              href={content.viewMoreHref} 
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-white px-8 h-14 text-base font-bold text-hp-foreground border border-hp-border shadow-hp-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-hp-primary/30 hover:text-hp-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hp-primary/40"
            >
              {content.viewMoreLabel}
            </Link>
          </Reveal>
        )}


      </HpContainer>
    </section>
  );
}
