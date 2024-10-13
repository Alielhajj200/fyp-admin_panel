import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
  
  },
  {
    pages:{
        signIn:"/login"
    }
  },
)
export const config = { matcher: [] }
