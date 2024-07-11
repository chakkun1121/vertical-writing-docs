"use client";
import Editor from "@/components/functional/editor";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page({
  searchParams: { id, location },
}: {
  searchParams: { id?: string; location?: string };
}) {
  // const { content, handle } = fetchData(location, id).read();
  // console.log(content, handle);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [handle, setHandle] = useState<FileSystemFileHandle | undefined>();
  useEffect(() => {
    (async () => {
      if (handle) {
        console.log("save");
        await writeFile(handle, markdown!);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markdown]);
  return (
    <>
      <FileDialog markdown={markdown} setMarkdown={setMarkdown} setHandle={setHandle} />
      <Editor markdown={markdown} setMarkdown={setMarkdown} handle={handle} />
    </>
  );
}
function FileDialog({
  markdown,
  setMarkdown,
  setHandle,
}: {
  markdown: string | null;
  setMarkdown: React.Dispatch<React.SetStateAction<string | null>>;
  setHandle: React.Dispatch<React.SetStateAction<FileSystemFileHandle | undefined>>;
}) {
  const [open, setOpen] = useState(!markdown);
  async function openFile() {
    if (typeof window.showOpenFilePicker == "undefined") {
      toast("このブラウザは対応していません");
      return;
    }
    const [handle] = await window.showOpenFilePicker({
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
      excludeAcceptAllOption: true,
      multiple: false,
    });
    console.log(handle);
    await handle.createWritable();
    const file = await handle.getFile();
    const contents = await file.text();
    console.log(contents); // 内容を出力
    setMarkdown(contents);
    setHandle(handle);
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ファイルを開く</DialogTitle>
        </DialogHeader>
        <div className="space-x-4">
          <Button onClick={openFile}>ローカルから開く</Button>
          <Button disabled title="制作中です">
            Google Driveから開く
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
const wrapPromise = (promise: Promise<any>) => {
  let status = "pending";
  let result: any;

  const suspender = promise.then(
    (r: any) => {
      status = "fulfilled";
      result = r;
    },
    (e: any) => {
      status = "rejected";
      result = e;
    }
  );

  const read = () => {
    if (status === "pending") {
      throw suspender;
    } else if (status === "rejected") {
      throw result;
    } else {
      return result;
    }
  };

  return { read };
};
async function writeFile(fileHandle: FileSystemFileHandle, contents: string) {
  const writable = await fileHandle.createWritable();
  await writable.write(contents);
  await writable.close();
}
