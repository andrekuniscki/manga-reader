export interface ParsedChapter {
  title: string;
  /** Stable-ish identifier for this chapter, used as the storage key for progress. */
  chapterKey: string;
  images: string[];
  prevChapterUrl: string | null;
  nextChapterUrl: string | null;
}

export interface Adapter {
  name: string;
  /** Return true if this adapter should handle the given document/URL. */
  matches(doc: Document, url: string): boolean;
  /** Parse the chapter. Return null if it couldn't find enough content. */
  parse(doc: Document, url: string): ParsedChapter | null;
}
