import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions, Session } from "next-auth";
import { signJWT } from "@/lib/auth";

interface CustomSession extends Session {
  accessToken?: string;
}

export const options: NextAuthOptions = {
  secret: process.env.SECRET_KEY!,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      //persist token right after signin
      if (account) {
        token.accessToken = await signJWT({ id: user?.id, name: user?.name, email: user?.email }, process.env.JWT_KEY!, { expiresIn: "1d" });
      }
      return token;
    },
    async session({ session, token }: { session: CustomSession; token: any }) {
      session.accessToken = token.accessToken;

      return session;
    },
  },
  // pages: {
  //   signIn: "/signin",
  //   signOut: "/signout",
  // },
};
