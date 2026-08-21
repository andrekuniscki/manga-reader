import type { Adapter, ParsedChapter } from "./types";

const MIN_WIDTH = 250;
const MIN_HEIGHT = 250;
const MIN_IMAGES = 3;

/** Words that strongly suggest an <a> points to the previous/next chapter. */
const NEXT_WORDS = /(next|próxim|proxim|seguinte|forward)/i;
const PREV_WORDS = /(prev|anterior|back|voltar)/i;

function isLikelyPageImage(img: HTMLImageElement): boolean {
  const w = img.naturalWidth || img.width || parseInt(img.getAttribute("width") || "0", 10);
  const h = img.naturalHeight || img.height || parseInt(img.getAttribute("height") || "0", 10);
  if (w && h) {
    if (w < MIN_WIDTH || h < MIN_HEIGHT) return false;
    // Extremely wide/short banners are usually ads, not manga pages.
    const ratio = w / h;
    if (ratio > 4 || ratio < 0.15) return false;
  }
  const src = (img.currentSrc || img.src || "").toLowerCase();
  if (!src || src.startsWith("data:")) return false;
  return true;
}

/** Finds the DOM ancestor that contains the largest contiguous run of page-like images. */
function findImageCluster(doc: Document): HTMLImageElement[] {
  const allImages = Array.from(doc.querySelectorAll("img")) as HTMLImageElement[];
  const candidates = allImages.filter(isLikelyPageImage);
  if (candidates.length < MIN_IMAGES) return [];

  // Group candidates by their nearest ancestor at a fixed depth heuristic: walk up
  // until we find a container whose descendant candidate-count stops increasing much.
  const countByAncestor = new Map<Element, number>();
  for (const img of candidates) {
    let node: Element | null = img.parentElement;
    let steps = 0;
    while (node && steps < 6) {
      countByAncestor.set(node, (countByAncestor.get(node) || 0) + 1);
      node = node.parentElement;
      steps++;
    }
  }

  let bestAncestor: Element | null = null;
  let bestCount = 0;
  for (const [el, count] of countByAncestor) {
    if (count > bestCount) {
      bestCount = count;
      bestAncestor = el;
    }
  }

  if (!bestAncestor || bestCount < MIN_IMAGES) return candidates; // fallback: just use all candidates in DOM order

  const inCluster = candidates.filter((img) => bestAncestor!.contains(img));
  return inCluster.length >= MIN_IMAGES ? inCluster : candidates;
}

function findChapterLink(doc: Document, wordPattern: RegExp): string | null {
  const anchors = Array.from(doc.querySelectorAll("a[href]")) as HTMLAnchorElement[];
  for (const a of anchors) {
    const text = `${a.textContent || ""} ${a.getAttribute("rel") || ""} ${a.getAttribute("aria-label") || ""}`;
    if (wordPattern.test(text)) {
      return a.href;
    }
  }
  return null;
}

function guessTitle(doc: Document): string {
  const h1 = doc.querySelector("h1");
  if (h1?.textContent?.trim()) return h1.textContent.trim();
  if (doc.title) return doc.title.trim();
  return "Manga Chapter";
}

export const genericAdapter: Adapter = {
  name: "generic",
  matches() {
    return true; // fallback: always applicable
  },
  parse(doc, url): ParsedChapter | null {
    const cluster = findImageCluster(doc);
    if (cluster.length < MIN_IMAGES) return null;

    const images = cluster
      .map((img) => img.currentSrc || img.src)
      .filter((src, idx, arr) => src && arr.indexOf(src) === idx); // dedupe, keep order

    if (images.length < MIN_IMAGES) return null;

    return {
      title: guessTitle(doc),
      chapterKey: url.split("#")[0].split("?")[0],
      images,
      prevChapterUrl: findChapterLink(doc, PREV_WORDS),
      nextChapterUrl: findChapterLink(doc, NEXT_WORDS),
    };
  },
};
