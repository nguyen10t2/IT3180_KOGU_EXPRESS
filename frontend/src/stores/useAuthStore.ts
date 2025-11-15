import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,

      setAccessToken: (token: string) => {
        console.log("Setting accessToken:", token);
        set({ accessToken: token });
      },

      clearState: () => {
        console.log("clearState called - removing all auth data");
        localStorage.removeItem('userRole');
        set({
          accessToken: null,
          user: null,
          loading: false
        });
      },

  signUp: async (fullname, email, password, role) => {
    try {
      set({ loading: true });
      await authService.signUp({ fullname, email, password, role });
      // Lưu email dùng cho luồng xác thực OTP (OTPPage sẽ đọc từ localStorage)
      try {
        localStorage.setItem('signupEmail', email);
      } catch (e) {
        console.warn('Failed to persist signupEmail to localStorage', e);
      }
      toast.success("Gửi mã OTP thành công! Vui lòng kiểm tra email.");
    } catch (error) {
      console.error(error);
      toast.error("Đăng ký không thành công!");
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ loading: true });
      const { accessToken } = await authService.signIn(email, password);

      get().setAccessToken(accessToken);

      const user = await get().fetchMe();

      if (user?.role) {
        localStorage.setItem('userRole', user.role);
      }

      toast.success("🎉 Chào mừng bạn quay lại!");
    } catch (err) {
      console.error(err);
      toast.error("Đăng nhập không thành công");
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      const { accessToken } = get();
      if (!accessToken) throw new Error("Không có access token!");

      await authService.signOut();
      get().clearState();

      toast.success("Đăng xuất thành công 🎉🎉");
    } catch (err) {
      console.error(err);
      get().clearState();
      toast.error("Lỗi khi logout, vui lòng thử lại");
    } finally {
      set({ loading: false });
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();
      set({ user });
      return user;
    } catch (err) {
      console.error("Lỗi khi lấy thông tin người dùng:", err);
      set({ user: null });
      toast.error("Lỗi khi lấy thông tin người dùng");
    } finally {
      set({ loading: false });
    }
  },

  refreshTokenHandler: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe } = get();

      const accessToken = await authService.refreshTokenHandler();
      get().setAccessToken(accessToken);

      // Nếu chưa có thông tin người dùng, lấy nó
      if (!user) {
        await fetchMe();
      }
    } catch (err) {
      console.error("Lỗi khi làm mới token:", err);
      get().clearState();
      // Không toast khi refresh thất bại ở background
    } finally {
      set({ loading: false });
    }
  },
}),
    {
      name: 'auth-storage',
      partialize: (state) => ({ accessToken: state.accessToken }),
    }
  )
);