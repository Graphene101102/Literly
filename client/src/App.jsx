import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthScreen from './pages/user/AuthScreen';
import HomePageLessons from './pages/user/HomePageLessons';
import LessonDetail from './pages/user/LessonDetail';
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
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center text-2xl font-bold text-blue-800">Đang tải...</div>;
  }

  return (
    <Routes>
      {/* Auth Route - redirect if already logged in */}
      <Route
        path="/"
        element={
          user
            ? <Navigate to={user.role === 'admin' ? '/admin/students' : '/lessons'} replace />
            : <AuthScreen />
        }
      />
      <Route
        path="/auth"
        element={
          user
            ? <Navigate to={user.role === 'admin' ? '/admin/students' : '/lessons'} replace />
            : <AuthScreen />
        }
      />

      {/* Student/Public Routes */}
      <Route path="/lessons" element={<HomePageLessons />} />
      <Route path="/lesson/:id" element={<LessonDetail />} />
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