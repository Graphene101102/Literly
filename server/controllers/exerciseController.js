import Exercise from '../models/Exercise.js';
import ExerciseItem from '../models/ExerciseItem.js';
import LessonGroup from '../models/LessonGroup.js';

// ============ BÀI TẬP LỚN ============

// GET /api/lesson-groups/:id/exercises
export const getExercisesByGroup = async (req, res) => {
    try {
        const exercises = await Exercise.find({ lessonGroup: req.params.id }).sort({ order: 1 });
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/lesson-groups/:id/exercises
export const createExercise = async (req, res) => {
    try {
        const group = await LessonGroup.findById(req.params.id);
        if (!group) return res.status(404).json({ message: 'Không tìm thấy nhóm bài học' });

        const { title, order } = req.body;
        if (!title) return res.status(400).json({ message: 'Tiêu đề không được để trống' });

        const exercise = await Exercise.create({
            title, order: order || 0, lessonGroup: group._id
        });
        res.status(201).json(exercise);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/lesson-groups/:groupId/exercises/:exerciseId
export const updateExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.exerciseId);
        if (!exercise) return res.status(404).json({ message: 'Không tìm thấy bài tập' });

        exercise.title = req.body.title ?? exercise.title;
        exercise.order = req.body.order ?? exercise.order;
        const updated = await exercise.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/lesson-groups/:groupId/exercises/:exerciseId
export const deleteExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.exerciseId);
        if (!exercise) return res.status(404).json({ message: 'Không tìm thấy bài tập' });

        // Xóa tất cả bài tập nhỏ
        await ExerciseItem.deleteMany({ exercise: exercise._id });
        await exercise.deleteOne();
        res.json({ message: 'Đã xóa bài tập và tất cả bài tập nhỏ' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============ BÀI TẬP NHỎ ============

// GET /api/exercises/:id/items
export const getExerciseItems = async (req, res) => {
    try {
        const items = await ExerciseItem.find({ exercise: req.params.id }).sort({ order: 1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/exercises/:id/items
export const createExerciseItem = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) return res.status(404).json({ message: 'Không tìm thấy bài tập lớn' });

        const { title, type, content, questionText, optionA, optionB, optionC, optionD, correctAnswer, essayPrompt, order } = req.body;
        if (!title) return res.status(400).json({ message: 'Tiêu đề không được để trống' });
        if (!type) return res.status(400).json({ message: 'Loại bài tập không được để trống' });

        const item = await ExerciseItem.create({
            exercise: exercise._id,
            title, type,
            content: content || '',
            questionText: questionText || '',
            optionA: optionA || '', optionB: optionB || '',
            optionC: optionC || '', optionD: optionD || '',
            correctAnswer: correctAnswer || '',
            essayPrompt: essayPrompt || '',
            order: order || 0
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/exercises/:exerciseId/items/:itemId
export const updateExerciseItem = async (req, res) => {
    try {
        const item = await ExerciseItem.findById(req.params.itemId);
        if (!item) return res.status(404).json({ message: 'Không tìm thấy bài tập nhỏ' });

        item.title = req.body.title ?? item.title;
        item.type = req.body.type ?? item.type;
        item.content = req.body.content ?? item.content;
        item.questionText = req.body.questionText ?? item.questionText;
        item.optionA = req.body.optionA ?? item.optionA;
        item.optionB = req.body.optionB ?? item.optionB;
        item.optionC = req.body.optionC ?? item.optionC;
        item.optionD = req.body.optionD ?? item.optionD;
        item.correctAnswer = req.body.correctAnswer ?? item.correctAnswer;
        item.essayPrompt = req.body.essayPrompt ?? item.essayPrompt;
        item.order = req.body.order ?? item.order;

        const updated = await item.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/exercises/:exerciseId/items/:itemId
export const deleteExerciseItem = async (req, res) => {
    try {
        const item = await ExerciseItem.findById(req.params.itemId);
        if (!item) return res.status(404).json({ message: 'Không tìm thấy bài tập nhỏ' });

        await item.deleteOne();
        res.json({ message: 'Đã xóa bài tập nhỏ' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
