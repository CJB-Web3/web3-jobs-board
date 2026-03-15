import parse from "html-react-parser";
import { sanitizeRichText } from "@/lib/rich-text";

export default function RichTextContent({
  html,
  className,
}: {
  html?: string | null;
  className?: string;
}) {
  const sanitizedHtml = sanitizeRichText(html);

  if (!sanitizedHtml) {
    return null;
  }

  return <div className={className}>{parse(sanitizedHtml)}</div>;
}
