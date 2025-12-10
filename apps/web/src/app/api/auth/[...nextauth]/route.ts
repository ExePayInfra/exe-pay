import NextAuth, { NextAuthOptions } from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || '',
      clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
      version: '2.0', // Use OAuth 2.0
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and Twitter user ID
      if (account) {
        token.accessToken = account.access_token;
        token.twitterId = profile?.id || account.providerAccountId;
        token.username = profile?.username;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      session.twitterId = token.twitterId as string;
      session.username = token.username as string;
      return session;
    },
  },
  pages: {
    signIn: '/wallet', // Redirect to wallet page for sign in
    error: '/wallet', // Error page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

