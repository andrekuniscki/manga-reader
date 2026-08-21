import type { Adapter, ParsedChapter } from "./types";
import { bloodOnTheTracksAdapter } from "./bloodOnTheTracks";
import { genericAdapter } from "./generic";

// Order matters: specific adapters are tried before the generic fallback.
const adapters: Adapter[] = [bloodOnTheTracksAdapter, genericAdapter];

export function parseChapter(doc: Document, url: string): ParsedChapter | null {
  for (const adapter of adapters) {
    if (!adapter.matches(doc, url)) continue;
    const result = adapter.parse(doc, url);
    if (result) return result;
  }
  return null;
}

export type { ParsedChapter };
