"use client";

import { Button } from "@/components/ui/button";
import localforage from "localforage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { v4 as createUUID } from "uuid";
export default function Page() {
  const router = useRouter();
  async function OpenFile() {
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
    const file = await handle.getFile();
    const contents = await file.text();
    console.log(contents); // 内容を出力
    const id = createUUID();
    await localforage.setItem(id, handle);
    router.push(`/edit?id=${id}&location=local`);
  }
  return (
    <main>
      <Button onClick={OpenFile}>ファイルを開く</Button>
    </main>
  );
}
