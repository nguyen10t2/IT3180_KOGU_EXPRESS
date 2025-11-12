import { SigninForm } from "@/components/auth/signin-form";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import type { SignInFormValues } from "@/validation/authSchema";

const SignInPage = () => {
  const { signIn } = useAuthStore();
  const navigate = useNavigate();

  const handleSignIn = async (data: SignInFormValues) => {
    const { email, password } = data;
    await signIn(email, password);
    navigate("/home");
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-gradient-purple">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SigninForm onSubmit={handleSignIn} />
      </div>
    </div>
  );
};

export default SignInPage;