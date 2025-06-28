"use client";

import SignInForm from "@/components/auth/SignInForm";
import { useEffect } from "react";
import { showTokenExpiredToast } from "@/lib/toast-expired";
import Cookies from "js-cookie";
import { decodeJWT } from "@/lib/jwt";

export default function SignInClient() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const token = Cookies.get("TOKEN");
      if (params.get("expired") === "1") {
        Cookies.remove("TOKEN");
        showTokenExpiredToast();
        params.delete("expired");
        const url =
          window.location.pathname + (params.toString() ? `?${params}` : "");
        window.history.replaceState({}, "", url);
      } else if (token) {
        // Nếu có token, kiểm tra hợp lệ (exp chưa hết hạn)
        const payload = decodeJWT(token);
        if (payload && (!payload.exp || Date.now() / 1000 < payload.exp)) {
          window.location.href = "/";
        } else {
          Cookies.remove("TOKEN");
        }
      } else {
        // Nếu không có token, show toast vui lòng đăng nhập
        import("sonner").then(({ toast }) => {
          toast.info("Vui lòng đăng nhập để tiếp tục!", {
            position: "top-center",
            duration: 4000,
          });
        });
      }
    }
  }, []);
  return <SignInForm />;
}
