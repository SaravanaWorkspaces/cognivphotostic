/**
 * Render-time normalizer for rich-text body HTML stored in Strapi.
 *
 * Pasted content from Notion / Google Docs / Word arrives wrapped in
 * `<h1>`s with inline `style="font-size: …"` spans, plus `data-start`,
 * `data-end`, `data-section-id` attributes. This breaks `prose` typography
 * (everything becomes huge bold headings) and bloats the markup.
 *
 * Also downgrades any body-level `<h1>` to `<h2>`: the post page already has
 * a single `<h1>` for the title, and additional `<h1>`s in the body are bad
 * for SEO + accessibility.
 */
export function cleanRichText(html: string): string {
  if (!html) return '';

  let out = html;

  out = out.replace(/<span[^>]*>/gi, '').replace(/<\/span>/gi, '');
  out = out.replace(/\sstyle="[^"]*"/gi, '');
  out = out.replace(/\sdata-(?:start|end|section-id|is-last-node|is-only-node)="[^"]*"/gi, '');
  out = out.replace(/&nbsp;/g, ' ');

  // Notion / Word paste wraps multi-sentence body text in <h1>. Anything that
  // looks like a paragraph (long, or contains "X. Y") becomes <p>; the short
  // single-line headings become <h2>.
  out = out.replace(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/gi, (_m, inner: string) => {
    const text = inner.replace(/<[^>]*>/g, '').trim();
    if (!text) return '';
    // Multiple sentence breaks → paragraph. A single `. ` (e.g. "1. Living
    // Room") is normal numbered-heading punctuation and stays a heading.
    const sentenceBreaks = (text.match(/\.\s/g) ?? []).length;
    const looksLikeParagraph = text.length > 100 || sentenceBreaks >= 2;
    return looksLikeParagraph ? `<p>${inner}</p>` : `<h2>${inner}</h2>`;
  });

  // Notion exports list items as `<li><p>…</p></li>` — unwrap so prose
  // applies its tight list styles instead of paragraph spacing.
  out = out.replace(/<li(\s[^>]*)?>\s*<p(?:\s[^>]*)?>([\s\S]*?)<\/p>\s*<\/li>/gi, '<li$1>$2</li>');

  // Drop redundant <strong> wrappers inside headings (the heading is already bold).
  out = out.replace(/(<h[1-6](?:\s[^>]*)?>)\s*<strong[^>]*>([\s\S]*?)<\/strong>\s*(<\/h[1-6]>)/gi, '$1$2$3');

  out = out.replace(/<(h[1-6]|p)[^>]*>\s*(?:<br\s*\/?>)?\s*<\/\1>/gi, '');

  return out;
}

/** Strip HTML tags and collapse whitespace to plain text. */
export function htmlToPlainText(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Derive a clean excerpt from rich text: word-boundary cut, ellipsis if truncated. */
export function deriveExcerpt(html: string, maxLen = 220): string {
  const text = htmlToPlainText(html);
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…';
}

/**
 * Split rich text into (intro paragraph, remainder HTML). Used by the post
 * page to render the first paragraph as the lead/excerpt and the rest as
 * the body, so the same content isn't shown twice.
 *
 * Operates on already-cleaned HTML (call after `cleanRichText`).
 */
export function splitIntro(html: string): { intro: string; rest: string } {
  if (!html) return { intro: '', rest: '' };
  const match = html.match(/^\s*<p(?:\s[^>]*)?>([\s\S]*?)<\/p>\s*/i);
  if (!match) return { intro: '', rest: html };
  const introText = htmlToPlainText(match[1]);
  return { intro: introText, rest: html.slice(match[0].length) };
}
