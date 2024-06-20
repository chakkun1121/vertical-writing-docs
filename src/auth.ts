import NextAuth from "next-auth";
import "next-auth/jwt";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name;
      return token;
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
});
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
