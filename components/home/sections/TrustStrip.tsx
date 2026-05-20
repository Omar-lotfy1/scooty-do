"use client";

import type { TrustItem } from '@/types/homepage';
import { getIcon } from '@/lib/icon-map';
import { HpContainer } from '@/components/home/ui/Container';
import { Reveal } from '@/components/motion/reveal';

interface TrustStripProps {
  items: TrustItem[];
}

export function TrustStrip({ items }: TrustStripProps) {
  return (
    <section className="border-y border-hp-border">
      <HpContainer className="grid gap-4 py-5 grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const Icon = getIcon(item.icon);
          return (
            <Reveal key={item.label} delay={0.06 * index} className="rounded-[1.5rem] bg-hp-surface p-4 shadow-hp-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-hp-primary/10 text-hp-primary">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-hp-foreground">{item.label}</p>
                  <p className="text-sm text-hp-muted">{item.value}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </HpContainer>
    </section>
  );
}
