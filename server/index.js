import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// ES Module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
import authRoutes from './routes/auth.js';
import classRoutes from './routes/classes.js';
import lessonRoutes from './routes/lessons.js';
import lessonGroupRoutes from './routes/lessonGroups.js';
import exerciseRoutes from './routes/exercises.js';
import documentRoutes from './routes/documents.js';
import submissionRoutes from './routes/submissions.js';
import adminRoutes from './routes/admin.js';
import chatRoutes from './routes/chat.js';

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/lesson-groups', lessonGroupRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
