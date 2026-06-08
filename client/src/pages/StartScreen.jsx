import React from 'react';
import LiterlyLogo from '../assets/literly-logo.png'; // Assuming you'll add the logo here
import EarthWhale from '../assets/earth-whale.png'; // Assuming you'll add the image here

const StartScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 relative">
      <div className="absolute top-0 left-0 right-0 h-48 bg-blue-300"></div> {/* Top blue banner */}
      <div className="absolute top-32 left-0 right-0 h-full bg-white opacity-75"></div> {/* Faded white background */}

      <div className="relative z-10 flex flex-col items-center w-full px-4 mt-20">
        <img src={LiterlyLogo} alt="Literly Logo" className="w-80 md:w-96 mb-6 drop-shadow-md" /> {/* Adjust size as needed */}
        <h1 className="text-xl md:text-3xl font-bold text-green-800 mb-10 text-center leading-snug">Bài 10: TRÁI ĐẤT - NGÔI NHÀ CHUNG</h1>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mb-8 w-full">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-8 rounded-xl shadow-lg w-3/4 max-w-[220px] transition-transform hover:scale-105">
            Đăng nhập
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-8 rounded-xl shadow-lg w-3/4 max-w-[220px] transition-transform hover:scale-105">
            Đăng kí
          </button>
        </div>

        <img src={EarthWhale} alt="Earth Whale" className="w-96 hidden md:block drop-shadow-2xl mt-10" /> {/* Hide on mobile */}
      </div>
    </div>
  );
};

export default StartScreen;
