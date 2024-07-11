"use client";
import Editor from "@/components/functional/editor";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { writeFile } from "@/lib/fileSystem/writeFile";
import { useFormGuard } from "@/lib/useFormGuard";
import markdownToTxt from "markdown-to-text";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import FileDialog from "./fileDialog";

export default function Page() {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [handle, setHandle] = useState<FileSystemFileHandle | undefined>();
  const [saved, setSaved] = useState(false);
  const [fileDialogOpen, setFileDialogOpen] = useState(!markdown);
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
      <header className="flex flex-none select-none justify-between">
        <Menubar className="border-0">
          <MenubarMenu>
            <MenubarTrigger>ファイル</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => setFileDialogOpen(true)}>
                ファイルを開く <MenubarShortcut>Ctrl+O</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={save}>
                保存 <MenubarShortcut>Ctrl+S</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>印刷</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>ツール</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                設定 <MenubarShortcut>Ctrl+,</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <div>
          <p className="px-4">
            <span className="text-bold px-1">
              {markdownToTxt(markdown!).replace(/\n/g, "")?.length}
            </span>
            文字
          </p>
        </div>
      </header>
      <FileDialog
        setMarkdown={setMarkdown}
        setHandle={setHandle}
        open={fileDialogOpen}
        setOpen={setFileDialogOpen}
      />
      <Editor markdown={markdown} setMarkdown={setMarkdown} handle={handle} />
    </>
  );
}
