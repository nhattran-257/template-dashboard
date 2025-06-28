// src/lib/toast-expired.ts
// Gọi hàm này ở trang /signin nếu detect redirect do token hết hạn
import { toast } from "sonner";

export function showTokenExpiredToast() {
  toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!", {
    duration: 4000,
    position: "top-center",
  });
}
