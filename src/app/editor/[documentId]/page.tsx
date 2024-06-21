import { auth } from "@/auth";
import { googleDocsToMarkdown } from "docs-markdown";
import { marked } from "marked";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export default async function EditorPage({
  params: { documentId },
}: {
  params: { documentId: string };
}) {
  if (!documentId) redirect("/editor/new");
  const session = await auth();
  const result = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + session?.accessToken,
      "x-goog-api-key": process.env.GOOGLE_API_KEY || "",
    },
  });
  const json = await result.json();
  console.log(json);
  const markdown = googleDocsToMarkdown(json);
  const html = marked.parse(markdown.replace(/^---[\s\S]*?---/, ""));
  return (
    <>
      <header className="flex-none"></header>
      <main className="h-full flex-1">
        <article
          className="prose h-full w-full max-w-full overflow-x-scroll overscroll-x-none p-4"
          style={{
            writingMode: "vertical-rl",
          }}
          contentEditable
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
    </>
  );
}

export async function generateMetadata({
  params: { documentId },
}: {
  params: { documentId: string };
}): Promise<Metadata> {
  const session = await auth();
  const result = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + session?.accessToken,
      "x-goog-api-key": process.env.GOOGLE_API_KEY || "",
    },
  });
  const json = await result.json();
  return {
    title: json.title,
  };
}
