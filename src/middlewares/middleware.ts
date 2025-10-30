// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const PUBLIC_FILE = /\.(.*)$/;
// const SUPPORTED_LOCALES = ["en", "vi"];
// const DEFAULT_LOCALE = "en";

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Ignore static files and API
//   if (
//     pathname.startsWith("/api") ||
//     PUBLIC_FILE.test(pathname) ||
//     pathname.includes("/favicon.ico")
//   ) {
//     return;
//   }

//   const pathnameIsMissingLocale = SUPPORTED_LOCALES.every(
//     (locale) => !pathname.startsWith(`/${locale}/`)
//   );

//   if (pathnameIsMissingLocale) {
//     const url = req.nextUrl.clone();
//     url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
//     return NextResponse.redirect(url);
//   }
// }

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// const PUBLIC_FILE = /\.(.*)$/;

// export function middleware(req: NextRequest) {
//   const pathname = req.nextUrl.pathname;

//   // Bỏ qua các file tĩnh, API, _next, favicon, v.v.
//   if (
//     pathname.startsWith('/api') ||
//     pathname.startsWith('/_next') ||
//     pathname.includes('/favicon.ico') ||
//     PUBLIC_FILE.test(pathname)
//   ) {
//     return NextResponse.next();
//   }

//   // Nếu chưa có locale trong URL
//   if (!/^\/(en|vi|fr|ru)(\/|$)/.test(pathname)) {
//     const locale = 'en'; // default locale
//     const url = req.nextUrl.clone();
//     url.pathname = `/${locale}${pathname}`;
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!_next|api|static|favicon.ico).*)'],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  // Nếu chưa có token => redirect login
  if (!token && pathname.startsWith("/distributor")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Nếu đã có token mà vào /login => redirect dashboard
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/distributor/manager_drug", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/distributor/:path*", "/login"],
};
