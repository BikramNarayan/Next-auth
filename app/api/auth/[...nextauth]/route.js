import User from "@/models/userModel";
import nextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { ConnectDB } from "../../../../utils/connect";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
async function login(credentials) {
  console.log("login func", credentials);
  try {
    await ConnectDB();
    const user = await User.findOne({ email: credentials.email });
    if (!user) {
      throw new Error("Wrong Credentials");
    }
    const isCorrect = await bcrypt.compare(credentials.password, user.password);
    if (!isCorrect) {
      throw new Error("Wrong Credentials");
    }
    return user;
  } catch (error) {
    console.log("Error while logging in:", error.message);
    throw new Error("Failed to Login");
  }
}
export const authOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {
        try {
          console.log("he entered", credentials);
          const user = await login(credentials);
          return user;
        } catch (error) {
          console.log("got error white ");
          console.log(error);
          return null;
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.email = user.email;
      }
      console.log("here->", token);
      return token;
    },
    async session(session, token) {
      if (token) {
        session.id = token.id;
        session.email = token.email;
      }
      return session;
    },
  },
};
const handler = nextAuth(authOptions);
export { handler as GET, handler as POST };
