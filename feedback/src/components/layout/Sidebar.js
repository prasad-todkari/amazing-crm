
// Sidbar.js
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ userRole, isCollapsed, onToggle }) {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: 'ri-dashboard-3-line',
      href: '/dashboard',
      roles: ['admin', 'moderator', 'manager']
    },
    {
      title: 'Feedback',
      icon: 'ri-feedback-line',
      href: '/feedback',
      roles: ['admin', 'moderator', 'manager'],
      badge: ''
    },
    {
      title: 'Select Questions',
      icon: 'ri-survey-line',
      href: '/questions',
      roles: ['admin', 'manager']
    },
    {
      title: 'Site Master',
      icon: 'ri-map-pin-user-line',
      href: '/siteMaster',
      roles: ['admin']
    },
    {
      title: 'Users',
      icon: 'ri-user-line',
      href: '/users',
      roles: ['admin']
    },
    {
      title: 'Categories',
      icon: 'ri-folder-line',
      href: '/categories',
      roles: ['admin']
    },
    {
      title: 'Reports',
      icon: 'ri-file-text-line',
      href: '/reports',
      roles: ['admin']
    },
    {
      title: 'Settings',
      icon: 'ri-settings-3-line',
      href: '/settings',
      roles: ['admin']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 h-screen z-50 ${
      isCollapsed ? 'w-16' : 'w-52'
    } flex flex-col sticky top-0 shadow-md md:static absolute`}>
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <i className={`ri-${isCollapsed ? 'menu-unfold' : 'menu-fold'}-line text-gray-600`}></i>
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredMenuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap group ${
              location.pathname === item.href
                ? 'bg-slate-200 text-slate-600 border-r-2 border-slate-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={`${item.icon} text-lg`}></i>
            </div>
            {!isCollapsed && (
              <>
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
            {isCollapsed && (
              <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {item.title}
                {item.badge && ` (${item.badge})`}
              </div>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <i className="ri-question-line text-gray-600"></i>
          </div>
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium text-gray-900">Need Help?</p>
              <p className="text-xs text-gray-500">Check our docs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
