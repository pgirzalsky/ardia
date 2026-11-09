import { create } from "zustand";

export type LayoutMode = "default" | "loose";

let mode: LayoutMode = "default";
const listeners = new Set<(mode: LayoutMode) => void>();

export const useLayoutEpoch = create<{ epoch: number }>()(() => ({ epoch: 0 }));

export const layoutMode = () => mode;
export const isLoose = () => mode === "loose";
export const pick = <T,>(standard: T, loose: T, m: LayoutMode = mode): T => (m === "loose" ? loose : standard);

export function onLayoutMode(apply: (mode: LayoutMode) => void) {
  apply(mode);
  listeners.add(apply);
}

export function setLayoutMode(next: LayoutMode) {
  if (next === mode) return;
  mode = next;
  listeners.forEach((apply) => apply(next));
  useLayoutEpoch.setState((s) => ({ epoch: s.epoch + 1 }));
}
