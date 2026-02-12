import React from 'react';
import { Link } from 'react-router-dom';
import LiterlyLogoSmall from '../assets/literly-logo-small.png';
import EarthGlobeIcon from '../assets/earth-globe-icon.png';
import AvatarDropdown from './AvatarDropdown';

const AdminHeader = () => {
  return (
    <div className="flex flex-col items-center justify-between ">
      <div className='bg-blue-300 p-8 shadow-md w-full h-30 flex-grow flex items-center justify-between'>
        <Link to="/admin/students" className="flex items-center">
          <img src={LiterlyLogoSmall} alt="Literly Logo" className="h-12 mr-2" />
        </Link>

        <div className="flex items-center">
          <h1 className="text-lg font-bold text-gray-800 mr-4">TRÁI ĐẤT - NGÔI NHÀ CHUNG</h1>
          <img src={EarthGlobeIcon} alt="Earth Globe" className="h-12" />
        </div>

        <div className="flex items-center space-x-4">
          <AvatarDropdown />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
