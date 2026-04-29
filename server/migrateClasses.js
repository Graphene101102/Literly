import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Class from './models/Class.js';
import User from './models/User.js';
import LessonGroup from './models/LessonGroup.js';
import connectDB from './config/db.js';

dotenv.config();

const migrate = async () => {
    try {
        await connectDB();

        // 1. Ensure 6A1 and 6A2 exist
        let class6A1 = await Class.findOne({ name: '6A1' });
        if (!class6A1) class6A1 = await Class.create({ name: '6A1', description: 'Lớp 6A1' });

        let class6A2 = await Class.findOne({ name: '6A2' });
        if (!class6A2) class6A2 = await Class.create({ name: '6A2', description: 'Lớp 6A2' });

        // 2. Assign existing students to 6A1
        await User.updateMany({ role: 'student' }, { class: class6A1._id });
        console.log('Đã cập nhật tất cả học sinh vào lớp 6A1.');

        // 3. Assign all existing LessonGroups to only allow 6A1 and 6A2
        await LessonGroup.updateMany({}, { allowedClasses: [class6A1._id, class6A2._id] });
        console.log('Đã cập nhật các nhóm bài học chỉ hiển thị cho lớp 6A1 và 6A2.');

        console.log('Migration hoàn tất!');
        process.exit(0);
    } catch (error) {
        console.error('Lỗi migration:', error);
        process.exit(1);
    }
};

migrate();
