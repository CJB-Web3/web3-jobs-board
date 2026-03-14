const ALLOWED_RICH_TEXT_TAGS = new Set([
  "p",
  "h2",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "s",
  "br",
]);

const BLOCKED_ELEMENT_PATTERN =
  /<(script|style|iframe|object|embed|svg|math|noscript|template)[^>]*>[\s\S]*?<\/\1>/gi;
const BLOCKED_STANDALONE_PATTERN =
  /<(script|style|iframe|object|embed|svg|math|noscript|template)[^>]*\/?>/gi;
const COMMENT_PATTERN = /<!--[\s\S]*?-->/g;

export function sanitizeRichText(value?: string | null) {
  if (!value) {
    return "";
  }

  return value
    .replace(/\r\n/g, "\n")
    .replace(BLOCKED_ELEMENT_PATTERN, "")
    .replace(BLOCKED_STANDALONE_PATTERN, "")
    .replace(COMMENT_PATTERN, "")
    .replace(/<\/?([a-z0-9]+)(?:\s[^>]*)?>/gi, (tag, rawName) => {
      const name = rawName.toLowerCase();

      if (!ALLOWED_RICH_TEXT_TAGS.has(name)) {
        return "";
      }

      if (name === "br") {
        return "<br />";
      }

      return tag.startsWith("</") ? `</${name}>` : `<${name}>`;
    })
    .trim();
}

export function richTextToPlainText(value?: string | null) {
  return sanitizeRichText(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h2|li)>/gi, "\n")
    .replace(/<\/(ul|ol)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
