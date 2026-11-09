import { onLayoutMode, pick } from "./layoutMode";

export const SIDEBAR_ROW = { height: 34, gap: 3 };

onLayoutMode((m) => Object.assign(SIDEBAR_ROW, pick({ height: 34, gap: 3 }, { height: 36, gap: 5 }, m)));

export const SIDEBAR_GROUP = { indent: 16, border: 0.5, radius: 12 } as const;
