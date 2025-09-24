// middleware.ts
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

// next-intl middleware konfiqurasiya
const intlMiddleware = createMiddleware({
  locales: ["en", "az", "ru"],
  defaultLocale: "en",
  localePrefix: "always",
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // URL-in birinci segmentini yoxla
  const locale = pathname.split('/')[1];

  // Əgər locale mövcud deyilsə və kök URL-dir ("/"), defaultLocale-a yönləndir
  if (!["en", "az", "ru"].includes(locale)) {
    const defaultLocaleUrl = new URL(`/en${pathname}`, request.url);
    return NextResponse.redirect(defaultLocaleUrl);
  }

  // Əks halda next-intl middleware davam etsin
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)", "/"],
};
