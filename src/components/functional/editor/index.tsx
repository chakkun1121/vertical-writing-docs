import { useEffect, useRef, useState } from "react";

import { defaultMarkdownParser, defaultMarkdownSerializer } from "prosemirror-markdown";

import { cn } from "@/lib/utils";
import { baseKeymap } from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { PMMenuBar } from "./PMMenuBar";

baseKeymap["Mod-z"] = undo;
baseKeymap["Mod-y"] = redo;

export default function Editor({
  markdown,
  setMarkdown,
  handle,
}: {
  markdown: string | null;
  setMarkdown: React.Dispatch<React.SetStateAction<string | null>>;
  handle?: FileSystemFileHandle;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  const [editorView, setEditorView] = useState<EditorView | null>(null);

  useEffect(() => {
    const editorView = new EditorView(editorRef.current!, {
      state: EditorState.create({
        doc: defaultMarkdownParser.parse(markdown || ""),
        plugins: [keymap(baseKeymap), history()],
      }),
      dispatchTransaction: (transaction: Transaction) => {
        const docChanged = transaction.docChanged;
        const state = editorView.state.apply(transaction);
        if (docChanged) {
          const markdown = defaultMarkdownSerializer.serialize(state.doc);
          setMarkdown(markdown);
        }
        editorView.updateState(state);
      },
    });

    setEditorView(editorView);
    setMarkdown(defaultMarkdownSerializer.serialize(editorView.state.doc));

    editorView.focus();
    return () => {
      editorView.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorRef, handle]);

  return (
    <div className="flex flex-1 flex-row-reverse">
      <PMMenuBar editorView={editorView!} />
      <div
        ref={editorRef}
        className={cn(
          "w-full max-w-none flex-1 overflow-x-scroll p-4",
          "*:w-full *:outline-0",
          "prose prose-h1:mx-4 prose-h2:mx-2 prose-h2:mt-0 prose-h3:mx-3 prose-p:m-0"
        )}
        style={{
          writingMode: "vertical-rl",
          textOrientation: "upright",
        }}
      />
    </div>
  );
}
