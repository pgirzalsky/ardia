import { ROW_METRICS, type ThemeLook } from "./themeLook";

export const LOOSE_METRICS = { rowHeight: 36, rowGap: 5, pinnedHeight: 43 } as const;

const looks = new WeakMap<ThemeLook, ThemeLook>();

const unlessThemed = (theirs: number, ours: number, base: number) => (theirs === base ? ours : theirs);

export function looseLookOf(look: ThemeLook): ThemeLook {
  let made = looks.get(look);
  if (made) return made;
  made = {
    ...look,
    loose: true,
    metrics: {
      rowHeight: unlessThemed(look.metrics.rowHeight, LOOSE_METRICS.rowHeight, ROW_METRICS.rowHeight),
      rowGap: unlessThemed(look.metrics.rowGap, LOOSE_METRICS.rowGap, ROW_METRICS.rowGap),
      pinnedHeight: unlessThemed(look.metrics.pinnedHeight, LOOSE_METRICS.pinnedHeight, ROW_METRICS.pinnedHeight),
    },
  };
  looks.set(look, made);
  return made;
}
