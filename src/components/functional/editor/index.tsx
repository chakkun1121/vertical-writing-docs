import { useEffect, useRef, useState } from "react";

import { defaultMarkdownParser, defaultMarkdownSerializer } from "prosemirror-markdown";

import { baseKeymap } from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { PMMenuBar } from "./PMMenuBar";

baseKeymap["Mod-z"] = undo;
baseKeymap["Mod-y"] = redo;

console.log("keymaps", Object.keys(baseKeymap));

export default function Editor({
  markdown,
  setMarkdown,
}: {
  markdown: string;
  setMarkdown: React.Dispatch<React.SetStateAction<string>>;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  const [editorView, setEditorView] = useState<EditorView | null>(null);

  useEffect(() => {
    const editorView = new EditorView(editorRef.current!, {
      state: EditorState.create({
        doc: defaultMarkdownParser.parse(markdown),
        plugins: [keymap(baseKeymap), history()],
      }),
      dispatchTransaction: (transaction: Transaction) => {
        const docChanged = transaction.docChanged;
        const state = editorView.state.apply(transaction);
        if (docChanged) {
          console.log("doc changed");
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
  }, [editorRef]);

  return (
    <div className="flex flex-row-reverse">
      <PMMenuBar editorView={editorView!} />
      <div
        ref={editorRef}
        className="prose h-full w-full max-w-none flex-1 overflow-x-scroll"
        style={{
          writingMode: "vertical-rl",
        }}
      />
    </div>
  );
}
