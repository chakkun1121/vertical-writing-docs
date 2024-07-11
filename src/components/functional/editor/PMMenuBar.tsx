import React from "react";

import { Button } from "@/components/ui/button";
import "prosemirror-view/style/prosemirror.css";
// @ts-ignore
import { Command, setBlockType, toggleMark, wrapIn } from "prosemirror-commands";
import { schema } from "prosemirror-markdown";
import { EditorView } from "prosemirror-view";

type IPMMenuPair = [Command, string];

const toggleStrong: IPMMenuPair = [toggleMark(schema.marks.strong), "B"];
const toggleEmphasis: IPMMenuPair = [toggleMark(schema.marks.em), "I"];
const toggleParagraph: IPMMenuPair = [setBlockType(schema.nodes.paragraph), "P"];
const toggleQuote: IPMMenuPair = [wrapIn(schema.nodes.blockquote), "❞"];
const toggleHeadingLevel = (level: number) => setBlockType(schema.nodes.heading, { level });
const toggleHeadingOne: IPMMenuPair = [toggleHeadingLevel(1), "H1"];
const toggleHeadingTwo: IPMMenuPair = [toggleHeadingLevel(2), "H2"];
const toggleHeadingThree: IPMMenuPair = [toggleHeadingLevel(3), "H3"];

const menuItemsData = [
  toggleStrong,
  toggleEmphasis,
  toggleParagraph,
  toggleQuote,
  toggleHeadingOne,
  toggleHeadingTwo,
  toggleHeadingThree,
];

export const PMMenuBar: React.FC<{ editorView: EditorView }> = ({ editorView }) => {
  return (
    <div className="flex-none select-none space-y-4">
      {menuItemsData.map(([toggle, buttonText], index) => (
        <Button
          className="block w-full"
          key={index}
          onClick={() => {
            toggle(editorView.state, editorView.dispatch);
            editorView.focus();
          }}
        >
          {buttonText}
        </Button>
      ))}
    </div>
  );
};
