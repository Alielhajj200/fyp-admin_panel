import NextAuth from "next-auth";
import { authOptions,authOptionsCredentials} from "@/lib/authoptions"



export const handler = NextAuth(authOptions);
export {handler as GET,handler as POST}