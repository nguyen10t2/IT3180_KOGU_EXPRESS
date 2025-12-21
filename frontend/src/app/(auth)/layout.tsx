import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập - Kogu Express",
  description: "Đăng nhập vào hệ thống quản lý chung cư Kogu Express",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-300">
        {children}
      </div>
    </div>
  );
}
