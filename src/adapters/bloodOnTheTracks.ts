import type { Adapter, ParsedChapter } from "./types";

/**
 * blood-on-the-tracks.com serves each chapter as a WordPress post: an <h1> title,
 * followed by a run of full-size <img> tags hosted on blogger.googleusercontent.com,
 * and a "Post navigation" block with Previous/Next links to adjacent chapters.
 */
/** Extracts a chapter number from a URL like .../blood-on-the-tracks-chapter-12/ */
function extractChapterNumber(url: string): number | null {
  const match = url.match(/chapter-(\d+)(?:[/?#]|$)/i);
  return match ? parseInt(match[1], 10) : null;
}

export const bloodOnTheTracksAdapter: Adapter = {
  name: "blood-on-the-tracks",
  matches(_doc, url) {
    return /(^|\.)blood-on-the-tracks\.com$/i.test(new URL(url).hostname);
  },
  parse(doc, url): ParsedChapter | null {
    const title = doc.querySelector("h1")?.textContent?.trim() || doc.title.trim();

    const images = Array.from(doc.querySelectorAll("img"))
      .map((img) => (img as HTMLImageElement).src)
      .filter((src) => /blogger(usercontent)?\.(com|googleusercontent\.com)/i.test(src));

    if (images.length < 3) return null;

    // The site's own "Previous"/"Next" post-navigation labels follow publish
    // date, which can disagree with story order (e.g. Chapter 2 was posted
    // before Chapter 1). So: use the labels only to *find* the candidate
    // adjacent-chapter links, then decide prev/next by comparing chapter
    // numbers parsed from the URLs, not by trusting the label text.
    const currentChapterNum = extractChapterNumber(url);
    const nav = Array.from(doc.querySelectorAll("a[href]")) as HTMLAnchorElement[];
    let prevChapterUrl: string | null = null;
    let nextChapterUrl: string | null = null;

    for (const a of nav) {
      const text = (a.textContent || "").trim();
      if (!/^previous/i.test(text) && !/^next/i.test(text)) continue;

      const candidateNum = extractChapterNumber(a.href);
      if (currentChapterNum !== null && candidateNum !== null) {
        if (candidateNum < currentChapterNum) prevChapterUrl = a.href;
        else if (candidateNum > currentChapterNum) nextChapterUrl = a.href;
        // candidateNum === currentChapterNum: ignore, shouldn't happen
      } else {
        // Couldn't parse numbers (unusual slug) — fall back to trusting the label.
        if (/^previous/i.test(text)) prevChapterUrl = a.href;
        if (/^next/i.test(text)) nextChapterUrl = a.href;
      }
    }

    return {
      title,
      chapterKey: url.split("#")[0].split("?")[0],
      images,
      prevChapterUrl,
      nextChapterUrl,
    };
  },
};
