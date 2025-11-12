import { OTPForm } from "@/components/otp-form";

export default function VerifyOtpResetPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-gradient-purple">
      <div className="w-full max-w-sm md:max-w-3xl">
        <OTPForm mode="reset" />
      </div>
    </div>
  );
}
