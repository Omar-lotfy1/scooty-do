'use client'

import { m } from 'framer-motion'
import { Zap, BatteryCharging, Weight, Minimize2, ShieldCheck } from 'lucide-react'

const features = [
  {
    title: 'High Speed & Performance',
    description: 'Experience exhilarating speeds with our top-tier electric motors designed for urban agility.',
    icon: Zap,
    delay: 0.1,
  },
  {
    title: 'Long Battery Life',
    description: 'Go further on a single charge with advanced high-capacity lithium-ion cells.',
    icon: BatteryCharging,
    delay: 0.2,
  },
  {
    title: 'Supports up to 100KG',
    description: 'Built with a strong, reinforced frame to safely support heavier loads while maintaining balance and speed.',
    icon: Weight,
    delay: 0.3,
  },
  {
    title: 'Foldable & Portable Design',
    description: 'Collapse your scooter in seconds for effortless transport and compact storage.',
    icon: Minimize2,
    delay: 0.4,
  },
  {
    title: 'Safe & Durable Frame',
    description: 'Built to withstand daily commuting with reinforced frames and premium safety features.',
    icon: ShieldCheck,
    delay: 0.5,
  },
]

export function PremiumFeatures() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
      {/* Liquid Glass Background Elements */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div className="absolute -left-[20%] top-0 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[120px] mix-blend-screen" />
      <div className="absolute -right-[20%] bottom-0 h-[600px] w-[600px] rounded-full bg-orange-600/10 blur-[150px] mix-blend-screen" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center rtl:text-right">
          <m.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base font-semibold leading-7 text-orange-500 opacity-0 translate-y-[20px]"
          >
            Liquid Glass Engineering
          </m.h2>
          <m.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl opacity-0 translate-y-[20px]"
          >
            Premium Brand Features
          </m.p>
          <m.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-slate-300 opacity-0 translate-y-[20px]"
          >
            Designed for the ultimate urban commute. Uncompromising quality meets cutting-edge technology.
          </m.p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {features.map((feature, index) => (
              <m.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.6, ease: "easeOut" }}
                className={`relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-orange-500/30 hover:bg-white/10 hover:shadow-orange-500/10 opacity-0 translate-y-[30px] ${index >= 3 ? 'lg:col-span-1.5' : ''}`}
                style={{
                  gridColumn: index === 3 ? '1 / span 1' : index === 4 ? '2 / span 2' : 'auto'
                }}
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 ring-1 ring-white/10">
                  <feature.icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold leading-8 text-white">{feature.title}</h3>
                <p className="mt-4 flex-auto text-base leading-7 text-slate-300">{feature.description}</p>
                
                {/* Subtle chromatic aberration/glow effect on hover */}
                <div className="absolute -inset-px rounded-3xl border-2 border-transparent opacity-0 transition-opacity duration-500 hover:opacity-100" style={{ background: 'linear-gradient(45deg, transparent, rgba(249, 115, 22, 0.2), transparent) border-box', WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'destination-out', maskComposite: 'exclude' }} />
              </m.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
