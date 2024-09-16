import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import loginService from '@/app/services/login';
import { deriveKeyFromPassword } from '@/app/libs/crypto/deriveKeyFromPassword';
import { arrayBufferToHexist, hexistsToArrayBuffer } from '@/app/libs/crypto/util';
import { decryptEcdhPrivateKey } from '@/app/libs/crypto/ecdh';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // check if user details are passed
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Please enter your credentials');
        }

        const data = await loginService(credentials.username, credentials.password);
        const key = await deriveKeyFromPassword(
          credentials.password, 32, new Uint8Array(hexistsToArrayBuffer(data.data.user.dkf_salt)),
        );
        const decryptedPrivateKey = await decryptEcdhPrivateKey(
          key.aesKey,
          new Uint8Array(hexistsToArrayBuffer(data.data.user.iv_private_key)),
        hexistsToArrayBuffer(data.data.user.private_key),
      );

        return {
          ...data.data.user,
          private_key: arrayBufferToHexist(decryptedPrivateKey),
          token: data.data.token,
        };
      },
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        const userAny = user as any;
        token.user_id = userAny.id;
        token.username = userAny.username;
        token.fullname = userAny.fullname;
        token.backend_token = userAny.token;
        token.ecdh_private_key = userAny.private_key;
        token.ecdh_public_key = userAny.public_key;
      }

      return token
    },
    async session({ session, token, user }) {
      const exposedData = ['user_id', 'username', 'fullname', 'backend_token', 'ecdh_private_key', 'ecdh_public_key'];
      exposedData.forEach(key => {
        (session as any)[key] = token[key];
      })

      session.user!.name = token.username as string;

      return session
    }
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
