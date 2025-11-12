import { ResetPasswordForm } from "@/components/reset-password-form";
import { useState } from "react";
import { useNavigate } from "react-router";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import type { ResetPasswordFormValues } from "@/validation/authSchema";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: ResetPasswordFormValues) => {
    const email = localStorage.getItem("resetEmail") || "";
    if (!email) {
      toast.error("Không tìm thấy email. Vui lòng thử lại từ đầu.");
      navigate("/forgot-password");
      return;
    }

    try {
      setIsLoading(true);
      await authService.resetPassword(email, data.newPassword);

      toast.success("Đặt lại mật khẩu thành công!");

      // Xóa email khỏi localStorage
      localStorage.removeItem("resetEmail");

      // Chuyển về trang đăng nhập
      navigate("/signin");
    } catch (error: any) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-gradient-purple">
      <div className="w-full max-w-sm md:max-w-3xl">
        <ResetPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
