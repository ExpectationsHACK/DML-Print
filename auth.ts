import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { usersCollection, isDbConfigured } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = String(credentials?.email ?? "").toLowerCase().trim();
        const password = String(credentials?.password ?? "");
        if (!email || !password || !isDbConfigured()) return null;

        // Any DB error here (unreachable, timed out, etc.) should deny the
        // sign-in rather than crash the page — the caller falls back to a
        // generic "invalid credentials" message either way.
        try {
          const users = await usersCollection();
          const user = await users.findOne({ email });
          if (!user) return null;

          const valid = await bcrypt.compare(password, user.passwordHash);
          if (!valid) return null;

          return { id: user._id, email: user.email, name: user.fullName, role: user.role };
        } catch (error) {
          console.error("Credentials authorize() failed:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as "customer" | "admin";
      }
      return session;
    },
  },
});
