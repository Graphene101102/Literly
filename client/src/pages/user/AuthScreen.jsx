import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LiterlyLogo from '../../assets/literly-logo.png';
import EarthWhale from '../../assets/earth-whale.png';
import EarthBackground from '../../assets/earth-background.png';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login/Register mode
  const [showForm, setShowForm] = useState(false); // Show inputs after clicking Login/Register buttons
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const res = await login(username, password);
      if (res.success) {
        if (res.data.role === 'admin') {
          navigate('/admin/exercises');
        } else {
          navigate('/lessons');
        }
      } else {
        setError(res.message);
      }
    } else {
      // Register Flow
      const res = await register({ username, password, fullName });
      if (res.success) {
        navigate('/lessons'); // Default to student view for new registration
      } else {
        setError(res.message);
      }
    }
  };

  const handleButtonClick = (mode) => {
    console.log('Button Clicked:', mode); // Debug log
    setIsLogin(mode === 'login');
    setShowForm(true);
    setError('');
  };

  return (
    <div className="h-screen w-screen flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-20 bg-blue-300 z-20"></div>

      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-cover z-0"
        style={{
          backgroundImage: `url(${EarthBackground})`,
          top: '80px'
        }}
      >
        <div className="w-full h-full bg-white opacity-85"></div>
      </div>


      <div className="relative z-10 flex items-center justify-between w-full h-full pt-40 pl-20 pr-20 pointer-events-none">
        {/* Content container needs pointer-events-auto */}
        <div className="flex flex-col items-center w-2/3 pr-8 z-50 pointer-events-auto">
          <img src={LiterlyLogo} alt="Literly Logo" className="w-100 mb-4" />

          <h1 className="text-4xl font-bold text-green-800 mt-12 mb-8 text-center">
            Bài 10: TRÁI ĐẤT - NGÔI NHÀ CHUNG
          </h1>

          {!showForm ? (
            <div className="flex space-x-6 pt-8 relative z-[100]">
              <button
                onClick={() => handleButtonClick('login')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-2xl py-5 px-16 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer relative z-[100]"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => handleButtonClick('register')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-2xl py-5 px-16 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer relative z-[100]"
              >
                Đăng ký
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-md bg-white p-8 rounded-xl shadow-2xl mt-4 border border-blue-200">
              <h2 className="text-2xl font-bold text-center text-blue-900 mb-4">
                {isLogin ? 'Đăng Nhập' : 'Đăng Ký Học Sinh Mới'}
              </h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center">
                  {error}
                </div>
              )}

              {!isLogin && (
                <input
                  type="text"
                  placeholder="Họ và tên"
                  className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              )}

              <input
                type="text"
                placeholder="Tên đăng nhập"
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Mật khẩu"
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors mt-2"
              >
                {isLogin ? 'Vào học ngay' : 'Tạo tài khoản'}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 text-sm mt-2 text-center underline"
              >
                Quay lại
              </button>
            </form>
          )}

        </div>

        <div className="w-1/2 flex justify-end">
          <img src={EarthWhale} alt="Earth Whale" className="w-[500px] drop-shadow-2xl" />
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;