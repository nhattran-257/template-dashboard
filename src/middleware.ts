// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { decodeJWT } from "./lib/jwt";

export function middleware(req: NextRequest) {
    // Bỏ qua kiểm tra cho trang /login
    if (req.nextUrl.pathname.startsWith("/login")) {
        return NextResponse.next();
    }
    // Kiểm tra token cho mọi trang khác
    const token = req.cookies.get("TOKEN")?.value;
    if (!token) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }
    const payload = decodeJWT(token);
    if (!payload || (payload.exp && Date.now() / 1000 > payload.exp)) {
        // Thêm query expired=1 để trang signin biết show toast
        const url = new URL("/signin", req.url);
        url.searchParams.set("expired", "1");
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}

// Áp dụng middleware cho mọi route (trừ static, _next, ...)
export const config = {
    matcher: [
        // Bỏ qua static files, _next, favicon, ...
        "/((?!_next|favicon.ico|logo|images|api/public|signin).*)",
    ],
};
// Hoặc nếu muốn áp dụng cho một số route cụ thể
