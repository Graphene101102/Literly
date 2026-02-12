import mongoose from 'mongoose';

// Bài tập nhỏ - thuộc về 1 bài tập lớn
const ExerciseItemSchema = new mongoose.Schema({
    exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['document', 'multiple_choice', 'essay'],
        required: true
    },
    // Dùng cho document: nội dung đọc
    content: {
        type: String,
        default: ''
    },
    // Dùng cho multiple_choice: 1 câu hỏi, 4 đáp án
    questionText: {
        type: String,
        default: ''
    },
    optionA: { type: String, default: '' },
    optionB: { type: String, default: '' },
    optionC: { type: String, default: '' },
    optionD: { type: String, default: '' },
    correctAnswer: {
        type: String,
        enum: ['A', 'B', 'C', 'D', ''],
        default: ''
    },
    // Dùng cho essay: đề bài
    essayPrompt: {
        type: String,
        default: ''
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('ExerciseItem', ExerciseItemSchema);
