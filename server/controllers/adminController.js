import User from '../models/User.js';
import Lesson from '../models/Lesson.js';
import Exercise from '../models/Exercise.js';
import Document from '../models/Document.js';
import Submission from '../models/Submission.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments({ role: 'student' });
        const lessonCount = await Lesson.countDocuments();
        const exerciseCount = await Exercise.countDocuments();
        const documentCount = await Document.countDocuments();
        const submissionCount = await Submission.countDocuments();

        // Optional: Get recent submissions
        const recentSubmissions = await Submission.find({})
            .limit(5)
            .sort({ createdAt: -1 })
            .populate('student', 'fullName')
            .populate('exercise', 'title');

        res.json({
            users: userCount,
            lessons: lessonCount,
            exercises: exerciseCount,
            documents: documentCount,
            submissions: submissionCount,
            recentSubmissions
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
