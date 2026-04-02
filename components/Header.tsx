import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AppDataContext } from '../App';
import { UserCircleIcon } from './icons';

const Header: React.FC = () => {
  const location = useLocation();
  const appData = useContext(AppDataContext);
  
  const getTitle = () => {
    const path = location.pathname.replace('/', '');
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const photoUrl = appData?.profileDetails.photoUrl;

  return (
    <header className="bg-[#101629]/50 backdrop-blur-sm border-b border-slate-800/50 p-4 md:px-8 flex justify-between items-center">
      <h2 className="text-2xl font-bold text-white">{getTitle()}</h2>
      <div className="flex items-center gap-4">
        <div className="relative">
          {photoUrl ? (
             <img src={photoUrl} alt="User" className="w-10 h-10 rounded-full border-2 border-[#06B6D4] object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-[#06B6D4] flex items-center justify-center bg-slate-700">
                <UserCircleIcon className="w-8 h-8 text-slate-400" />
            </div>
          )}
           <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
        </div>
      </div>
    </header>
  );
};

export default Header;