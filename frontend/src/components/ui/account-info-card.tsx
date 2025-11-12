import type { User } from "@/types/user";

type AccountInfoCardProps = {
  user: User;
  onChangePassword?: () => void;
  onEditInfo?: () => void;
};

export function AccountInfoCard({
  user,
  onChangePassword,
  onEditInfo,
}: AccountInfoCardProps) {
  // Xác định màu status dựa trên status
  const isActive =
    user.status === "active" || user.status?.toLowerCase() === "hoatdong";
  const statusColor = isActive ? "bg-green-500" : "bg-red-500";
  const statusText = isActive ? "Đã kích hoạt" : "Chưa kích hoạt";

  return (
    <div className="max-w-sm bg-card border border-border rounded-lg shadow-sm p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Thông tin tài khoản
      </h2>

      {/* User Card */}
      <div className="space-y-6">
        {/* Username & Fullname */}
        <div className="grid grid-cols-1 md:grid-cols gap-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Họ và tên
            </label>
            <p className="text-foreground font-medium mt-1">{user.fullname}</p>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Email
          </label>
          <p className="text-foreground font-medium mt-1">
            {user.email || "N/A"}
          </p>
        </div>

        {/* Role & Status with Indicator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Vai trò
            </label>
            <p className="text-foreground font-medium mt-1 capitalize">
              {user.role}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Trạng thái
            </label>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-3 h-3 rounded-full ${statusColor}`} />
              <p className="text-foreground font-medium">{statusText}</p>
            </div>
          </div>
        </div>

        {/* Created At */}
        {user.create_at && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Ngày tạo
            </label>
            <p className="text-foreground font-medium text-sm mt-1">
              {new Date(user.create_at).toLocaleString("vi-VN")}
            </p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-border" />

      {/* Thông tin phòng ở */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground">
          Thông tin phòng ở
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Số phòng
            </label>
            <p className="text-foreground font-medium mt-1">-</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Số người
            </label>
            <p className="text-foreground font-medium mt-1">-</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-border" />

      {/* Links */}
      <div className="space-y-3">
        {onChangePassword && (
          <button
            onClick={onChangePassword}
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          >
            Đổi mật khẩu
          </button>
        )}
        {onEditInfo && (
          <button
            onClick={onEditInfo}
            className="block text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          >
            Chỉnh sửa thông tin
          </button>
        )}
      </div>
    </div>
  );
}
