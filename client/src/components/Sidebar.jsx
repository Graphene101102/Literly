import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DefaultAvatar from '../assets/user-avatar.png';

const API_BASE = 'http://localhost:5001';

const Sidebar = () => {
  const { user } = useAuth();
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
    <div className="w-64 bg-white shadow-lg h-full flex flex-col p-4">
      <div className="flex items-center mb-6">
        <img src={avatarSrc} alt="User Avatar" className="h-12 w-12 rounded-full mr-3 object-cover" />
        <span className="text-lg font-semibold text-gray-800">{user?.fullName || 'Giáo viên'}</span>
      </div>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg text-gray-700 hover:bg-blue-100 ${isActive ? 'bg-blue-200 font-bold text-blue-800' : ''}`
            }
          >
            <span className="mr-3 text-blue-600">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
