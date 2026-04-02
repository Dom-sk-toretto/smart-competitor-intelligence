
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AIAssistant from './AIAssistant';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#0A0F1F] text-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#0A0F1F] p-4 md:p-8">
          <Outlet />
        </main>
      </div>
      <AIAssistant />
    </div>
  );
};

export default Layout;
