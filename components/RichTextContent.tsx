import React from "react";
import parse, {
  DOMNode,
  Element,
  HTMLReactParserOptions,
  domToReact,
} from "html-react-parser";
import { sanitizeRichText } from "@/lib/rich-text";

const options: HTMLReactParserOptions = {
  replace: (domNode: DOMNode) => {
    if (!(domNode instanceof Element)) {
      return undefined;
    }

    const classNameMap: Record<string, string> = {
      h2: "text-lg font-medium text-foreground mt-4 mb-2",
      p: "mb-3",
      ul: "list-disc pl-5 mb-3 space-y-1",
      ol: "list-decimal pl-5 mb-3 space-y-1",
      li: "pl-1",
    };

    const className = classNameMap[domNode.name];
    if (!className) {
      return undefined;
    }

    return React.createElement(
      domNode.name,
      { className },
      domToReact(domNode.children as DOMNode[], options)
    );
  },
};

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

  return <div className={className}>{parse(sanitizedHtml, options)}</div>;
}
