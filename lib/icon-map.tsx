import type { LucideIcon } from 'lucide-react';
import {
  BatteryCharging,
  Bike,
  CircleGauge,
  FoldHorizontal,
  Leaf,
  Route,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  battery: BatteryCharging,
  brake: CircleGauge,
  fold: FoldHorizontal,
  leaf: Leaf,
  route: Route,
  shield: ShieldCheck,
  sparkles: Sparkles,
  zap: Zap,
  bike: Bike,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Sparkles;
}
