import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { username, password, fullName, role, classId, gender } = req.body;

        // Validate required fields
        if (!username || !password || !fullName) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ: Tên đăng nhập, Mật khẩu, Họ và tên' });
        }

        // Check if user exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.' });
        }

        // Create user
        const user = await User.create({
            username,
            password,
            fullName,
            role: role || 'student',
            class: classId || null,
            gender: gender || 'Khác'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                role: user.role,
                gender: user.gender,
                avatar: user.avatar,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
        }
    } catch (error) {
        console.error('Register error:', error.message);
        res.status(500).json({ message: 'Lỗi đăng ký: ' + error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username }).populate('class', 'name');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                role: user.role,
                gender: user.gender,
                avatar: user.avatar,
                class: user.class ? user.class.name : null,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password').populate('class', 'name');
    res.status(200).json(user);
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Update allowed fields only (NOT role)
        user.fullName = req.body.fullName || user.fullName;
        user.gender = req.body.gender || user.gender;
        user.username = req.body.username || user.username;

        // Only update password if provided
        if (req.body.password && req.body.password.trim() !== '') {
            user.password = req.body.password; // Will be hashed by pre-save hook
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            fullName: updatedUser.fullName,
            role: updatedUser.role,
            gender: updatedUser.gender,
            message: 'Cập nhật thành công!'
        });
    } catch (error) {
        console.error('Update profile error:', error.message);
        res.status(500).json({ message: 'Lỗi cập nhật: ' + error.message });
    }
};

// @desc    Upload user avatar
// @route   POST /api/auth/avatar
// @access  Private
export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng chọn một file ảnh' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Save avatar path
        user.avatar = `/uploads/avatars/${req.file.filename}`;
        await user.save();

        res.json({
            avatar: user.avatar,
            message: 'Cập nhật ảnh đại diện thành công!'
        });
    } catch (error) {
        console.error('Upload avatar error:', error.message);
        res.status(500).json({ message: 'Lỗi upload: ' + error.message });
    }
};
