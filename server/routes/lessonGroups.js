import express from 'express';
import {
    getLessonGroups, createLessonGroup, updateLessonGroup, deleteLessonGroup,
    getLessonsByGroup, createLesson, updateLesson, deleteLesson
} from '../controllers/lessonController.js';
import {
    getExercisesByGroup, createExercise, updateExercise, deleteExercise,
    getExerciseItems, createExerciseItem, updateExerciseItem, deleteExerciseItem
} from '../controllers/exerciseController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// ======= Lesson Group =======
router.route('/')
    .get(protect, getLessonGroups)
    .post(protect, admin, createLessonGroup);

router.route('/:id')
    .put(protect, admin, updateLessonGroup)
    .delete(protect, admin, deleteLessonGroup);

// ======= Sub-lessons =======
router.route('/:id/lessons')
    .get(protect, getLessonsByGroup)
    .post(protect, admin, createLesson);

router.route('/:groupId/lessons/:lessonId')
    .put(protect, admin, updateLesson)
    .delete(protect, admin, deleteLesson);

// ======= Big Exercises =======
router.route('/:id/exercises')
    .get(protect, getExercisesByGroup)
    .post(protect, admin, createExercise);

router.route('/:groupId/exercises/:exerciseId')
    .put(protect, admin, updateExercise)
    .delete(protect, admin, deleteExercise);

export default router;
