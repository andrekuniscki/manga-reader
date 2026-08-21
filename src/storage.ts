import browser from "webextension-polyfill";

export interface ReaderSettings {
  mode: "single" | "continuous";
  zoom: number; // 0.5 - 2.5
  rtl: boolean;
  darkMode: boolean;
  fitWidth: boolean;
  hudHidden: boolean;
}

export interface ChapterProgress {
  page: number; // 0-indexed
  updatedAt: number;
}

const SETTINGS_KEY = "manga-reader:settings";
const PROGRESS_PREFIX = "manga-reader:progress:";

export const DEFAULT_SETTINGS: ReaderSettings = {
  mode: "single",
  zoom: 1,
  rtl: false,
  darkMode: true,
  fitWidth: true,
  hudHidden: false,
};

export async function getSettings(): Promise<ReaderSettings> {
  const stored = await browser.storage.local.get(SETTINGS_KEY);
  const value = stored[SETTINGS_KEY] as Partial<ReaderSettings> | undefined;
  return { ...DEFAULT_SETTINGS, ...(value || {}) };
}

export async function saveSettings(settings: ReaderSettings): Promise<void> {
  await browser.storage.local.set({ [SETTINGS_KEY]: settings });
}

export async function getProgress(chapterKey: string): Promise<ChapterProgress | null> {
  const key = PROGRESS_PREFIX + chapterKey;
  const stored = await browser.storage.local.get(key);
  return (stored[key] as ChapterProgress | undefined) || null;
}

export async function saveProgress(chapterKey: string, page: number): Promise<void> {
  const key = PROGRESS_PREFIX + chapterKey;
  await browser.storage.local.set({
    [key]: { page, updatedAt: Date.now() } satisfies ChapterProgress,
  });
}
