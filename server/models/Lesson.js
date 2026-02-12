import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        default: ''
    },
    group: {
        type: String,
        default: ''
    },
    lessonGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LessonGroup',
        default: null
    },
    subGroup: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['THEORY', 'PRACTICE', 'VIDEO'],
        default: 'THEORY'
    },
    content: {
        type: String,
        default: ''
    },
    videoUrl: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('Lesson', LessonSchema);
