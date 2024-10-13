import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
interface Credentials {
    email: string;
    password: string;
  }
  
export const authOptions = {
    providers:[
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? ""
        }),
        
    ]
}


export const authOptionsCredentials:AuthOptions = {
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. "Sign in with...")
          name: "Credentials",
          // `credentials` is used to generate a form on the sign in page.
          // You can specify which fields should be submitted, by adding keys to the `credentials` object.
          // e.g. domain, email, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            email: { label: "email", type: "text", placeholder: "Enter your name" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {
            // Add logic here to look up the user from the credentials supplied
            const user = { id: "1",  email: "jsmith@example.com" }
      
            if (credentials?.email  === "test@email.com" && credentials?.password === "test123456") {

              // Any object returned will be saved in `user` property of the JWT
              console.log(user)
              return user
            } else {
              // If you return null then an error will be displayed advising the user to check their details.
              console.log("not userrrr")
              return null
            
              // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
            }
          }
        })
      ],
      pages:{
        signIn: "/login",
      }
}