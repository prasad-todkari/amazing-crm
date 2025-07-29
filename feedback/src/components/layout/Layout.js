import { useState } from 'react';
import { Outlet } from 'react-router-dom'; 
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function AdminLayout({ userRole, userName }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block">
        <Sidebar
          userRole={userRole}
          isCollapsed={isSidebarCollapsed}
          onToggle={handleToggleSidebar}
        />
      </div>

      {/* Sidebar for Mobile */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setIsMobileOpen(false)}></div>
          <div className="relative z-50">
            <Sidebar
              userRole={userRole}
              isCollapsed={false}
              onToggle={() => setIsMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Navbar
          userRole={userRole}
          userName={userName}
          onMenuClick={handleToggleSidebar}
        />

        <main className="flex-1  overflow-y-auto p-4 sm:p-6">
          <div className="max-w-full">
            <Outlet /> 
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
