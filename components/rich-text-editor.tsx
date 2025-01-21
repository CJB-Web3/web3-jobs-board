"use client";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";

type Props = {
  value: string;
  onChange: (richText: string) => void;
  placeholder: string;
};

const RichTextEditor = ({ value, onChange, placeholder }: Props) => {
  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Paragraph.configure({
        HTMLAttributes: {
          class: "mb-2 text-sm",
        },
      }),
      Heading.configure({
        levels: [2],
        HTMLAttributes: {
          class: "text-xl font-bold mb-2",
        },
      }),
      StarterKit.configure({
        document: false,
        text: false,
        paragraph: false,
        heading: false,
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-5 mb-2",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-5 mb-2",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "pl-1",
          },
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
  });

  return (
    <div className="w-full space-y-1">
      <Toolbar editor={editor} />
      <div className="relative">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
