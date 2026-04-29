import mongoose from 'mongoose';

const LessonGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    allowedClasses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    }]
}, { timestamps: true });

export default mongoose.model('LessonGroup', LessonGroupSchema);
