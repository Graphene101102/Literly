import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    getDocuments, getDocumentById, createDocument, updateDocument, deleteDocument
} from '../controllers/documentController.js';
import { protect, admin } from '../middleware/auth.js';

// Multer config for PDF
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/documents/'),
    filename: (req, file, cb) => {
        const unique = `doc-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, unique);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file PDF'), false);
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

const router = express.Router();

router.route('/')
    .get(protect, getDocuments)
    .post(protect, admin, upload.single('file'), createDocument);

router.route('/:id')
    .get(protect, getDocumentById)
    .put(protect, admin, upload.single('file'), updateDocument)
    .delete(protect, admin, deleteDocument);

export default router;
