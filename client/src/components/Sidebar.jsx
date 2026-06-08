import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DefaultAvatar from '../assets/user-avatar.png';
import { Menu, X } from 'lucide-react';

const API_BASE = import.meta.env.MODE === 'production' ? '' : 'http://localhost:5001';

const Sidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const avatarSrc = user?.avatar ? `${API_BASE}${user.avatar}` : DefaultAvatar;

  const navItems = [
    {
      name: "Quản lí học sinh", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2m2-5a4 4 0 004 4h2m-5-9a4 4 0 118 0 4 4 0 01-8 0zM12 14v5m-3-2h6" />
        </svg>
      ), path: "/admin/students"
    },
    {
      name: "Quản lí bài học", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.206 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.794 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.794 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.206 18 16.5 18s-3.332.477-4.5 1.253" />
        </svg>
      ), path: "/admin/lessons"
    },
    {
      name: "Quản lí bài tập", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ), path: "/admin/exercises"
    },
    {
      name: "Quản lí tài liệu", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ), path: "/admin/documents"
    },
    {
      name: "Thống kê", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ), path: "/admin/statistics"
    },
  ];

  return (
    <>
      {/* Nút Toggle Menu trên Điện thoại */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] bg-blue-600 text-white p-4 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center transition-transform active:scale-95"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Lớp nền đen mờ khi mở Menu */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Nội dung Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl flex flex-col p-4 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:h-full lg:w-64 lg:shadow-lg lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center mb-6">
          <img src={avatarSrc} alt="User Avatar" className="h-12 w-12 rounded-full mr-3 object-cover shadow-sm" />
          <span className="text-lg font-bold text-blue-900">{user?.fullName || 'Giáo viên'}</span>
        </div>
        <nav className="flex flex-col space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg text-gray-700 hover:bg-blue-100 transition-colors ${isActive ? 'bg-blue-200 font-bold text-blue-800 shadow-sm' : ''}`
              }
            >
              <span className="mr-3 text-blue-600">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
