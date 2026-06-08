import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
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
  const [showPassword, setShowPassword] = useState(false);
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState([]);

  React.useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await api.get('/classes');
        setClasses(data);
        if (data.length > 0) setClassId(data[0]._id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClasses();
  }, []);

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
      const res = await register({ username, password, fullName, classId });
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


      <div className="relative z-10 w-full h-full pt-16 pointer-events-none overflow-hidden">
        
        {/* Content container needs pointer-events-auto */}
        <div className="absolute top-[40%] xl:top-[45%] left-0 right-0 xl:right-auto px-4 md:px-12 xl:px-0 xl:left-[18%] -translate-y-1/2 flex flex-col items-center justify-center w-full xl:max-w-[1000px] z-50 pointer-events-auto">
          <img src={LiterlyLogo} alt="Literly Logo" className="w-[85%] md:w-[70%] xl:w-[100%] max-w-[1000px] mb-4 xl:mb-8 drop-shadow-sm" />

          <h1 className="text-lg md:text-2xl xl:text-[32px] font-bold text-green-800 mb-6 xl:mb-10 text-center tracking-wide">
            Bài 10: TRÁI ĐẤT - NGÔI NHÀ CHUNG
          </h1>

          {!showForm ? (
            <div className="flex flex-row items-center justify-center space-x-3 xl:space-x-6 w-full">
              <button
                onClick={() => handleButtonClick('login')}
                className="bg-[#3b82f6] hover:bg-blue-600 text-white font-bold text-sm md:text-base xl:text-xl py-2.5 px-6 xl:py-3 xl:px-10 rounded shadow-sm transition-all whitespace-nowrap min-w-[110px] xl:min-w-[160px]"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => handleButtonClick('register')}
                className="bg-[#3b82f6] hover:bg-blue-600 text-white font-bold text-sm md:text-base xl:text-xl py-2.5 px-6 xl:py-3 xl:px-10 rounded shadow-sm transition-all whitespace-nowrap min-w-[110px] xl:min-w-[160px]"
              >
                Đăng ký
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-[320px] bg-white p-6 rounded-2xl shadow-xl border border-blue-100 mt-4">
              <h2 className="text-xl md:text-2xl font-bold text-center text-blue-900 mb-2">
                {isLogin ? 'Đăng Nhập' : 'Đăng Ký Mới'}
              </h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center text-sm font-medium">
                  {error}
                </div>
              )}

              {!isLogin && (
                <>
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <select
                    className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    required
                  >
                    <option value="" disabled>-- Chọn lớp học --</option>
                    {classes.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </>
              )}

              <input
                type="text"
                placeholder="Tên đăng nhập"
                className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all hover:scale-105 mt-2"
              >
                {isLogin ? 'Vào học ngay' : 'Tạo tài khoản'}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-blue-600 font-medium text-sm mt-3 text-center transition-colors"
              >
                Quay lại
              </button>
            </form>
          )}

        </div>

        {/* Floating Whale Decoration (Desktop Only) */}
        <div className="hidden xl:block absolute right-16 top-[55%] -translate-y-1/2 pointer-events-none z-0">
          <img src={EarthWhale} alt="Earth Whale" className="w-[450px] drop-shadow-xl opacity-95 animate-[bounce_4s_ease-in-out_infinite]" />
        </div>

      </div>
    </div>
  );
};

export default AuthScreen;