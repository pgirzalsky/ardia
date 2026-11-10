import { SIDEBAR_GROUP } from "../../lib/sidebarMetrics";
import { layout } from "../ui/theme";
import { onLayoutMode } from "../../lib/layoutMode";
import { radius } from "../ui/tokens";
import { profileSwitcher } from "../profiles/tokens";

export const LIVE_FOLDER_PAD = 2;
export const GROUP_INDENT = SIDEBAR_GROUP.indent;
export const GROUP_BORDER = SIDEBAR_GROUP.border;
export const GROUP_RADIUS = SIDEBAR_GROUP.radius;
export const GROUP_INNER_RADIUS = GROUP_RADIUS - GROUP_BORDER;

export const SIDEBAR_FIELD = { top: 46, height: layout.rowHeight, radius: radius.chrome };
const DOWNLOADS_BUTTON_SIZE = 34;
const FOOTER_BAND_BOTTOM = 3;
export const SIDEBAR_FOOTER_DOWNLOADS = {
  bottom: FOOTER_BAND_BOTTOM + (profileSwitcher.height - FOOTER_BAND_BOTTOM - DOWNLOADS_BUTTON_SIZE) / 2,
  size: DOWNLOADS_BUTTON_SIZE,
};
onLayoutMode(() => {
  SIDEBAR_FOOTER_DOWNLOADS.bottom = FOOTER_BAND_BOTTOM + (profileSwitcher.height - FOOTER_BAND_BOTTOM - DOWNLOADS_BUTTON_SIZE) / 2;
});
export function listTopGap(addressBar: boolean): number {
  return addressBar ? 6 : layout.pinnedTop - layout.sidebarHeader;
}

export let SIDEBAR_HEADER_WITH_FIELD = SIDEBAR_FIELD.top + SIDEBAR_FIELD.height;
onLayoutMode(() => {
  SIDEBAR_FIELD.height = layout.rowHeight;
  SIDEBAR_HEADER_WITH_FIELD = SIDEBAR_FIELD.top + SIDEBAR_FIELD.height;
});
