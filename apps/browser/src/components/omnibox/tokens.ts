import { onLayoutMode, pick } from "../../lib/layoutMode";
import { curve } from "../ui/motion";
import { capsule, font, radius, space } from "../ui/tokens";

export const PANEL_TEXT_LEFT = 48;
const PANEL_ICON_LEFT = 21;
const FIELD_TEXT_INSET = 2.5;
const ICON_SLOT = 18;

export const BAR_TYPE = {
  heroField: font.large,
  floatingField: font.title,
  panelField: font.body,
  goLabel: font.title,
  scope: font.title,
  heroScope: font.title,
} as const;

export const BAR = {
  iconSlot: ICON_SLOT,
  leadingIcon: 15,
  panelFieldLift: -3,
  panel: {
    height: 55,
    heroHeight: 60,
    iconLeft: PANEL_ICON_LEFT,
    heroIconLeft: 18,
    right: 18,
    heroGap: space.m,
    gap: PANEL_TEXT_LEFT - FIELD_TEXT_INSET - PANEL_ICON_LEFT - ICON_SLOT,
  },
  dropdown: { height: 44, left: 13, right: 9, gap: 9 },
  siteControls: { glyph: 15 },
  bottom: { left: 14, heroLeft: 13, right: 13, heroRight: 15, height: 52, heroHeight: 43, heroBelow: space.m, mic: 14 },
} as const;

export const ADD_CHIP = {
  height: 32,
  radius: capsule(32),
  border: 1,
  left: 9,
  right: 12,
  gap: 5,
  glyph: 10,
  glyphBox: 14,
  otherTabs: 12,
} as const;

export const GO_BUTTON = {
  before: space.m,
  minWidth: 99,
  height: 32,
  padX: space.xl,
  radius: capsule(32),
  hoverOpacity: 0.9,
  gap: space.s,
  glyph: 11,
  glyphBox: 14,
  glyphAlpha: "99",
} as const;

export const SCOPE_CHIP = {
  height: 26,
  heroHeight: 28,
  radius: radius.tile,
  left: 7,
  right: 9,
  gap: space.s,
  favicon: 14,
  maxWidth: 220,
} as const;

const SUGGESTION_STANDARD = {
  listX: 8,
  dropdownListX: space.s as number,
  listBelow: space.xxs as number,
  dropdownListBelow: space.s as number,
  height: 36,
  gapY: 2,
  radius: radius.tile as number,
  padX: 13,
  gap: 11,
  icon: 13,
  calcIcon: 14,
  iconBox: 16,
  plateRadius: 0,
  plateFill: { dark: "transparent", light: "transparent" },
  favicon: undefined as number | undefined,
};

const SUGGESTION_LOOSE: typeof SUGGESTION_STANDARD = {
  listX: 10,
  dropdownListX: 10,
  listBelow: 10,
  dropdownListBelow: 10,
  height: 50,
  gapY: 1,
  radius: radius.chrome,
  padX: 14,
  gap: 14,
  icon: 15,
  calcIcon: 15,
  iconBox: 26,
  plateRadius: 6,
  plateFill: { dark: "rgba(255,255,255,0.14)", light: "rgba(0,0,0,0.06)" },
  favicon: 18,
};

export const SUGGESTION: typeof SUGGESTION_STANDARD = { ...SUGGESTION_STANDARD };

onLayoutMode((m) => Object.assign(SUGGESTION, pick(SUGGESTION_STANDARD, SUGGESTION_LOOSE, m)));

export const SELECTED_SUGGESTION_ALPHA = { dark: 0.56, light: 0.3 } as const;

export const SUGGESTION_TEXT_SIZE = font.title.fontSize;

export const GROW = { duration: 130, easing: curve.outExpo } as const;
