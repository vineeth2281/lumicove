"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

interface EditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

export const Editor = ({ initialContent = "", onChange }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Type '/' for commands or start writing...",
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert focus:outline-none max-w-none w-full p-4",
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  return (
    <div className="w-full h-full min-h-[150px] border rounded-md bg-white dark:bg-black shadow-sm">
      <EditorContent editor={editor} />
    </div>
  );
};
