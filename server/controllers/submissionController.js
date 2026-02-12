import Submission from '../models/Submission.js';
import Exercise from '../models/Exercise.js';
import ExerciseItem from '../models/ExerciseItem.js';
import User from '../models/User.js';
import Class from '../models/Class.js';
import LessonGroup from '../models/LessonGroup.js';

// ============ STUDENT: Nộp bài ============
// POST /api/submissions
export const submitExercise = async (req, res) => {
    try {
        const { exerciseId, answers } = req.body;
        // answers: [{ exerciseItemId, selectedAnswer (for MC), essayAnswer (for essay) }]

        const exercise = await Exercise.findById(exerciseId);
        if (!exercise) return res.status(404).json({ message: 'Không tìm thấy bài tập' });

        // Check if already submitted
        const existing = await Submission.findOne({ student: req.user._id, exercise: exerciseId });
        if (existing) return res.status(400).json({ message: 'Bạn đã nộp bài này rồi' });

        // Get all items for this exercise
        const items = await ExerciseItem.find({ exercise: exerciseId });
        const itemMap = {};
        items.forEach(i => { itemMap[i._id.toString()] = i; });

        let mcCorrect = 0;
        let mcTotal = 0;
        let hasEssay = false;
        const processedAnswers = [];

        for (const ans of answers) {
            const item = itemMap[ans.exerciseItemId];
            if (!item) continue;

            if (item.type === 'multiple_choice') {
                mcTotal++;
                const isCorrect = item.correctAnswer === ans.selectedAnswer;
                if (isCorrect) mcCorrect++;
                processedAnswers.push({
                    exerciseItem: item._id,
                    itemType: 'multiple_choice',
                    selectedAnswer: ans.selectedAnswer,
                    isCorrect
                });
            } else if (item.type === 'essay') {
                hasEssay = true;
                processedAnswers.push({
                    exerciseItem: item._id,
                    itemType: 'essay',
                    essayAnswer: ans.essayAnswer || '',
                    essayScore: null
                });
            } else if (item.type === 'document') {
                processedAnswers.push({
                    exerciseItem: item._id,
                    itemType: 'document'
                });
            }
        }

        const mcScore = mcTotal > 0 ? Math.round((mcCorrect / mcTotal) * 100) / 10 : 0;
        const status = hasEssay ? 'needs_grading' : 'completed';
        const totalScore = hasEssay ? null : mcScore;

        const submission = await Submission.create({
            student: req.user._id,
            exercise: exerciseId,
            answers: processedAnswers,
            mcCorrect, mcTotal, mcScore,
            hasEssay, essayGraded: false,
            totalScore, status
        });

        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/submissions/my
export const getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ student: req.user._id })
            .populate('exercise', 'title lessonGroup')
            .sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ============ ADMIN: Thống kê ============

// GET /api/submissions/statistics
// Trả về: classes -> lessonGroups -> tiến độ
export const getStatistics = async (req, res) => {
    try {
        const classes = await Class.find({}).sort({ name: 1 });
        const lessonGroups = await LessonGroup.find({}).sort({ createdAt: 1 });
        const exercises = await Exercise.find({}).populate('lessonGroup', 'name');

        const result = [];

        for (const cls of classes) {
            const students = await User.find({ class: cls._id, role: 'student' }).select('_id fullName');
            const studentIds = students.map(s => s._id);

            const groupStats = [];
            for (const lg of lessonGroups) {
                // Exercises in this lesson group
                const exIds = exercises.filter(e => e.lessonGroup?._id?.toString() === lg._id.toString()).map(e => e._id);

                if (exIds.length === 0) {
                    groupStats.push({ lessonGroup: lg, total: students.length, completed: 0, needsGrading: 0 });
                    continue;
                }

                // Count submissions from students in this class for exercises in this group
                const submissions = await Submission.find({
                    student: { $in: studentIds },
                    exercise: { $in: exIds }
                });

                const studentsWithSubmissions = new Set(submissions.map(s => s.student.toString()));
                const needsGrading = submissions.filter(s => s.status === 'needs_grading').length;

                groupStats.push({
                    lessonGroup: lg,
                    total: students.length,
                    completed: studentsWithSubmissions.size,
                    needsGrading
                });
            }

            result.push({
                class: cls,
                students: students.length,
                groups: groupStats
            });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/submissions/class/:classId/group/:groupId
// Danh sách học sinh + điểm cho 1 lớp + 1 lesson group
export const getClassGroupDetail = async (req, res) => {
    try {
        const { classId, groupId } = req.params;

        const students = await User.find({ class: classId, role: 'student' }).select('_id fullName username').sort({ fullName: 1 });
        const exercises = await Exercise.find({ lessonGroup: groupId }).select('_id title');
        const exIds = exercises.map(e => e._id);

        const studentDetails = [];

        for (const student of students) {
            const submissions = await Submission.find({
                student: student._id,
                exercise: { $in: exIds }
            }).populate('exercise', 'title');

            let status = 'not_started'; // đỏ
            let totalScore = null;

            if (submissions.length > 0) {
                const hasUngraded = submissions.some(s => s.status === 'needs_grading');
                if (hasUngraded) {
                    status = 'needs_grading'; // vàng
                } else {
                    status = 'completed'; // xanh
                    // Tính trung bình điểm
                    const scores = submissions.filter(s => s.totalScore !== null).map(s => s.totalScore);
                    totalScore = scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : null;
                }
            }

            studentDetails.push({
                student,
                submissions,
                status,
                totalScore
            });
        }

        res.json({ students: studentDetails, exercises });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/submissions/:submissionId/detail
// Chi tiết bài làm 1 HS
export const getSubmissionDetail = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.submissionId)
            .populate('student', 'fullName username')
            .populate('exercise', 'title');

        if (!submission) return res.status(404).json({ message: 'Không tìm thấy bài nộp' });

        // Populate exercise items
        const itemIds = submission.answers.map(a => a.exerciseItem);
        const items = await ExerciseItem.find({ _id: { $in: itemIds } });
        const itemMap = {};
        items.forEach(i => { itemMap[i._id.toString()] = i; });

        const detailedAnswers = submission.answers.map(a => ({
            ...a.toObject(),
            itemDetail: itemMap[a.exerciseItem.toString()] || null
        }));

        res.json({
            ...submission.toObject(),
            answers: detailedAnswers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/submissions/:submissionId/grade-essay
// GV chấm điểm tự luận
export const gradeEssay = async (req, res) => {
    try {
        const { grades } = req.body;
        // grades: [{ answerId, essayScore }]

        const submission = await Submission.findById(req.params.submissionId);
        if (!submission) return res.status(404).json({ message: 'Không tìm thấy bài nộp' });

        for (const grade of grades) {
            const answer = submission.answers.id(grade.answerId);
            if (answer && answer.itemType === 'essay') {
                answer.essayScore = grade.essayScore;
            }
        }

        // Check if all essays are graded
        const essayAnswers = submission.answers.filter(a => a.itemType === 'essay');
        const allGraded = essayAnswers.every(a => a.essayScore !== null && a.essayScore !== undefined);

        submission.essayGraded = allGraded;

        if (allGraded) {
            submission.status = 'completed';
            // Tính tổng điểm: trắc nghiệm + tự luận
            // Điểm = trung bình các điểm (MC score hệ 10 + essay scores hệ 10)
            const mcItems = submission.answers.filter(a => a.itemType === 'multiple_choice').length;
            const essayItems = essayAnswers.length;
            const totalItems = mcItems + essayItems;

            if (totalItems > 0) {
                const mcPoints = submission.mcCorrect; // số câu đúng
                const essayPoints = essayAnswers.reduce((sum, a) => sum + (a.essayScore || 0), 0);
                // MC: mỗi câu đúng = 10/mcTotal điểm → tổng MC = mcCorrect * (10/mcTotal)
                // Essay: mỗi bài GV cho điểm /10
                // Tổng = trung bình tất cả
                const mcScoreWeighted = submission.mcTotal > 0 ? (submission.mcCorrect / submission.mcTotal) * 10 : 0;
                const essayScoreWeighted = essayItems > 0 ? essayPoints / essayItems : 0;
                const totalScoring = (submission.mcTotal > 0 ? 1 : 0) + (essayItems > 0 ? 1 : 0);
                submission.totalScore = totalScoring > 0
                    ? Math.round(((mcScoreWeighted * (submission.mcTotal > 0 ? 1 : 0) + essayScoreWeighted * (essayItems > 0 ? 1 : 0)) / totalScoring) * 10) / 10
                    : 0;
            }
        }

        await submission.save();
        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/submissions (Admin - get all)
export const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({})
            .populate('student', 'username fullName class')
            .populate('exercise', 'title lessonGroup')
            .sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
