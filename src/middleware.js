import { NextResponse } from "next/server";

export default function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("adminToken")?.value;

  // console.log("pathname:", pathname);
  // console.log("token:", token);

  const publicRoutes = [
    "/",
    "/Forgot-Password",
    "/Otp-Verification",
    "/set-new-password",
  ];

  if (!token) {
    if (!publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // If token exists → allow everything under /admin/*
  if (token) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.next(); // ✅ allow /admin and its children
    }
    // If logged in but trying to access "/" → redirect to /admin
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next(); // ✅ allow other pages if needed
  }

  // If NO token → allow only "/" (login page)
  if (!token) {
    if (pathname !== "/" || !publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
