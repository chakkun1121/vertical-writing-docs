import { auth } from "@/auth";
import Header from "@/components/element/home/header";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();
  // const documents = await fetch(
  //   "https://www.googleapis.com/drive/v3/files?trashed=false",
  //   {
  //     method: "GET",
  //     headers: {
  //       Accept: "application/json",
  //       Authorization: "Bearer " + session?.accessToken,
  //       "x-goog-api-key": process.env.GOOGLE_API_KEY || "",
  //     },
  //   }
  // );
  // console.log(documents);
  return (
    <>
      <Header />
      <main>
        <div>
          <form
            action={async () => {
              "use server";
              const result = await fetch(
                "https://docs.googleapis.com/v1/documents",
                {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + session?.accessToken,
                    "x-goog-api-key": process.env.GOOGLE_API_KEY || "",
                  },
                  body: JSON.stringify({
                    title: "New Document",
                  }),
                }
              );
              console.log(result);
              const json = await result.json();
              return json;
            }}
          >
            <Button type="submit">作成</Button>
          </form>
        </div>
      </main>
    </>
  );
}
