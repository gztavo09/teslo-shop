import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import FacebookProvider from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { dbUsers } from "@/database"

export const authOptions: any = {
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: {
          label: 'Correo', type: 'email', placeholder: 'correo@teslo.com'
        },
        password: {
          label: 'Contraseña', type: 'password', placeholder: 'Contraseña'
        }
      },
      async authorize(credentials): Promise<any | null> {
        console.log('Credentials:', JSON.stringify(credentials))
        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password)
      }
    }),
    // ...add more providers here
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || ''
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET  || ''
    }),
  ],
  // Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },
  session: {
    maxAge: 2592000, /// 30 días
    strategy: 'jwt',
    updateAge: 86400 // cada día
  },
  //Callbacks
  callbacks: {
    async jwt({ token, account, user }: any) {
      if(account) {
        token.accessToken = account.access_token
        
        switch(account.type) {
          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser(user?.email || '', user.name || '')
          break;
          case 'credentials':
            token.user = user
          break;
        }
      }
      
      return token;
    },
    async session({ session, token, user }: any) {

    session.accessToken = token.accessToken
    session.user = token.user as any;
      
      return session
    } 
  }
}

export default NextAuth(authOptions)