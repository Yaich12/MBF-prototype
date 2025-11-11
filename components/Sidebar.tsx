
import React from 'react';
import { Page } from '../types';
import { SearchIcon, BellIcon, CalendarIcon, UsersIcon, TagIcon, DocumentTextIcon, ChartBarIcon, CogIcon, CubeTransparentIcon, ChevronDownIcon } from './icons';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const navItems = [
    { page: Page.Calendar, icon: <CalendarIcon className="w-5 h-5" /> },
    { page: Page.Clients, icon: <UsersIcon className="w-5 h-5" /> },
    { page: Page.Services, icon: <TagIcon className="w-5 h-5" /> },
    { page: Page.Invoices, icon: <DocumentTextIcon className="w-5 h-5" /> },
    { page: Page.Statistics, icon: <ChartBarIcon className="w-5 h-5" /> },
    { page: Page.Settings, icon: <CogIcon className="w-5 h-5" /> },
  ];

  const appsNavItem = { page: Page.Apps, icon: <CubeTransparentIcon className="w-5 h-5" /> };

  return (
    <div className="w-64 bg-white h-screen flex flex-col border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">MBF system</h1>
      </div>
      <div className="flex-grow p-2">
        <div className="space-y-1">
          <button className="w-full flex items-center justify-between text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
            <div className="flex items-center space-x-2">
              <SearchIcon className="w-5 h-5" />
              <span>Søg</span>
            </div>
            <ChevronDownIcon className="w-4 h-4" />
          </button>
          <button className="w-full flex items-center justify-between text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
            <div className="flex items-center space-x-2">
              <BellIcon className="w-5 h-5" />
              <span>Notifikationer</span>
            </div>
            <ChevronDownIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-4">
          <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Klinik</h2>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.page}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage(item.page);
                }}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md space-x-3 ${
                  activePage === item.page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.page}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Apps Section */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <nav className="space-y-1">
             <a
                key={appsNavItem.page}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage(appsNavItem.page);
                }}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md space-x-3 ${
                  activePage === appsNavItem.page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {appsNavItem.icon}
                <span>{appsNavItem.page}</span>
              </a>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;