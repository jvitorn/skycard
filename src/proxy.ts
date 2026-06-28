import createMiddleware from "next-intl/middleware";

import { routing } from "@/lib/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/(en|pt-BR|es)/:path*",
    "/((?!api|_next|_vercel|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|ico|css|js|webmanifest)$).*)",
  ],
};
