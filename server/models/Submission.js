import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
    exerciseItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExerciseItem',
        required: true
    },
    itemType: {
        type: String,
        enum: ['document', 'multiple_choice', 'essay'],
        required: true
    },
    // Trắc nghiệm
    selectedAnswer: { type: String, default: '' },
    isCorrect: { type: Boolean, default: false },
    // Tự luận
    essayAnswer: { type: String, default: '' },
    essayScore: { type: Number, default: null } // null = chưa chấm
});

const SubmissionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
    answers: [AnswerSchema],
    // Điểm tự động (chỉ trắc nghiệm)
    mcCorrect: { type: Number, default: 0 },
    mcTotal: { type: Number, default: 0 },
    mcScore: { type: Number, default: 0 }, // (mcCorrect/mcTotal)*10
    // Tự luận
    hasEssay: { type: Boolean, default: false },
    essayGraded: { type: Boolean, default: false },
    // Tổng điểm (chỉ tính khi tất cả tự luận đã chấm)
    totalScore: { type: Number, default: null }, // null = chưa đủ điểm
    // Trạng thái
    status: {
        type: String,
        enum: ['completed', 'needs_grading'],
        default: 'completed'
    }
}, { timestamps: true });

export default mongoose.model('Submission', SubmissionSchema);
