import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { useState } from "react";
import { useNavigate } from "react-router";
import { authService } from "@/services/authService";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (email: string) => {
    try {
      setIsLoading(true);
      await authService.forgetPassword(email);

      // Lưu email để dùng cho các bước tiếp theo
      localStorage.setItem("resetEmail", email);

      toast.success("Đã gửi mã OTP đến email của bạn!");
      navigate("/verify-otp-reset");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-gradient-purple">
      <div className="w-full max-w-sm md:max-w-3xl">
        <ForgotPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
