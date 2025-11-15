import { useState } from 'react';
import { Home, User, Bell, FileText, MessageSquare } from 'lucide-react';
import Logout from './auth/Logout';
import AccountInfo from '../pages/AccountInfo';

export default function Sidebar() {
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <a href="/home" className="flex items-center gap-3">
            <img src="/logo.svg" alt="Building Logo" className="w-10 h-10" />
            <span className="font-heading font-semibold text-lg text-sidebar-foreground">
              Building
            </span>
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <a
            href="/home"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Trang chủ</span>
          </a>

          <button
            onClick={() => setIsAccountOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Tài khoản</span>
          </button>

          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="font-medium">Thông báo</span>
          </a>

          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Hóa đơn</span>
          </a>

          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Feedback</span>
          </a>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <Logout />
        </div>
      </aside>

      {/* Account Info Modal */}
      <AccountInfo isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
    </>
  );
}