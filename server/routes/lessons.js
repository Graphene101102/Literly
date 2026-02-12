import express from 'express';
import Lesson from '../models/Lesson.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all lessons (for student frontend)
// @route   GET /api/lessons
router.get('/', protect, async (req, res) => {
    try {
        const lessons = await Lesson.find({}).populate('lessonGroup', 'name').sort({ order: 1 });
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get a lesson by ID
// @route   GET /api/lessons/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).populate('lessonGroup', 'name');
        if (lesson) {
            res.json(lesson);
        } else {
            res.status(404).json({ message: 'Lesson not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
