import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import Sidebar from '../../components/Sidebar';
import EarthBackground from '../../assets/earth-background.png';
import api from '../../services/api';
import { X, Plus, Pencil, Trash2, ArrowLeft, BookOpen } from 'lucide-react';

// ================ POPUP COMPONENT ================
const PopupForm = ({ isOpen, onClose, title, onSubmit, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border-2 border-blue-200 overflow-hidden">
        <div className="bg-blue-400 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-white hover:text-blue-100"><X size={24} /></button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4 bg-blue-50 max-h-[70vh] overflow-y-auto">
          {children}
        </form>
      </div>
    </div>
  );
};

const LessonManagement = () => {
  // ============ STATE ============
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Group popup
  const [showGroupPopup, setShowGroupPopup] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupName, setGroupName] = useState('');

  // Lesson view
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(false);

  // Lesson popup
  const [showLessonPopup, setShowLessonPopup] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: '', type: 'THEORY', content: '', videoUrl: '', author: '', description: '', order: 0
  });

  const [error, setError] = useState('');

  // ============ FETCH GROUPS ============
  useEffect(() => { fetchGroups(); }, []);

  const fetchGroups = async () => {
    try {
      const { data } = await api.get('/lesson-groups');
      setGroups(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ============ GROUP CRUD ============
  const openAddGroup = () => {
    setEditingGroup(null);
    setGroupName('');
    setError('');
    setShowGroupPopup(true);
  };

  const openEditGroup = (g) => {
    setEditingGroup(g);
    setGroupName(g.name);
    setError('');
    setShowGroupPopup(true);
  };

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingGroup) {
        const { data } = await api.put(`/lesson-groups/${editingGroup._id}`, { name: groupName });
        setGroups(groups.map(g => g._id === editingGroup._id ? data : g));
      } else {
        const { data } = await api.post('/lesson-groups', { name: groupName });
        setGroups([...groups, data]);
      }
      setShowGroupPopup(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteGroup = async (id) => {
    if (window.confirm('Xóa nhóm sẽ xóa TẤT CẢ bài học bên trong. Bạn có chắc không?')) {
      try {
        await api.delete(`/lesson-groups/${id}`);
        setGroups(groups.filter(g => g._id !== id));
        if (selectedGroup?._id === id) setSelectedGroup(null);
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi khi xóa');
      }
    }
  };

  // ============ LESSON VIEW ============
  const openGroupLessons = async (g) => {
    setSelectedGroup(g);
    setLoadingLessons(true);
    try {
      const { data } = await api.get(`/lesson-groups/${g._id}/lessons`);
      setLessons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLessons(false);
    }
  };

  const goBackToGroups = () => {
    setSelectedGroup(null);
    setLessons([]);
  };

  // ============ LESSON CRUD ============
  const openAddLesson = () => {
    setEditingLesson(null);
    setLessonForm({ title: '', type: 'THEORY', content: '', videoUrl: '', author: '', description: '', order: 0 });
    setError('');
    setShowLessonPopup(true);
  };

  const openEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title || '',
      type: lesson.type || 'THEORY',
      content: lesson.content || '',
      videoUrl: lesson.videoUrl || '',
      author: lesson.author || '',
      description: lesson.description || '',
      order: lesson.order || 0
    });
    setError('');
    setShowLessonPopup(true);
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingLesson) {
        const { data } = await api.put(`/lesson-groups/${selectedGroup._id}/lessons/${editingLesson._id}`, lessonForm);
        setLessons(lessons.map(l => l._id === editingLesson._id ? data : l));
      } else {
        const { data } = await api.post(`/lesson-groups/${selectedGroup._id}/lessons`, lessonForm);
        setLessons([...lessons, data]);
      }
      setShowLessonPopup(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Bạn có chắc muốn xóa bài học này?')) {
      try {
        await api.delete(`/lesson-groups/${selectedGroup._id}/lessons/${lessonId}`);
        setLessons(lessons.filter(l => l._id !== lessonId));
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi khi xóa');
      }
    }
  };

  const typeLabels = { THEORY: '📖 Lý thuyết', PRACTICE: '✍️ Thực hành', VIDEO: '🎬 Video' };

  // ============ RENDER ============
  return (
    <div className="h-screen w-screen flex flex-col bg-blue-50">
      <AdminHeader />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="relative flex-grow p-8">
          <div className="absolute inset-0 bg-no-repeat bg-center bg-cover" style={{ backgroundImage: `url(${EarthBackground})` }}>
            <div className="w-full h-full bg-white opacity-85"></div>
          </div>

          <div className="relative z-10 bg-red-50 bg-opacity-75 p-8 mt-10 w-full h-4/5 rounded-lg shadow-lg overflow-y-auto">
            {/* ========== GROUP LIST VIEW ========== */}
            {!selectedGroup ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Quản lý Bài học</h2>
                  <button onClick={openAddGroup} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform hover:scale-105">
                    <Plus size={20} className="mr-2" />
                    Thêm Bài học
                  </button>
                </div>

                {loading ? (
                  <div className="text-center text-xl text-gray-600">Đang tải...</div>
                ) : (
                  <div className="space-y-4">
                    {groups.map((g, index) => (
                      <div key={g._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <BookOpen size={22} className="text-blue-500 mr-3" />
                          <span className="text-xl font-medium text-gray-800">{index + 1}. {g.name}</span>
                        </div>
                        <div className="flex space-x-3">
                          <button onClick={() => openEditGroup(g)} className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110" title="Sửa tên">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => openGroupLessons(g)} className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110" title="Xem bài học con">
                            <BookOpen size={18} />
                          </button>
                          <button onClick={() => handleDeleteGroup(g._id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110" title="Xóa nhóm">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {groups.length === 0 && <div className="text-center text-gray-500 italic">Chưa có nhóm bài học nào.</div>}
                  </div>
                )}
              </>
            ) : (
              /* ========== LESSON LIST VIEW ========== */
              <>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <button onClick={goBackToGroups} className="mr-4 p-2 rounded-full hover:bg-blue-200 transition-colors">
                      <ArrowLeft size={24} className="text-blue-600" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedGroup.name} — Bài học nhỏ
                    </h2>
                  </div>
                  <button onClick={openAddLesson} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform hover:scale-105">
                    <Plus size={20} className="mr-2" />
                    Thêm Bài học nhỏ
                  </button>
                </div>

                {loadingLessons ? (
                  <div className="text-center text-xl text-gray-600">Đang tải...</div>
                ) : (
                  <div className="space-y-4">
                    {lessons.map((lesson, index) => (
                      <div key={lesson._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div>
                          <span className="text-xl font-medium text-gray-800 block">
                            {index + 1}. {lesson.title}
                          </span>
                          <span className="text-sm text-gray-500 ml-6 block">
                            {typeLabels[lesson.type] || lesson.type}
                            {lesson.author && ` · Tác giả: ${lesson.author}`}
                          </span>
                        </div>
                        <div className="flex space-x-3">
                          <button onClick={() => openEditLesson(lesson)} className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110" title="Sửa">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => handleDeleteLesson(lesson._id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110" title="Xóa">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {lessons.length === 0 && <div className="text-center text-gray-500 italic">Chưa có bài học nào trong nhóm này.</div>}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ========== GROUP POPUP ========== */}
      <PopupForm
        isOpen={showGroupPopup}
        onClose={() => setShowGroupPopup(false)}
        title={editingGroup ? 'Sửa tên bài học' : 'Thêm bài học mới'}
        onSubmit={handleGroupSubmit}
      >
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-center text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Tên bài học (nhóm)</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="VD: Văn bản 1: Trái Đất - cái nôi của sự sống"
            className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            required
          />
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <button type="button" onClick={() => setShowGroupPopup(false)} className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium">Hủy</button>
          <button type="submit" className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-md">{editingGroup ? 'Lưu' : 'Thêm'}</button>
        </div>
      </PopupForm>

      {/* ========== LESSON POPUP ========== */}
      <PopupForm
        isOpen={showLessonPopup}
        onClose={() => setShowLessonPopup(false)}
        title={editingLesson ? 'Sửa bài học' : 'Thêm bài học nhỏ'}
        onSubmit={handleLessonSubmit}
      >
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-center text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Tiêu đề</label>
          <input type="text" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
            className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Loại</label>
          <select value={lessonForm.type} onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value })}
            className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
            <option value="THEORY">📖 Lý thuyết</option>
            <option value="PRACTICE">✍️ Thực hành</option>
            <option value="VIDEO">🎬 Video</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Tác giả</label>
          <input type="text" value={lessonForm.author} onChange={(e) => setLessonForm({ ...lessonForm, author: e.target.value })}
            placeholder="VD: Nguyễn Văn A" className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Nội dung</label>
          <textarea value={lessonForm.content} onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
            rows={4} placeholder="Nội dung bài học..."
            className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white resize-y" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Link Video (nếu có)</label>
          <input type="text" value={lessonForm.videoUrl} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
            placeholder="https://youtube.com/..." className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Mô tả ngắn</label>
          <input type="text" value={lessonForm.description} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
            className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Thứ tự hiển thị</label>
          <input type="number" value={lessonForm.order} onChange={(e) => setLessonForm({ ...lessonForm, order: parseInt(e.target.value) || 0 })}
            className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <button type="button" onClick={() => setShowLessonPopup(false)} className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium">Hủy</button>
          <button type="submit" className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-md">{editingLesson ? 'Lưu' : 'Thêm'}</button>
        </div>
      </PopupForm>
    </div>
  );
};

export default LessonManagement;
