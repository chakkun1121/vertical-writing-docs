"use client";
import Editor from "@/components/functional/editor";

import { writeFile } from "@/lib/fileSystem/writeFile";
import { useFormGuard } from "@/lib/useFormGuard";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import FileDialog from "./fileDialog";

export default function Page({
  searchParams: { id, location },
}: {
  searchParams: { id?: string; location?: string };
}) {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [handle, setHandle] = useState<FileSystemFileHandle | undefined>();
  const [saved, setSaved] = useState(false);
  useFormGuard(!saved);
  useEffect(() => {
    (async () => {
      setSaved(false);
      if (handle) {
        await writeFile(handle, markdown!);
        setSaved(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markdown]);
  async function save() {
    const fileHandle =
      handle ||
      (await window.showSaveFilePicker({
        types: [
          {
            description: "Text Files",
            accept: {
              "text/plain": [".txt", ".text"],
            },
          },
          {
            description: "Markdown Files",
            accept: {
              "text/markdown": [".md", ".markdown", ".mdx"],
            },
          },
        ],
      }));
    setHandle(fileHandle);
    console.log(handle);
    await writeFile(fileHandle, markdown!);
    setSaved(true);
    return true;
  }
  useHotkeys("ctrl+s", save, {
    preventDefault: true,
    enableOnContentEditable: true,
  });

  return (
    <>
      <FileDialog markdown={markdown} setMarkdown={setMarkdown} setHandle={setHandle} />
      <Editor markdown={markdown} setMarkdown={setMarkdown} handle={handle} />
    </>
  );
}
