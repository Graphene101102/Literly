import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import LiterlyLogoSmall from '../assets/literly-logo-small.png'; // Smaller logo for header
import EarthGlobeIcon from '../assets/earth-globe-icon.png'; // Earth globe icon
import UserAvatar from '../assets/user-avatar.png'; // User avatar

const Header = () => {
  const location = useLocation();
  const tabs = [
    { name: "BÀI HỌC", path: "/lessons" },
    { name: "BÀI TẬP", path: "/exercises" },
    { name: "TÀI LIỆU", path: "/documents" },
  ];

  return (
    <div className="bg-blue-300 p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center">
        <img src={LiterlyLogoSmall} alt="Literly Logo" className="h-8 mr-2" />
        <span className="text-xl font-bold text-gray-800">LITERLY</span>
      </div>

      <div className="flex items-center">
        <h1 className="text-lg font-bold text-gray-800 mr-4">TRÁI ĐẤT - NGÔI NHÀ CHUNG</h1>
        <img src={EarthGlobeIcon} alt="Earth Globe" className="h-6" />
      </div>

      <nav className="flex-grow flex justify-center space-x-8">
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-t-lg font-semibold ${isActive ? 'bg-white text-blue-600' : 'text-gray-700 hover:bg-blue-200'}`
            }
          >
            {tab.name}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center space-x-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.002 2.002 0 0118 14.59V10a6 6 0 00-4-5.659V4a2 2 0 10-4 0v.341C7.47 5.092 6 6.666 6 8.59V14.59a2.002 2.002 0 01-1.405 1.405L3 17h5m-1.405-1.405L12 21.405M15 17h5l-1.405-1.405A2.002 2.002 0 0118 14.59V10a6 6 0 00-4-5.659V4a2 2 0 10-4 0v.341C7.47 5.092 6 6.666 6 8.59V14.59a2.002 2.002 0 01-1.405 1.405L3 17h5m-1.405-1.405L12 21.405"
          />
        </svg>
        <span className="text-gray-800 font-medium">Tên</span>
        <img src={UserAvatar} alt="User Avatar" className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
};

export default Header;