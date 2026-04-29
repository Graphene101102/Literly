import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const manageAdmin = async () => {
    try {
        await connectDB();
        
        // Cập nhật lại mật khẩu cho tài khoản 'admin' mặc định
        let origAdmin = await User.findOne({ username: 'admin' });
        if (origAdmin) {
            origAdmin.password = '123';
            await origAdmin.save();
            console.log(`Đã khôi phục mật khẩu cho tài khoản 'admin' thành: 123`);
        } else {
            await User.create({
                username: 'admin',
                password: '123',
                fullName: 'Admin Literly',
                role: 'admin',
                gender: 'Khác'
            });
            console.log(`Đã tạo lại tài khoản 'admin' với mật khẩu: 123`);
        }

        // Tạo thêm một tài khoản admin dự phòng
        let admin2 = await User.findOne({ username: 'admin2' });
        if (!admin2) {
            await User.create({
                username: 'admin2',
                password: '123',
                fullName: 'Admin Dự Phòng',
                role: 'admin',
                gender: 'Khác'
            });
            console.log(`Đã tạo tài khoản admin dự phòng: admin2 / 123`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Lỗi:', error);
        process.exit(1);
    }
};

manageAdmin();
