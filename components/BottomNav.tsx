
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Screen } from '../types';
import { Icon } from './common/Icon';

const ICONS = {
  dashboard: 'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25',
  clients: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.318.239-.636.354-.962a3.752 3.752 0 01.284-.938M7.5 14.25A3.75 3.75 0 1011.25 10.5a3.75 3.75 0 00-3.75 3.75z',
  properties: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zm-.75 2.25h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zm-.75 2.25h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zm-.75 2.25h.75v.75h-.75v-.75zM15 6.75h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zm-.75 2.25h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zm-.75 2.25h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zm-.75 2.25h.75v.75h-.75v-.75z',
  schedule: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5',
  profile: 'M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
};

const NavItem: React.FC<{ screen: Screen; label: string }> = ({ screen, label }) => {
  const { currentScreen, setCurrentScreen } = useAppContext();
  const isActive = currentScreen === screen;
  
  return (
    <button
      onClick={() => setCurrentScreen(screen)}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
    >
      <Icon path={ICONS[screen]} className="w-6 h-6" />
      <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
  );
};

export const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-lg flex z-40">
      <NavItem screen="dashboard" label="Dashboard" />
      <NavItem screen="clients" label="Clients" />
      <NavItem screen="properties" label="Properties" />
      <NavItem screen="schedule" label="Schedule" />
      <NavItem screen="profile" label="Profile" />
    </div>
  );
};
