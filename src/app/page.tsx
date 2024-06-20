import { auth } from "@/auth";

import Header from "@/components/element/home/header";
export default async function Home() {
  const session = await auth();
  console.log(session);
  return (
    <>
      <Header />
      <main></main>
    </>
  );
}
