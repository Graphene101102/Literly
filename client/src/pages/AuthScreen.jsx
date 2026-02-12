import React from 'react';
import LiterlyLogo from '../assets/literly-logo.png';
import EarthBackground from '../assets/earth-background.png'; // Assuming a background image

const AuthScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${EarthBackground})` }}>
      <div className="absolute top-0 left-0 right-0 h-48 bg-blue-300 flex items-center justify-center">
        <img src={LiterlyLogo} alt="Literly Logo" className="w-48" />
        <h1 className="text-2xl font-bold text-gray-800 ml-4">TRÁI ĐẤT - NGÔI NHÀ CHUNG</h1>
      </div>

      <div className="relative z-10 bg-blue-200 bg-opacity-75 p-8 rounded-lg shadow-lg flex flex-col items-center mt-48">
        <div className="mb-4 w-full">
          <div className="flex items-center bg-white rounded-lg p-3 shadow-sm">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              className="flex-grow outline-none bg-transparent text-lg"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500 ml-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>

        <div className="mb-8 w-full">
          <div className="flex items-center bg-white rounded-lg p-3 shadow-sm">
            <input
              type="password"
              placeholder="Mật khẩu"
              className="flex-grow outline-none bg-transparent text-lg"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500 ml-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-12 rounded-lg shadow-lg">
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default AuthScreen;
