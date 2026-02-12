import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Settings, LogOut } from 'lucide-react';
import DefaultAvatar from '../assets/user-avatar.png';
import SettingsModal from './SettingsModal';

const API_BASE = 'http://localhost:5001';

const AvatarDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsOpen(false);
        logout();
        navigate('/');
    };

    const handleSettings = () => {
        setIsOpen(false);
        setShowSettings(true);
    };

    const avatarSrc = user?.avatar ? `${API_BASE}${user.avatar}` : DefaultAvatar;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
                <span className="text-gray-800 font-medium text-xl">
                    {user?.fullName || 'Tên'}
                </span>
                <img
                    src={avatarSrc}
                    alt="User Avatar"
                    className="h-12 w-12 rounded-full border-2 border-white shadow-md object-cover"
                />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-16 w-52 bg-white rounded-xl shadow-xl border border-blue-100 z-[150] overflow-hidden">
                    <button
                        onClick={handleSettings}
                        className="flex items-center w-full px-5 py-4 text-left text-gray-700 hover:bg-blue-50 transition-colors"
                    >
                        <Settings size={20} className="mr-3 text-blue-500" />
                        <span className="font-medium">Cài đặt</span>
                    </button>
                    <div className="border-t border-blue-100"></div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-5 py-4 text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={20} className="mr-3" />
                        <span className="font-medium">Đăng xuất</span>
                    </button>
                </div>
            )}

            {/* Settings Modal */}
            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
            />
        </div>
    );
};

export default AvatarDropdown;
