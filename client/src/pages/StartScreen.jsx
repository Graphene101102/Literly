import React from 'react';
import LiterlyLogo from '../assets/literly-logo.png'; // Assuming you'll add the logo here
import EarthWhale from '../assets/earth-whale.png'; // Assuming you'll add the image here

const StartScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 relative">
      <div className="absolute top-0 left-0 right-0 h-48 bg-blue-300"></div> {/* Top blue banner */}
      <div className="absolute top-32 left-0 right-0 h-full bg-white opacity-75"></div> {/* Faded white background */}

      <div className="relative z-10 flex flex-col items-center">
        <img src={LiterlyLogo} alt="Literly Logo" className="w-64 mb-4" /> {/* Adjust size as needed */}
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Bài 10: TRÁI ĐẤT - NGÔI NHÀ CHUNG</h1>

        <div className="flex space-x-4 mb-8">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg">
            Đăng nhập
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg">
            Đăng kí
          </button>
        </div>

        <img src={EarthWhale} alt="Earth Whale" className="w-96" /> {/* Adjust size as needed */}
      </div>
    </div>
  );
};

export default StartScreen;
