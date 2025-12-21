"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/lib/validations/auth";
import type { SignUpFormValues } from "@/lib/validations/auth";
import Link from "next/link";
import Image from "next/image";

type SignUpFormProps = {
  onSubmit: (data: SignUpFormValues) => Promise<void>;
  isLoading?: boolean;
  className?: string;
};

export function SignUpForm({
  className,
  onSubmit,
  isLoading = false,
}: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: "resident",
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader className="text-center">
           <div className="flex justify-center mb-4">
             <Link href="/">
                <Image
                  src="/logo.svg"
                  alt="Kogu Express"
                  width={48}
                  height={48}
                  className="size-12"
                  priority
                />
             </Link>
          </div>
          <CardTitle className="text-2xl">Đăng ký tài khoản</CardTitle>
          <CardDescription>
            Nhập thông tin bên dưới để tạo tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fullname">Họ và tên</Label>
                <Input
                  id="fullname"
                  placeholder="Nguyễn Văn A"
                  {...register("fullname")}
                />
                {errors.fullname && (
                  <p className="text-sm text-destructive">
                    {errors.fullname.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mật khẩu của bạn"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
                {isSubmitting || isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Đã có tài khoản?{" "}
              <Link href="/signin" className="underline underline-offset-4">
                Đăng nhập
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground">
        Bằng cách tiếp tục, bạn đồng ý với{" "}
        <Link href="#" className="underline underline-offset-4 hover:text-primary">
          Điều khoản dịch vụ
        </Link>{" "}
        và{" "}
        <Link href="#" className="underline underline-offset-4 hover:text-primary">
          Chính sách bảo mật
        </Link>
        .
      </div>
    </div>
  );
}
