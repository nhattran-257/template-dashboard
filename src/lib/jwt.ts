// src/lib/jwt.ts
// Tiện ích decode và verify JWT cho Next.js (client + server)
import jwt, { JwtPayload } from "jsonwebtoken";

// Chỉ decode, không verify (dùng cho client)
export function decodeJWT(token: string): JwtPayload | null {
    try {
        return jwt.decode(token) as JwtPayload;
    } catch {
        return null;
    }
}

// Verify token (dùng cho server, cần secret)
export function verifyJWT(token: string, secret: string): JwtPayload | null {
    try {
        return jwt.verify(token, secret) as JwtPayload;
    } catch {
        return null;
    }
}

// Lấy user info từ cookie (Next.js server)
export function getUserFromRequest(req: any, secret?: string) {
    const cookie =
        req.cookies?.TOKEN ||
        req.headers?.cookie
            ?.split("; ")
            .find((c: string) => c.startsWith("TOKEN="));
    const token = cookie ? cookie.TOKEN || cookie.split("=")[1] : null;
    if (!token) return null;
    if (secret) return verifyJWT(token, secret);
    return decodeJWT(token);
}
