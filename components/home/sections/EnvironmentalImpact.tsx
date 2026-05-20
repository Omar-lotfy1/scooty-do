"use client";

import { m, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { HpContainer } from '@/components/home/ui/Container';
import { Leaf, Droplets } from 'lucide-react';
import { useTranslations } from 'next-intl';

function AnimatedCounter({ from = 0, to, duration = 2 }: { from?: number, to: number, duration?: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView && nodeRef.current) {
      let startTime: number;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(ease * (to - from) + from);
        
        if (nodeRef.current) {
          nodeRef.current.textContent = current.toLocaleString();
        }
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else if (nodeRef.current) {
           nodeRef.current.textContent = to.toLocaleString();
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, from, to, duration]);

  return <span ref={nodeRef}>{from}</span>;
}

export function EnvironmentalImpact() {
  const t = useTranslations('EnvironmentalImpact');

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden z-10">
      <HpContainer>
        <div className="grid lg:grid-cols-[1fr_1fr] gap-16 items-center">
          
          {/* Left Text Content */}
          <m.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl opacity-0 -translate-x-[50px]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-hp-primary/10 text-hp-primary">
                <Leaf size={20} />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-hp-primary">
                {t('eyebrow')}
              </p>
            </div>
            
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-hp-foreground leading-[1.1]">
              {t('title1')}<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-hp-primary to-orange-400">
                {t('title2')}
              </span>
            </h2>
            
            <p className="mt-8 text-xl leading-relaxed text-hp-muted">
              {t('description')}
            </p>
          </m.div>

          {/* Right Stats Block */}
          <m.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative opacity-0 translate-y-[50px]"
          >
            {/* Glowing background blob */}
            <div className="absolute inset-0 bg-gradient-to-tr from-hp-primary/20 to-orange-400/5 blur-3xl -z-10 rounded-full transform scale-110" />

            <div className="grid gap-4 sm:grid-cols-2">
              
              <div className="rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
                <div className="text-5xl font-display font-bold text-hp-foreground mb-2">
                  <AnimatedCounter to={2450} duration={2.5} /><span className="text-hp-primary">+</span>
                </div>
                <div className="text-sm font-semibold uppercase tracking-[0.1em] text-hp-muted">
                  {t('stat1Label')}
                </div>
              </div>

              <div className="rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 sm:translate-y-8">
                <div className="text-5xl font-display font-bold text-hp-foreground mb-2">
                  <span className="text-hp-primary">$</span><AnimatedCounter to={1200} duration={2.5} />
                </div>
                <div className="text-sm font-semibold uppercase tracking-[0.1em] text-hp-muted">
                  {t('stat2Label')}
                </div>
              </div>

              <div className="rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
                <div className="text-5xl font-display font-bold text-hp-foreground mb-2">
                  <AnimatedCounter to={50000} duration={3} /><span className="text-hp-primary">+</span>
                </div>
                <div className="text-sm font-semibold uppercase tracking-[0.1em] text-hp-muted">
                  {t('stat3Label')}
                </div>
              </div>

              <div className="rounded-[2.5rem] bg-hp-foreground text-white border border-white/10 p-8 shadow-xl transition-all duration-300 sm:translate-y-8 flex flex-col justify-center">
                <div className="mb-4 text-hp-primary">
                  <Droplets size={32} />
                </div>
                <div className="text-2xl font-display font-bold mb-2">
                  {t('stat4Title')}
                </div>
                <div className="text-sm text-white/70">
                  {t('stat4Desc')}
                </div>
              </div>

            </div>
          </m.div>
          
        </div>
      </HpContainer>
    </section>
  );
}
