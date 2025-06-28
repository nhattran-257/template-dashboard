/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
// import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { postEduV1AuthUserToken } from "@/api/user";
// Lưu JWT vào cookie
import Cookies from "js-cookie";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    // Nếu là tài khoản mặc định admin/123456 thì tạo token giả và pass qua luôn
    if (email === "admin" && password === "123456") {
      // Tạo token giả (exp 7 ngày, name/email)
      const payload = {
        name: "Admin",
        email: "admin@demo.com",
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      };
      // Encode base64url (không cần ký)
      const base64url = (obj: any) =>
        btoa(JSON.stringify(obj))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
      const header = { alg: "HS256", typ: "JWT" };
      const token = `${base64url(header)}.${base64url(payload)}.fake-signature`;
      Cookies.set("TOKEN", token, { expires: 7, secure: true });
      window.location.href = "/";
      setLoading(false);
      return;
    }

    try {
      const res: any = await postEduV1AuthUserToken({
        body: {
          username: email,
          password: password,
        },
      });
      // Lưu JWT vào cookie tên TOKEN nếu có
      if (res.data?.success) {
        const token = res?.data?.data?.token;
        Cookies.set("TOKEN", token, { expires: 7, secure: true });
        window.location.href = "/";
      } else {
        setError(res?.data?.message || "Có gì đó không ổn!");
      }
    } catch (err: any) {
      setError(err?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      {/* Đã xóa nút Back to dashboard trên form login */}
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSignIn}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"></div>
                  <Link
                    href="/reset-password"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400 text-sm"
                  >
                    Forgot password?
                  </Link>
                </div>
                {error && <div className="text-sm text-red-500">{error}</div>}
                <div>
                  <Button
                    className="w-full"
                    size="sm"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
