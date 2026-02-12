import mongoose from 'mongoose';

// Bài tập lớn - chỉ có title, liên kết với LessonGroup
const ExerciseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    lessonGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LessonGroup',
        required: true
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('Exercise', ExerciseSchema);
