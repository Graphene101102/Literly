import express from 'express';
import Exercise from '../models/Exercise.js';
import ExerciseItem from '../models/ExerciseItem.js';
import { getExerciseItems, createExerciseItem, updateExerciseItem, deleteExerciseItem } from '../controllers/exerciseController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Student: Get all exercises (grouped)
router.get('/', protect, async (req, res) => {
    try {
        const exercises = await Exercise.find({}).populate('lessonGroup', 'name').sort({ order: 1 });
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Student: Get single exercise + items (with shuffled options)
router.get('/:id', protect, async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id).populate('lessonGroup', 'name');
        if (!exercise) return res.status(404).json({ message: 'Exercise not found' });

        const items = await ExerciseItem.find({ exercise: exercise._id }).sort({ order: 1 });

        // Shuffle options for multiple choice items
        const shuffledItems = items.map(item => {
            const obj = item.toObject();
            if (obj.type === 'multiple_choice') {
                const options = [
                    { key: 'A', text: obj.optionA },
                    { key: 'B', text: obj.optionB },
                    { key: 'C', text: obj.optionC },
                    { key: 'D', text: obj.optionD }
                ];
                for (let i = options.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [options[i], options[j]] = [options[j], options[i]];
                }
                obj.shuffledOptions = options;
            }
            return obj;
        });

        res.json({ ...exercise.toObject(), items: shuffledItems });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: Exercise Items CRUD
router.route('/:id/items')
    .get(protect, getExerciseItems)
    .post(protect, admin, createExerciseItem);

router.route('/:exerciseId/items/:itemId')
    .put(protect, admin, updateExerciseItem)
    .delete(protect, admin, deleteExerciseItem);

export default router;
