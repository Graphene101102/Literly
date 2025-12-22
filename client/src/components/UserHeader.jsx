import React from 'react';
import { Link } from 'react-router-dom'
import { NavLink, useLocation } from 'react-router-dom';
import LiterlyLogoSmall from '../assets/literly-logo-small.png';
import EarthGlobeIcon from '../assets/earth-globe-icon.png';
import UserAvatar from '../assets/user-avatar.png';
import { Bell } from 'lucide-react';

const UserHeader = () => {
  const location = useLocation();
  const tabs = [
    { name: "BÀI HỌC", path: "/lessons" },
    { name: "BÀI TẬP", path: "/exercises" },
    { name: "TÀI LIỆU", path: "/documents" },
  ];

  return (
    <div className="flex flex-col items-center justify-between ">

      <div className='bg-blue-300 p-8 shadow-md w-full h-30 flex-grow flex items-center justify-between'>
        <Link to="/" className="flex items-center">
          <img src={LiterlyLogoSmall} alt="Literly Logo" className="h-12 mr-2" />
        </Link>

        <div className="flex items-center">
          <h1 className="text-lg font-bold text-gray-800 mr-4">TRÁI ĐẤT - NGÔI NHÀ CHUNG</h1>
          <img src={EarthGlobeIcon} alt="Earth Globe" className="h-12" />
        </div>

          <div className="flex items-center space-x-4">
            <Bell size={28} className="text-gray-600 hover:text-blue-500 cursor-pointer" />
            <span className="text-gray-800 font-medium text-xl">Tên</span>
            <img src={UserAvatar} alt="User Avatar" className="h-12 w-12 rounded-full" />
          </div>
      </div>

        <div className='flex-grow flex justify-center bg-blue opacity-90 w-full h-30 p-5'>
          <nav className="flex-grow flex items-center justify-center space-x-8">
            {tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-2xl font-semibold ${isActive ? 'bg-blue-300 text-black-900' : 'text-gray-600 hover:bg-blue-200'}`
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