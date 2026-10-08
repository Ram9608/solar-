import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const path = req.nextUrl.pathname
      if (
        path.startsWith("/login") ||
        path.startsWith("/register") ||
        path.startsWith("/signup") ||
        path.startsWith("/forgot-password")
      ) {
        return true
      }
      return !!token
    },
  },
})

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login|register|signup|forgot-password).*)",
  ],
}
