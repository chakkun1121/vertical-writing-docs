import { auth } from "@/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export default async function Editor({
  params: { documentId },
}: {
  params: { documentId: string };
}) {
  if (!documentId) redirect("/editor/new");
  const session = await auth();
  const result = await fetch(
    `https://docs.googleapis.com/v1/documents/${documentId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + session?.accessToken,
        "x-goog-api-key": process.env.GOOGLE_API_KEY || "",
      },
    }
  );
  const json = await result.json();
  console.log(json);

  return <main></main>;
}

export async function generateMetadata({
  params: { documentId },
}: {
  params: { documentId: string };
}): Promise<Metadata> {
  const session = await auth();
  const result = await fetch(
    `https://docs.googleapis.com/v1/documents/${documentId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + session?.accessToken,
        "x-goog-api-key": process.env.GOOGLE_API_KEY || "",
      },
    }
  );
  const json = await result.json();
  return {
    title: json.title,
  };
}
