import Document from '../models/Document.js';
import fs from 'fs';
import path from 'path';

// GET /api/documents?category=CORPUS
export const getDocuments = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        const documents = await Document.find(filter).sort({ createdAt: -1 });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/documents/:id
export const getDocumentById = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);
        if (doc) {
            res.json(doc);
        } else {
            res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/documents (multipart/form-data: file + title + category)
export const createDocument = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Vui lòng tải lên file PDF' });

        const { title, category } = req.body;
        if (!title) return res.status(400).json({ message: 'Tiêu đề không được để trống' });
        if (!category) return res.status(400).json({ message: 'Danh mục không được để trống' });

        const fileUrl = `/uploads/documents/${req.file.filename}`;
        const document = await Document.create({ title, category, fileUrl });
        res.status(201).json(document);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT /api/documents/:id (optionally upload new file)
export const updateDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) return res.status(404).json({ message: 'Không tìm thấy tài liệu' });

        document.title = req.body.title || document.title;
        document.category = req.body.category || document.category;

        if (req.file) {
            // Delete old file
            const oldPath = path.join(process.cwd(), document.fileUrl);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            document.fileUrl = `/uploads/documents/${req.file.filename}`;
        }

        const updated = await document.save();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE /api/documents/:id
export const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) return res.status(404).json({ message: 'Không tìm thấy tài liệu' });

        // Delete file
        const filePath = path.join(process.cwd(), document.fileUrl);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await document.deleteOne();
        res.json({ message: 'Đã xóa tài liệu' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
