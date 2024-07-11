import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

export default function FileDialog({
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

    await handle.createWritable();
    const file = await handle.getFile();
    const contents = await file.text();
    // 内容を出力
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
