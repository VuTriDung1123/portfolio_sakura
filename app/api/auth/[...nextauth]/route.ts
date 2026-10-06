import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export const authOptions = {
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const admin = await prisma.admin.findUnique({
          where: { username: credentials.username }
        });

        if (!admin) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(credentials.password, admin.password);

        if (!passwordMatch) {
          return null;
        }

        return { id: admin.id, name: admin.username };
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "sakura_super_secret_key_2026",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
