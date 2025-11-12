import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import type { User } from "@/types/user";
import { AccountInfoCard } from "@/components/ui/account-info-card";

interface AccountInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountInfo({ isOpen }: AccountInfoProps) {
  const { user } = useAuthStore();
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      setUserInfo(user);
    }
  }, [user]);

  if (!isOpen || !userInfo) return null;

  const handleChangePassword = () => {
    // TODO: Implement change password logic
    console.log("Change password clicked");
  };

  const handleEditInfo = () => {
    // TODO: Implement edit info logic
    console.log("Edit info clicked");
  };

  return (
    <div className="ml-64 p-8 flex-1">
      <AccountInfoCard
        user={userInfo}
        onChangePassword={handleChangePassword}
        onEditInfo={handleEditInfo}
      />
    </div>
  );
}