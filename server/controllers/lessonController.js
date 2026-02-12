import LessonGroup from '../models/LessonGroup.js';
import Lesson from '../models/Lesson.js';

// ============ LESSON GROUP (BÀI HỌC LỚN) ============

// @desc    Get all lesson groups
// @route   GET /api/lesson-groups
export const getLessonGroups = async (req, res) => {
    try {
        const groups = await LessonGroup.find({}).sort({ createdAt: 1 });
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a lesson group
// @route   POST /api/lesson-groups
export const createLessonGroup = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Tên nhóm bài học không được để trống' });
        }
        const exists = await LessonGroup.findOne({ name: name.trim() });
        if (exists) {
            return res.status(400).json({ message: 'Nhóm bài học đã tồn tại' });
        }
        const group = await LessonGroup.create({ name: name.trim() });
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a lesson group name
// @route   PUT /api/lesson-groups/:id
export const updateLessonGroup = async (req, res) => {
    try {
        const group = await LessonGroup.findById(req.params.id);
        if (!group) return res.status(404).json({ message: 'Không tìm thấy nhóm' });

        group.name = req.body.name || group.name;
        const updated = await group.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a lesson group AND all its sub-lessons
// @route   DELETE /api/lesson-groups/:id
export const deleteLessonGroup = async (req, res) => {
    try {
        const group = await LessonGroup.findById(req.params.id);
        if (!group) return res.status(404).json({ message: 'Không tìm thấy nhóm' });

        await Lesson.deleteMany({ lessonGroup: group._id });
        await group.deleteOne();
        res.json({ message: 'Đã xóa nhóm bài học và tất cả bài học con' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============ SUB-LESSONS (BÀI HỌC NHỎ) ============

// @desc    Get lessons in a group
// @route   GET /api/lesson-groups/:id/lessons
export const getLessonsByGroup = async (req, res) => {
    try {
        const lessons = await Lesson.find({ lessonGroup: req.params.id }).sort({ order: 1 });
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a lesson in a group
// @route   POST /api/lesson-groups/:id/lessons
export const createLesson = async (req, res) => {
    try {
        const group = await LessonGroup.findById(req.params.id);
        if (!group) return res.status(404).json({ message: 'Không tìm thấy nhóm bài học' });

        const { title, type, content, videoUrl, author, description, order } = req.body;

        if (!title) return res.status(400).json({ message: 'Tiêu đề không được để trống' });

        const lesson = await Lesson.create({
            title,
            type: type || 'THEORY',
            content: content || '',
            videoUrl: videoUrl || '',
            author: author || '',
            description: description || '',
            order: order || 0,
            group: group.name,
            lessonGroup: group._id
        });

        res.status(201).json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a lesson
// @route   PUT /api/lesson-groups/:groupId/lessons/:lessonId
export const updateLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.lessonId);
        if (!lesson) return res.status(404).json({ message: 'Không tìm thấy bài học' });

        lesson.title = req.body.title ?? lesson.title;
        lesson.type = req.body.type ?? lesson.type;
        lesson.content = req.body.content ?? lesson.content;
        lesson.videoUrl = req.body.videoUrl ?? lesson.videoUrl;
        lesson.author = req.body.author ?? lesson.author;
        lesson.description = req.body.description ?? lesson.description;
        lesson.order = req.body.order ?? lesson.order;

        const updated = await lesson.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a lesson
// @route   DELETE /api/lesson-groups/:groupId/lessons/:lessonId
export const deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.lessonId);
        if (!lesson) return res.status(404).json({ message: 'Không tìm thấy bài học' });

        await lesson.deleteOne();
        res.json({ message: 'Đã xóa bài học' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
