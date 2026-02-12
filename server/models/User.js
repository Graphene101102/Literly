import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        // Optional for admin, required for students usually but we can validate in controller
        default: null
    },
    gender: {
        type: String,
        enum: ['Nam', 'Nữ', 'Khác'],
        default: 'Khác'
    },
    avatar: {
        type: String, // URL to avatar image
        default: ''
    }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);
