import React, { useEffect, useRef, useState } from "react";

import { defaultMarkdownParser, defaultMarkdownSerializer } from "prosemirror-markdown";

import { baseKeymap } from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { PMMenuBar } from "./PMMenuBar";

const initialContent = `# 美しい日本語

## 草枕

山路を登りながら、こう考えた。

智に働けば角が立つ。情に掉させば流される。意地を通せば窮屈だ。とかくに人の世は住みにくい。

住みにくさが高じると、安いところへ引き越したくなる。どこへ越しても住みにくいと悟ったとき、詩が生れて、絵ができる。

## 東京の坂道

-   乃木坂
-   けやき坂
-   日向坂

## 徒然草

### 折節の移り変るこそ、ものごとにあはれなれ。

さて、冬枯のけしきこそ、秋にはをさをさ劣るまじけれ。汀の草に紅葉の散り止りて、霜いと白うおける朝、遣水より烟の立つこそをかしけれ。年の暮れ果てて、人ごとに急ぎあへるころぞ、またなくあはれなる。すさまじきものにして見る人もなき月の寒けく澄める、廿日余りの空こそ、心ぼそきものなれ。御仏名、荷前の使立つなどぞ、あはれにやんごとなき。公事ども繁く、春の急ぎにとり重ねて催し行はるるさまぞ、いみじきや。追儺より四方拝に続くこそ面白けれ。晦日の夜、いたう闇きに、松どもともして、夜半過ぐるまで、人の、門叩き、走りありきて、何事にかあらん、ことことしくのゝしりて、足を空に惑ふが、暁がたより、さすがに音なくなりぬるこそ、年の名残も心ぼそけれ。亡き人のくる夜とて魂祭るわざは、このごろ都にはなきを、東のかたには、なほする事にてありしこそ、あはれなりしか。

かくて明けゆく空のけしき、昨日に変りたりとは見えねど、ひきかへめづらしき心地ぞする。大路のさま、松立てわたして、はなやかにうれしげなるこそ、またあはれなれ。

`;

baseKeymap["Mod-z"] = undo;
baseKeymap["Mod-y"] = redo;

console.log("keymaps", Object.keys(baseKeymap));

export const PMEditorReact: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);

  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const [markdown, setMarkdown] = useState<string>("");

  useEffect(() => {
    const editorView = new EditorView(editorRef.current!, {
      state: EditorState.create({
        doc: defaultMarkdownParser.parse(initialContent),
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
  }, [editorRef]);

  return (
    <div className="flex flex-row-reverse">
      <PMMenuBar editorView={editorView!} />
      <div
        ref={editorRef}
        className="prose w-full max-w-none flex-1 overflow-x-scroll"
        style={{
          writingMode: "vertical-rl",
        }}
      />
    </div>
  );
};
