"use client";

import type { TestimonialSectionContent } from '@/types/homepage';
import { HpContainer } from '@/components/home/ui/Container';
import { HpSectionHeading } from '@/components/home/ui/SectionHeading';
import { Reveal } from '@/components/motion/reveal';

interface TestimonialsSectionProps {
  content: TestimonialSectionContent;
}

export function TestimonialsSection({ content }: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className="scroll-mt-28 py-24 lg:py-32">
      <HpContainer>
        <Reveal>
          <HpSectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
            align="center"
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, index) => (
            <Reveal
              key={item.name}
              delay={0.08 * index}
              className="rounded-[2rem] border border-hp-border bg-hp-card p-7 shadow-hp-soft transition-all duration-300 hover:-translate-y-1 hover:border-hp-primary/20"
            >
              <div className="text-4xl text-hp-primary">&ldquo;</div>
              <p className="mt-4 text-base leading-8 text-hp-muted">{item.quote}</p>
              <div className="mt-8 border-t border-hp-border pt-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-hp-primary">
                  {item.highlight}
                </p>
                <p className="mt-3 text-lg font-semibold text-hp-foreground">{item.name}</p>
                <p className="text-sm text-hp-muted">{item.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </HpContainer>
    </section>
  );
}
