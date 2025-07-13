import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcrypt";
import { getUser } from "./app/lib/dbget";

const AuthFormSchemaZ = z.object({
  email: z.string(),
  password: z.string().min(6),
});

// Credentials-PropObject explicit from Github Copilot
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        const parsedCredentials =
          // z.object({ email: z.string().email(), password: z.string().min(6) })
          AuthFormSchemaZ.safeParse(credentials);
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          // console.log("auth.user: ", user);
          console.log("User is beeing fetched!");
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        } else {
          console.log("Invalid credentials");
          return null;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs in your application.
      if (url.startsWith(baseUrl)) return url;
      // Allows callback URLs on the same origin.
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
  },
});
