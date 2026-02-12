import express from 'express';
import {
    getClasses, createClass, updateClass, deleteClass,
    getStudentsByClass, addStudentToClass, updateStudent, deleteStudent
} from '../controllers/classController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Class routes
router.route('/')
    .get(protect, getClasses)
    .post(protect, admin, createClass);

router.route('/:id')
    .put(protect, admin, updateClass)
    .delete(protect, admin, deleteClass);

// Student routes (nested under class)
router.route('/:id/students')
    .get(protect, admin, getStudentsByClass)
    .post(protect, admin, addStudentToClass);

router.route('/:classId/students/:studentId')
    .put(protect, admin, updateStudent)
    .delete(protect, admin, deleteStudent);

export default router;
