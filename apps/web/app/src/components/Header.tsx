import { Rabbit, Bell, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'My Pets', to: '/pet-profile' },
  { label: 'AI Assistant', to: '/ai-chat' },
  { label: 'Search', to: '/search' },
];

export default function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-surface-container-lowest/90 backdrop-blur-[20px] border-b border-outline-variant/15 px-8 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="bg-primary-container/30 p-2 rounded-full text-primary group-hover:bg-primary-container/50 transition-colors">
          <Rabbit size={20} />
        </div>
        <span className="font-display font-semibold text-xl text-primary tracking-tight">3rabbits</span>
      </Link>

      <nav className="hidden md:flex items-center gap-1">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.to || (item.to === '/' && location.pathname === '/dashboard');
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? 'text-primary bg-primary-container/20'
                  : 'text-secondary hover:text-on-secondary-fixed hover:bg-surface-container-low'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 text-secondary hover:text-on-secondary-fixed hover:bg-surface-container-low rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>
        <button
          type="button"
          className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary hover:bg-secondary-container/80 transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95"
          aria-label="Profile"
        >
          <User size={16} />
        </button>
      </div>
    </header>
  );
}
