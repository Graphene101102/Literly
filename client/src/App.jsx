import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import StartScreen from './pages/user/StartScreen';
import AuthScreen from './pages/user/AuthScreen';
import HomePageLessons from './pages/user/HomePageLessons';
import HomePageExercises from './pages/user/HomePageExercises';
import ExerciseDetail from './pages/user/ExerciseDetail';
import HomePageDocuments from './pages/user/HomePageDocuments';
import CorpusGenre from './pages/user/CorpusGenre';
import VietnameseKnowledge from './pages/user/VietnameseKnowledge';
import ReferenceArticles from './pages/user/ReferenceArticles';

// Admin Pages
import StudentManagement from './pages/admin/StudentManagement';
import LessonManagement from './pages/admin/LessonManagement';
import ExerciseManagement from './pages/admin/ExerciseManagement';
import ExerciseDetailManagement from './pages/admin/ExerciseDetailManagement';
import DocumentManagement from './pages/admin/DocumentManagement';
import DocumentCorpusGenreManagement from './pages/admin/DocumentCorpusGenreManagement';
import DocumentVietnameseKnowledgeManagement from './pages/admin/DocumentVietnameseKnowledgeManagement';
import DocumentReferenceArticlesManagement from './pages/admin/DocumentReferenceArticlesManagement';
import Statistics from './pages/admin/Statistics';

import './App.css';

function App() {
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    // This function might be removed or adapted as the Header for Admin will be different
    switch (tab) {
      case 'BÀI HỌC':
        navigate('/lessons');
        break;
      case 'BÀI TẬP':
        navigate('/exercises');
        break;
      case 'TÀI LIỆU':
        navigate('/documents');
        break;
      default:
        navigate('/lessons');
    }
  };

  return (
    <Routes>
      {/* Student/Public Routes */}
      <Route path="/" element={<StartScreen />} />
      <Route path="/auth" element={<AuthScreen />} />
      <Route path="/lessons" element={<HomePageLessons />} />
      <Route path="/exercises" element={<HomePageExercises />} />
      <Route path="/exercises/:id" element={<ExerciseDetail />} />
      <Route path="/documents" element={<HomePageDocuments />} />
      <Route path="/documents/corpus-genre" element={<CorpusGenre />} />
      <Route path="/documents/vietnamese-knowledge" element={<VietnameseKnowledge />} />
      <Route path="/documents/reference-articles" element={<ReferenceArticles />} />

      {/* Admin Routes */}
      <Route path="/admin/students" element={<StudentManagement />} />
      <Route path="/admin/lessons" element={<LessonManagement />} />
      <Route path="/admin/exercises" element={<ExerciseManagement />} />
      <Route path="/admin/exercises/:id" element={<ExerciseDetailManagement />} />
      <Route path="/admin/documents" element={<DocumentManagement />} />
      <Route path="/admin/documents/corpus-genre" element={<DocumentCorpusGenreManagement />} />
      <Route path="/admin/documents/vietnamese-knowledge" element={<DocumentVietnameseKnowledgeManagement />} />
      <Route path="/admin/documents/reference-articles" element={<DocumentReferenceArticlesManagement />} />
      <Route path="/admin/statistics" element={<Statistics />} />
    </Routes>
  );
}

export default App;