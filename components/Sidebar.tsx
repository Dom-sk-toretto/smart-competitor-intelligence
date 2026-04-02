import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { NavItem } from '../types';
import { AuthContext } from '../App';
import {
  DashboardIcon,
  CompetitorsIcon,
  SparklesIcon,
  CompareIcon,
  BellIcon,
  UserCircleIcon,
  LogoutIcon,
} from './icons';

const mainNavItems: NavItem[] = [
  { text: 'Dashboard', link: '/dashboard', icon: DashboardIcon },
  { text: 'Competitors', link: '/competitors', icon: CompetitorsIcon },
  { text: 'Insights', link: '/insights', icon: SparklesIcon },
  { text: 'Compare', link: '/compare', icon: CompareIcon },
];

const secondaryNavItems: NavItem[] = [
  { text: 'Notifications', link: '/notifications', icon: BellIcon },
  { text: 'Account', link: '/account', icon: UserCircleIcon },
];

const Sidebar: React.FC = () => {
  const auth = useContext(AuthContext);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-blue-600/30 text-white font-semibold'
        : 'text-gray-400 hover:bg-slate-800/60 hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-[#101629]/50 backdrop-blur-sm border-r border-slate-800/50 flex-col p-4 hidden md:flex">
      <div className="flex items-center gap-2 mb-8 px-2">
        <SparklesIcon className="w-8 h-8 text-[#06B6D4]" />
        <h1 className="text-xl font-bold text-white">CompetitorAI</h1>
      </div>

      <nav className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">Menu</h2>
          <ul className="space-y-1">
            {mainNavItems.map((item) => (
              <li key={item.text}>
                <NavLink to={item.link} className={navLinkClasses}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mt-8 mb-2">Personal</h2>
          <ul className="space-y-1">
            {secondaryNavItems.map((item) => (
              <li key={item.text}>
                <NavLink to={item.link} className={navLinkClasses}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
           <button 
            onClick={auth?.logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-slate-800/60 hover:text-white transition-colors duration-200"
           >
                <LogoutIcon className="w-5 h-5" />
                <span>Logout</span>
            </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
