import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
 
const PUBLIC_PATH_PREFIXES = [
  "/api/auth",
  "/api/products",
];

export async function middleware(request: NextRequest) {
    // const session = await auth.api.getSession({
    //     headers: await headers()
    // })
 
    // if(!session) {
    //     return NextResponse.redirect(new URL("/signin", request.url));
    // }
 
    return NextResponse.next();
}
 
export const config = {
  runtime: "nodejs",

  // Apply middleware to specific routes
  matcher: PUBLIC_PATH_PREFIXES, 
};