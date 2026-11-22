import { activeLook } from "./activeLook";

export const isLoose = (): boolean => activeLook().loose;
export const pick = <T,>(standard: T, loose: T): T => (isLoose() ? loose : standard);

export function byLayout<T extends object>(standard: T, loose: Partial<T>): T {
  const out = {} as T;
  for (const key of Object.keys(standard) as (keyof T)[]) {
    Object.defineProperty(out, key, { enumerable: true, get: () => (isLoose() && key in loose ? loose[key] : standard[key]) });
  }
  return out;
}
