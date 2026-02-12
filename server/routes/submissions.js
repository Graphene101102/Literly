import express from 'express';
import {
    submitExercise, getMySubmissions, getAllSubmissions,
    getStatistics, getClassGroupDetail,
    getSubmissionDetail, gradeEssay
} from '../controllers/submissionController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Student
router.post('/', protect, submitExercise);
router.get('/my', protect, getMySubmissions);

// Admin
router.get('/statistics', protect, admin, getStatistics);
router.get('/class/:classId/group/:groupId', protect, admin, getClassGroupDetail);
router.get('/:submissionId/detail', protect, admin, getSubmissionDetail);
router.put('/:submissionId/grade-essay', protect, admin, gradeEssay);

// Admin - get all (must be after specific routes)
router.get('/', protect, admin, getAllSubmissions);

export default router;
