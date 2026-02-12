import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['CORPUS', 'KNOWLEDGE', 'REFERENCE'],
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Document', DocumentSchema);
