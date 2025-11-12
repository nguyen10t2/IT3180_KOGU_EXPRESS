import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useNavigate } from "react-router"
import { useState } from "react"
import otpService from "@/services/otpService"
import { authService } from "@/services/authService"
import { toast } from "sonner"

type OTPFormProps = React.ComponentProps<"div"> & {
  mode?: "signup" | "reset" // Chế độ: đăng ký hoặc reset password
}

export function OTPForm({ className, mode = "signup", ...props }: OTPFormProps) {
  const navigate = useNavigate()
  const [ otp, setOtp ] = useState("")
  const [ loading, setLoading ] = useState(false)
  const [ error, setError ] = useState("")
  
  // Lấy email và key tương ứng với mode
  const emailKey = mode === "signup" ? "signupEmail" : "resetEmail"
  const errorMessage = mode === "signup" 
    ? "Không tìm thấy email đăng ký. Vui lòng quay lại trang đăng ký."
    : "Không tìm thấy email. Vui lòng quay lại trang quên mật khẩu."
  const successRoute = mode === "signup" ? "/signin" : "/reset-password"
  
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Lấy email từ localStorage
    const email = localStorage.getItem(emailKey) || ""
    if (!email) {
      setError(errorMessage)
      setLoading(false)
      return
    }

    // Validate OTP
    if (!otp || otp.length !== 6) {
      setError("Vui lòng nhập đầy đủ mã 6 chữ số")
      setLoading(false)
      return
    }

    try {
      // Gọi service tương ứng với mode
      const resp = mode === "signup" 
        ? await otpService.verifyOtp({ email, otp })
        : await authService.verifyOtpForReset(email, otp)
      
      toast.success(resp.message || 'Xác thực thành công')
      
      // Chỉ xóa email khi signup thành công
      if (mode === "signup") {
        localStorage.removeItem(emailKey)
      }
      
      console.log(`About to navigate to ${successRoute}`)
      navigate(successRoute)
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Xác thực không thành công'
      setError(errMsg)
      toast.error(errMsg)
      setLoading(false)
    }
  }
  
  const onResend = async (e: React.MouseEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const email = localStorage.getItem(emailKey) || ""
    if (!email) {
      setError(errorMessage)
      setLoading(false)
      return
    }

    try {
      // Gọi service tương ứng với mode
      const resp = mode === "signup"
        ? await otpService.resendOtp({ email })
        : await authService.forgetPassword(email)
      
      toast.success(resp.message || 'Mã OTP đã được gửi lại')
    } catch (err: any) {
      console.error('Resend OTP error', err)
      
      // Xử lý rate limit (429)
      if (err?.response?.status === 429) {
        const retryAfter = err?.response?.data?.retry_after
        const msg = retryAfter 
          ? `Vui lòng đợi ${retryAfter} giây trước khi gửi lại OTP`
          : err?.response?.data?.error || 'Bạn đang gửi yêu cầu quá nhanh. Vui lòng đợi một chút.'
        toast.error(msg)
        return
      }
      const msg = err?.response?.data?.error || err?.message || 'Lỗi khi gửi lại mã OTP'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={cn("flex flex-col gap-6 md:min-h-[450px]", className)}
      {...props}
    >
      <Card className="flex-1 overflow-hidden p-0">
        <CardContent className="grid flex-1 p-0 md:grid-cols-2">
          <form className="flex flex-col items-center justify-center p-6 md:p-8" onSubmit={onSubmit}>
            <FieldGroup>
              <Field className="items-center text-center">
                <h1 className="text-3xl font-bold">Nhập mã xác thực</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Chúng tôi đã gửi mã 6 chữ số đến email của bạn
                </p>
              </Field>
              <Field>
                <FieldLabel htmlFor="otp" className="sr-only">
                  Verification code
                </FieldLabel>
                <InputOTP
                  maxLength={6}
                  id="otp"
                  name="otp"
                  required
                  containerClassName="gap-4"
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <FieldDescription className="text-center">
                  Nhập mã gồm 6 chữ số
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>Xác nhận</Button>
                <FieldDescription className="text-center">
                  Không nhận được mã? <a href="#" onClick={onResend}>Gửi lại</a>
                </FieldDescription>
                {error && (
                  <p className="text-destructive text-sm text-center mt-2">{error}</p>
                )}
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/otp.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="text-center">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a>{" "}
        và <a href="#">Chính sách bảo mật</a>.
      </FieldDescription>
    </div>
  )
}
