import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import type { NextAuthOptions, Session } from "next-auth";

interface CustomSession extends Session {
  accessToken?: string;
}

export const authOptions: NextAuthOptions = {
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
        console.log(user);
        token.accessToken = jwt.sign({ id: user?.id, name: user?.name, email: user?.email }, process.env.JWT_KEY!);
        console.log(token.accessToken);
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
