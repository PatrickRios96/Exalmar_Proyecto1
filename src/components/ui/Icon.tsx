import {
  Waves,
  Users,
  Link as Chain,
  Compass,
  ShieldCheck,
  Fish,
  Mail,
  HelpCircle,
  Check,
  Leaf,
  Anchor,
  Globe,
  Search,
  Menu,
  X,
  Wheat,
  Droplets,
} from "lucide-react";
const icons: Record<string, typeof Waves> = {
  waves: Waves,
  users: Users,
  link: Chain,
  compass: Compass,
  shield: ShieldCheck,
  fish: Fish,
  mail: Mail,
  help: HelpCircle,
  check: Check,
  leaf: Leaf,
  anchor: Anchor,
  globe: Globe,
  search: Search,
  menu: Menu,
  close: X,
  grain: Wheat,
  drop: Droplets,
};
export default function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const Component = icons[name] || Waves;
  return (
    <Component
      aria-hidden="true"
      className={`icon ${className}`}
      strokeWidth={1.6}
    />
  );
}
