import User from "@/model/User";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import dbConnect from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
  providers: [
    // Existing credentials provider
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          await dbConnect();
          const user = await User.findOne({ email: credentials.identifier });

          if (!user) {
            throw new Error("Invalid credentials");
          }

          if (!user.password) {
            throw new Error("User does not have a password set");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user._id.toString(),
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (err: any) {
          console.error("Authorization error:", err);
          throw new Error("Unable to log in");
        }
      },
    }),

    // Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // GitHub OAuth provider
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          await dbConnect();

          // Check if user already exists
          let existingUser = await User.findOne({ email: user.email });

          if (existingUser) {
            // User exists, update their info if needed
            existingUser.name = user.name || existingUser.name;
            existingUser.provider = existingUser.provider || account.provider;
            existingUser.providerId =
              existingUser.providerId || account.providerAccountId;
            await existingUser.save();
          } else {
            // NEW USER: Create with default role (student)
            // The role will be updated through the redirect callback if needed
            await User.create({
              name: user.name,
              email: user.email,
              role: "student",
              provider: account.provider,
              providerId: account.providerAccountId,
              forgotPassCode: null,
              forgotPassCodeExpiry: null,
            });
          }
          return true;
        } catch (error) {
          console.error("Error saving OAuth user:", error);
          return false;
        }
      }

      return true;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // Safely check if URL is same origin without crashing
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === baseUrl) return url;
      } catch (error) {
        // Invalid URL, just return baseUrl/dashboard as fallback
        console.log("Invalid URL in redirect:", url);
      }

      return `${baseUrl}/dashboard`; // Safe fallback
    },

    async jwt({ user, token, account }) {
      if (user) {
        // For OAuth users, get user data from database
        if (account?.provider === "google" || account?.provider === "github") {
          await dbConnect();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token._id = dbUser._id.toString();
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.role = dbUser.role;
          }
        } else {
          // For credentials users
          token._id = user.id || (user as any)._id;
          token.name = user.name;
          token.email = user.email;
          token.role = user.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          _id: token._id as string,
          name: token.name as string,
          email: token.email as string,
          role: token.role as string,
        };
      }

      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};
