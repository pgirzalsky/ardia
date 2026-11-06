export const profileColors = {
  stackRing: { dark: "rgba(0,0,0,0.35)", light: "#FFFFFF" },
  badgeEdge: "rgba(0,0,0,0.12)",
  unknownSwatch: "#888888",
} as const;

export const SHARE_ROW_HEIGHT = 32;

export const profileSwitcher = {
  height: 42,
  band: 32,
  dotCell: 12,
  dot: 6,
  iconCell: 34,
  icon: 13,
  symbol: 11,
  dotTooltipLift: 18.25,
  dots: { selected: 0.85, hovered: 0.4, idle: 0.2 },
  icons: { selected: 1, hovered: 1, idle: 0.45 },
} as const;
