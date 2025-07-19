import { NextRequest, NextResponse } from "next/server";
// import { headers } from "next/headers";
// import { auth } from "@/lib/auth";

const PUBLIC_PATH_PREFIXES = [
  "/api/auth",
  "/api/products",
];

export async function middleware(request: NextRequest) {

  try {
    // const session = await auth.api.getSession({
    //   headers: await headers()
    // })
    //
    // if (!session) {
    //   return NextResponse.redirect(new URL("/signin", request.url));
    // }

    return NextResponse.next();

  } catch (_error) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  runtime: "nodejs",
  matcher: PUBLIC_PATH_PREFIXES,
};
