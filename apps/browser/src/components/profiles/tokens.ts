import { byLayout } from "../../lib/layoutMode";

export const profileColors = {
  stackRing: { dark: "rgba(0,0,0,0.35)", light: "#FFFFFF" },
  badgeEdge: "rgba(0,0,0,0.12)",
  unknownSwatch: "#888888",
} as const;

export const profileBadge = { nudge: 0.031, initialScale: 0.425, initialTracking: -0.019, emojiScale: 0.55, emojiFitByBadge: { 16: { fontSize: 8.8, shiftX: 0.5 }, 20: { fontSize: 12 }, 64: { fontSize: 35 } } as Partial<Record<number, { fontSize: number; shiftX?: number }>>, emojiInkRise: 0.375, emojiInkShift: 0.02 } as const;

export const SHARE_ROW_HEIGHT = 32;

const SWITCHER_STANDARD = {
  symbol: 11,
  symbolWeight: "semibold" as "semibold" | "medium",
  height: 41,
  band: 28,
  dotCell: 12,
  dot: 6,
  iconCell: 26,
  icon: 11,
  dotTooltipLift: 18.25,
  dots: { selected: 0.85, hovered: 0.4, idle: 0.2 },
  icons: { selected: 1, hovered: 0.7, idle: 0.42 },
  holdPlate: { dot: 16, icon: 22, radius: 6 },
};

const SWITCHER_LOOSE: Partial<typeof SWITCHER_STANDARD> = {
  height: 42,
  band: 32,
  iconCell: 34,
  icon: 13,
  symbolWeight: "medium",
  icons: { selected: 1, hovered: 1, idle: 0.45 },
};

export const profileSwitcher = byLayout(SWITCHER_STANDARD, SWITCHER_LOOSE);
