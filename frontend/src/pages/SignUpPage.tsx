import { SignupForm } from "@/components/auth/signup-form";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import type { SignUpFormValues } from "@/validation/authSchema";

const SignUpPage = () => {
  const { signUp } = useAuthStore();
  const navigate = useNavigate();

  const handleSignUp = async (data: SignUpFormValues) => {
    const { fullname, email, password, role } = data;
    await signUp(fullname, email, password, role);
    navigate("/otp");
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-gradient-purple">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm onSubmit={handleSignUp} />
      </div>
    </div>
  );
};

export default SignUpPage;