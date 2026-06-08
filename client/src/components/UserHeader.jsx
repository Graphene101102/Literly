import React from 'react';
import { Link } from 'react-router-dom'
import { NavLink, useLocation } from 'react-router-dom';
import LiterlyLogoSmall from '../assets/literly-logo-small.png';
import EarthGlobeIcon from '../assets/earth-globe-icon.png';
import { Bell } from 'lucide-react';
import AvatarDropdown from './AvatarDropdown';

const UserHeader = () => {
  const location = useLocation();
  const tabs = [
    { name: "BÀI HỌC", path: "/lessons" },
    { name: "BÀI TẬP", path: "/exercises" },
    { name: "TÀI LIỆU", path: "/documents" },
  ];

  return (
    <div className="flex flex-col items-center justify-between w-full relative z-20">

      <div className='bg-blue-300 p-4 md:p-8 shadow-md w-full flex flex-col md:flex-row items-center justify-between gap-4'>
        <div className="flex w-full justify-between items-center">
          <Link to="/lessons" className="flex items-center">
            <img src={LiterlyLogoSmall} alt="Literly Logo" className="h-10 md:h-12 mr-2" />
          </Link>
          <div className="flex items-center space-x-4">
            <Bell size={24} className="text-gray-600 hover:text-blue-500 cursor-pointer" />
            <AvatarDropdown />
          </div>
        </div>

        <div className="flex items-center justify-center w-full md:w-auto mt-2 md:mt-0">
          <h1 className="text-lg md:text-xl font-bold text-gray-800 mr-2 md:mr-4 text-center tracking-wide">TRÁI ĐẤT - NGÔI NHÀ CHUNG</h1>
          <img src={EarthGlobeIcon} alt="Earth Globe" className="h-8 md:h-12 hidden md:block" />
        </div>
      </div>

      <div className='flex justify-center bg-white w-full p-2 md:p-4 shadow-sm border-b border-gray-100 overflow-x-auto'>
        <nav className="flex items-center justify-start md:justify-center space-x-2 md:space-x-8 min-w-max px-2">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                `px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-lg font-bold whitespace-nowrap transition-colors ${isActive ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-blue-100'}`
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </nav>
      </div>

    </div>
  );
};

export default UserHeader;