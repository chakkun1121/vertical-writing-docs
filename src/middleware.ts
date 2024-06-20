import { auth } from "@/auth";

const PUBLIC_PAGES = ["", "/", "/login"];
export default auth(req => {
  if (
    !req.auth &&
    !PUBLIC_PAGES.some(page => page === new URL(req.url).pathname)
  ) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
