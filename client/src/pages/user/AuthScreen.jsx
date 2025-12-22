import React from 'react';
import LiterlyLogo from '../../assets/literly-logo.png';
import EarthWhale from '../../assets/earth-whale.png';
import EarthBackground from '../../assets/earth-background.png'; 

const AuthScreen = () => {
  return (
    <div className="h-screen w-screen flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-20 bg-blue-300 z-20"></div>

      <div 
        className="absolute inset-0 bg-no-repeat bg-center bg-cover" 
        style={{ 
          backgroundImage: `url(${EarthBackground})`,
          top: '80px' 
        }}
      >
        <div className="w-full h-full bg-white opacity-85"></div>
      </div>

   
      <div className="relative z-10 flex items-center justify-between w-full h-full pt-40 pl-20 pr-20">
        <div className="flex flex-col items-center w-2/3 pr-8">
          <img src={LiterlyLogo} alt="Literly Logo" className="w-100 mb-4" />
          
          <h1 className="text-4xl font-bold text-green-800 mt-12 mb-12 text-center">
            Bài 10: TRÁI ĐẤT - NGÔI NHÀ CHUNG
          </h1>

          <div className="flex space-x-6 pt-12">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-2xl py-5 px-16 rounded-xl shadow-lg transition-transform hover:scale-105">
              Đăng nhập
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-2xl py-5 px-16 rounded-xl shadow-lg transition-transform hover:scale-105">
              Đăng ký
            </button>
          </div>
        </div>

        <div className="w-1/2 flex justify-end">
          <img src={EarthWhale} alt="Earth Whale" className="w-[500px] drop-shadow-2xl" />
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;