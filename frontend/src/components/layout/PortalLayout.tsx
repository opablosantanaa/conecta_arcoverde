import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PortalSidebar, NavItem } from './PortalSidebar';
import { PortalHeader } from './PortalHeader';
import { useAuthStore } from '@/store/authStore';

interface PortalLayoutProps {
  items: NavItem[];
  saudacao?: string;
}

export function PortalLayout({ items, saudacao }: PortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore(s => s.user);

  return (
    <div className="min-h-screen flex bg-surface-secondary dark:bg-surface-dark">
      <PortalSidebar
        items={items}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader
          onMenuClick={() => setSidebarOpen(true)}
          userName={user?.nome || user?.email}
          saudacao={saudacao}
        />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}