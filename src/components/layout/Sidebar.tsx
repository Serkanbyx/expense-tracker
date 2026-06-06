import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, X } from 'lucide-react';
import Button from '../ui/Button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    to: '/',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    to: '/transactions',
    icon: Receipt,
    label: 'Transactions',
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64
          bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-end h-16 px-4 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4 lg:pt-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                    ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            v1.0.0 - Expense Tracker
          </p>
        </div>
      </aside>
    </>
  );
}
