"use client"

import { m, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode, useState, useEffect } from 'react';

interface RevealProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  y?: number;
}

export function useIsLowEndDevice() {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Prefers reduced motion media query
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsLowEnd(true);
      return;
    }

    // 2. Hardware Concurrency (low CPU cores)
    const isLowCpu = 'hardwareConcurrency' in navigator && navigator.hardwareConcurrency <= 4;

    // 3. Device Memory (Chromium-only, safely wrapped to prevent runtime crash in Safari/Firefox/iOS)
    const isLowMemory = 'deviceMemory' in navigator && (navigator as any).deviceMemory <= 2;

    if (isLowCpu || isLowMemory) {
      setIsLowEnd(true);
    }
  }, []);

  return isLowEnd;
}

export function Reveal({ children, delay = 0, y = 24, ...props }: RevealProps) {
  const isLowEnd = useIsLowEndDevice();

  if (isLowEnd) {
    return (
      <div {...(props as any)}>
        {children}
      </div>
    );
  }

  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
      {...props}
      className={`${props.className || ''} opacity-0`}
    >
      {children}
    </m.div>
  );
}

export function ScaleIn({ children, delay = 0, ...props }: RevealProps) {
  const isLowEnd = useIsLowEndDevice();

  if (isLowEnd) {
    return (
      <div {...(props as any)}>
        {children}
      </div>
    );
  }

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
      {...props}
      className={`${props.className || ''} opacity-0`}
    >
      {children}
    </m.div>
  );
}
