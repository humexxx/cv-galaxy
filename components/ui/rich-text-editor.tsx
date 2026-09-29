"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  className?: string;
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", previous);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}>
      <div
        role="toolbar"
        aria-label="Text formatting"
        className="flex flex-wrap gap-0.5 border-b border-border bg-muted/60 p-1.5"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Bold"
          title="Bold"
          aria-pressed={editor.isActive("bold")}
          className={cn("h-7 w-7", editor.isActive("bold") && "bg-accent")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Italic"
          title="Italic"
          aria-pressed={editor.isActive("italic")}
          className={cn("h-7 w-7", editor.isActive("italic") && "bg-accent")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Heading 2"
          title="Heading 2"
          aria-pressed={editor.isActive("heading", { level: 2 })}
          className={cn("h-7 w-7", editor.isActive("heading", { level: 2 }) && "bg-accent")}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Heading 3"
          title="Heading 3"
          aria-pressed={editor.isActive("heading", { level: 3 })}
          className={cn("h-7 w-7", editor.isActive("heading", { level: 3 }) && "bg-accent")}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Bulleted list"
          title="Bulleted list"
          aria-pressed={editor.isActive("bulletList")}
          className={cn("h-7 w-7", editor.isActive("bulletList") && "bg-accent")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Numbered list"
          title="Numbered list"
          aria-pressed={editor.isActive("orderedList")}
          className={cn("h-7 w-7", editor.isActive("orderedList") && "bg-accent")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Insert or edit link"
          title="Insert or edit link"
          aria-pressed={editor.isActive("link")}
          className={cn("h-7 w-7", editor.isActive("link") && "bg-accent")}
          onClick={setLink}
        >
          <LinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Undo"
          title="Undo"
          className="h-7 w-7"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Redo"
          title="Redo"
          className="h-7 w-7"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none min-h-[180px] px-3 py-2 text-sm focus-within:outline-none [&_.tiptap]:outline-none [&_.tiptap]:min-h-[160px]"
      />
    </div>
  );
}
