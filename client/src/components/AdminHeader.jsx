import React from 'react';
import { Link } from 'react-router-dom';
import LiterlyLogoSmall from '../assets/literly-logo-small.png';
import EarthGlobeIcon from '../assets/earth-globe-icon.png';
import AvatarDropdown from './AvatarDropdown';

const AdminHeader = () => {
  return (
    <div className="flex flex-col items-center justify-between ">
      <div className='bg-blue-300 p-4 md:p-8 shadow-md w-full flex flex-wrap md:flex-nowrap items-center justify-between gap-4'>
        <Link to="/admin/students" className="flex items-center">
          <img src={LiterlyLogoSmall} alt="Literly Logo" className="h-8 md:h-12 mr-2" />
        </Link>

        <div className="flex items-center justify-center flex-grow md:flex-grow-0 order-3 md:order-none w-full md:w-auto">
          <h1 className="text-sm md:text-lg font-bold text-gray-800 mr-2 md:mr-4 text-center">TRÁI ĐẤT - NGÔI NHÀ CHUNG</h1>
          <img src={EarthGlobeIcon} alt="Earth Globe" className="h-8 md:h-12 hidden md:block" />
        </div>

        <div className="flex items-center space-x-2 md:space-x-4 order-2 md:order-none">
          <AvatarDropdown />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
