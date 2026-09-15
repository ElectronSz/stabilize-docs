import {
  Activity,
  AppWindow,
  ArrowRightLeft,
  BadgeCheck,
  Blocks,
  Braces,
  Database,
  Layers,
  Lightbulb,
  RefreshCw,
  Rocket,
  Server,
  Settings,
  ShieldCheck,
  Terminal,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { NavIconName } from "@/lib/nav-manifest";

/**
 * The group icons used by the sidebars.
 *
 * Groups carry an icon *name*, not an icon component: the navigation is
 * resolved on the server (`lib/nav.ts` reads the filesystem) and handed to the
 * client sidebars as plain data. React components are not serialisable across
 * that boundary, so the manifest stores a name and the client resolves it here.
 * It also keeps `lib/nav.ts` free of any React import.
 *
 * Each mark is chosen to say what its group actually contains rather than to
 * decorate it — `Server` for the database-support group, `Terminal` for the
 * CLI, `ArrowRightLeft` for migrations, `RefreshCw` for row lifecycle.
 */
export const NAV_ICONS: Record<NavIconName, LucideIcon> = {
  rocket: Rocket,
  layers: Layers,
  database: Database,
  wrench: Wrench,
  activity: Activity,
  terminal: Terminal,
  server: Server,
  braces: Braces,
  settings: Settings,
  shield: ShieldCheck,
  lightbulb: Lightbulb,
  "badge-check": BadgeCheck,
  "arrow-right-left": ArrowRightLeft,
  blocks: Blocks,
  "refresh-cw": RefreshCw,
  "app-window": AppWindow,
};

export function navIcon(name: NavIconName): LucideIcon {
  return NAV_ICONS[name] ?? Layers;
}
