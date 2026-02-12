import React, { useState, useEffect, useRef } from 'react';
import { X, Camera } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DefaultAvatar from '../assets/user-avatar.png';

const API_BASE = 'http://localhost:5001';

const SettingsModal = ({ isOpen, onClose }) => {
    const { user, refreshUser } = useAuth();
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('Khác');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user && isOpen) {
            setFullName(user.fullName || '');
            setUsername(user.username || '');
            setGender(user.gender || 'Khác');
            setAvatarPreview(user.avatar ? `${API_BASE}${user.avatar}` : null);
            setPassword('');
            setMessage('');
            setError('');
        }
    }, [user, isOpen]);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);

        // Upload
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const { data } = await api.post('/auth/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage(data.message || 'Ảnh đại diện đã được cập nhật!');
            await refreshUser(); // Cập nhật avatar trên header ngay
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể upload ảnh.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setSaving(true);

        try {
            const payload = { fullName, username, gender };
            if (password.trim() !== '') {
                payload.password = password;
            }

            const { data } = await api.put('/auth/profile', payload);
            setMessage(data.message || 'Cập nhật thành công!');
            setPassword('');
            await refreshUser(); // Cập nhật tên trên header ngay
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể cập nhật thông tin.');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border-2 border-blue-200 overflow-hidden">
                {/* Header */}
                <div className="bg-blue-400 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">⚙️ Cài đặt tài khoản</h2>
                    <button onClick={onClose} className="text-white hover:text-blue-100 transition-colors">
                        <X size={28} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-5 bg-blue-50">
                    {message && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg text-center font-medium">
                            ✅ {message}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-center font-medium">
                            ❌ {error}
                        </div>
                    )}

                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                            <img
                                src={avatarPreview || DefaultAvatar}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full object-cover border-4 border-blue-300 shadow-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={28} className="text-white" />
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                        <p className="text-sm text-blue-600 mt-2 font-medium cursor-pointer hover:underline" onClick={() => fileInputRef.current.click()}>
                            Nhấn để thay đổi ảnh đại diện
                        </p>
                    </div>

                    {/* Họ và tên */}
                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Họ và tên</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                            required
                        />
                    </div>

                    {/* Tên đăng nhập */}
                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Tên đăng nhập</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                            required
                        />
                    </div>

                    {/* Mật khẩu mới */}
                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Mật khẩu mới <span className="text-gray-400 font-normal">(để trống nếu không đổi)</span></label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu mới..."
                            className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                        />
                    </div>

                    {/* Giới tính */}
                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Giới tính</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                        >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>

                    {/* Role (read-only) */}
                    <div>
                        <label className="block text-sm font-semibold text-blue-800 mb-1">Vai trò</label>
                        <input
                            type="text"
                            value={user?.role === 'admin' ? 'Quản trị viên' : 'Học sinh'}
                            disabled
                            className="w-full border border-gray-200 p-3 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors font-medium"
                        >
                            Đóng
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-md transition-colors disabled:bg-gray-400"
                        >
                            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsModal;
