import Class from '../models/Class.js';
import User from '../models/User.js';

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private
export const getClasses = async (req, res) => {
    try {
        const classes = await Class.find({});
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a class
// @route   POST /api/classes
// @access  Private/Admin
export const createClass = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Tên lớp không được để trống' });
        }

        const exists = await Class.findOne({ name: name.trim() });
        if (exists) {
            return res.status(400).json({ message: 'Lớp đã tồn tại' });
        }

        const newClass = await Class.create({ name: name.trim() });
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a class
// @route   PUT /api/classes/:id
// @access  Private/Admin
export const updateClass = async (req, res) => {
    try {
        const { name } = req.body;
        const classItem = await Class.findById(req.params.id);

        if (classItem) {
            classItem.name = name;
            const updatedClass = await classItem.save();
            res.json(updatedClass);
        } else {
            res.status(404).json({ message: 'Không tìm thấy lớp' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a class AND all students in the class
// @route   DELETE /api/classes/:id
// @access  Private/Admin
export const deleteClass = async (req, res) => {
    try {
        const classItem = await Class.findById(req.params.id);

        if (classItem) {
            // Delete all students in this class
            await User.deleteMany({ class: classItem._id, role: 'student' });
            await classItem.deleteOne();
            res.json({ message: 'Đã xóa lớp và tất cả học sinh trong lớp' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy lớp' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============ STUDENT MANAGEMENT ============

// @desc    Get students in a class
// @route   GET /api/classes/:id/students
// @access  Private/Admin
export const getStudentsByClass = async (req, res) => {
    try {
        const students = await User.find({ class: req.params.id, role: 'student' })
            .select('-password')
            .sort({ fullName: 1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a student to a class (creates a new user)
// @route   POST /api/classes/:id/students
// @access  Private/Admin
export const addStudentToClass = async (req, res) => {
    try {
        const { username, password, fullName, gender } = req.body;

        if (!username || !password || !fullName) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ: Tên đăng nhập, Mật khẩu, Họ và tên' });
        }

        // Check class exists
        const classItem = await Class.findById(req.params.id);
        if (!classItem) {
            return res.status(404).json({ message: 'Không tìm thấy lớp' });
        }

        // Check username uniqueness
        const exists = await User.findOne({ username });
        if (exists) {
            return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
        }

        const student = await User.create({
            username,
            password,
            fullName,
            gender: gender || 'Khác',
            role: 'student',
            class: req.params.id
        });

        res.status(201).json({
            _id: student._id,
            username: student.username,
            fullName: student.fullName,
            gender: student.gender,
            role: student.role,
            class: req.params.id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a student
// @route   PUT /api/classes/:classId/students/:studentId
// @access  Private/Admin
export const updateStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.studentId);

        if (!student || student.role !== 'student') {
            return res.status(404).json({ message: 'Không tìm thấy học sinh' });
        }

        student.fullName = req.body.fullName || student.fullName;
        student.username = req.body.username || student.username;
        student.gender = req.body.gender || student.gender;

        if (req.body.password && req.body.password.trim() !== '') {
            student.password = req.body.password;
        }

        const updated = await student.save();

        res.json({
            _id: updated._id,
            username: updated.username,
            fullName: updated.fullName,
            gender: updated.gender,
            role: updated.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a student
// @route   DELETE /api/classes/:classId/students/:studentId
// @access  Private/Admin
export const deleteStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.studentId);

        if (!student || student.role !== 'student') {
            return res.status(404).json({ message: 'Không tìm thấy học sinh' });
        }

        await student.deleteOne();
        res.json({ message: 'Đã xóa học sinh' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
