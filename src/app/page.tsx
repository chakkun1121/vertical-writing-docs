import { auth } from "@/auth";
import { SignIn } from "@/components/functional/sign-in";

export default async function Home() {
  const session = await auth();
  console.log(session);
  return (
    <main className="min-h-screen">
      <SignIn />
    </main>
  );
}
