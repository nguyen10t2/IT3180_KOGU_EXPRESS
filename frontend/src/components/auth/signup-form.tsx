import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from "@/validation/authSchema";
import type { SignUpFormValues } from "@/validation/authSchema";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signUp } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: 'resident',
    }
  });

  const onSubmit = async (data: SignUpFormValues) => {
    const { fullname, email, password, role } = data;
    navigate("/otp");
    await signUp(fullname, email, password, role);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-4 md:p-6 w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              {/* header - logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/"
                  className="mx-auto block w-fit text-center">
                  <img
                    src="/logo.svg"
                    alt="logo"
                  />
                </a>
                <h1 className="text-2xl font-bold">Tạo tài khoản Kogu</h1>
              </div>
              {/* họ và tên */}
              <div className="grid grid-col gap-2">
                <div className="space-y-2">
                  <Label htmlFor="fullname" className="block text-sm">Họ và tên</Label>
                  <Input
                    type="text"
                    id="fullname"
                    placeholder="Nguyễn Văn Kogu"
                    {...register("fullname")}
                  />
                  {errors.fullname && (
                    <p className="text-destructive text-sm">
                      {errors.fullname.message}
                    </p>
                  )}
                </div>
              </div>
              {/* email */}
              <div className="grid grid-col gap-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="block text-sm">Tài khoản email</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="kogu@kogu.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              {/* password */}
              <div className="grid grid-col gap-2">
                <div className="space-y-2">
                  <Label htmlFor="password" className="block text-sm">Mật khẩu</Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="#@jdfebh3bvdesw3622w3"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-destructive text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              {/* nút đăng kí */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                Tạo tài khoản
              </Button>

              <div className="text-center text-sm">
                Đã có tài khoản? {" "}
                <a href="/signin" className="underline underline-offset-4">
                  Đăng nhập
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholderSignUp.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-forceground *:[a]:underline *:[a]underline-offset-4">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
        and <a href="#">Chính sách bảo mật của chúng tôi</a>.
      </div>
    </div>
  );
}