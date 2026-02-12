import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import Sidebar from '../../components/Sidebar';
import EarthBackground from '../../assets/earth-background.png';
import api from '../../services/api';
import { X, Plus, Pencil, Trash2, ArrowLeft, BookOpen, FileText, CheckSquare, AlignLeft } from 'lucide-react';

// ================ POPUP ================
const PopupForm = ({ isOpen, onClose, title, onSubmit, children, wide }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} border-2 border-blue-200 overflow-hidden`}>
        <div className="bg-blue-400 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-white hover:text-blue-100"><X size={24} /></button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4 bg-blue-50 max-h-[75vh] overflow-y-auto">
          {children}
        </form>
      </div>
    </div>
  );
};

const ExerciseManagement = () => {
  // ============ STATE ============
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Level 2: Big exercises
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loadingExercises, setLoadingExercises] = useState(false);

  // Level 3: Exercise items
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  // Popup: big exercise
  const [showExPopup, setShowExPopup] = useState(false);
  const [editingEx, setEditingEx] = useState(null);
  const [exForm, setExForm] = useState({ title: '', order: 0 });

  // Popup: exercise item
  const [showItemPopup, setShowItemPopup] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    title: '', type: 'document', content: '', questionText: '',
    optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A',
    essayPrompt: '', order: 0
  });

  const [error, setError] = useState('');

  // ============ FETCH ============
  useEffect(() => { fetchGroups(); }, []);

  const fetchGroups = async () => {
    try { const { data } = await api.get('/lesson-groups'); setGroups(data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // ============ LEVEL 1 → 2: Groups → Big Exercises ============
  const openGroupExercises = async (g) => {
    setSelectedGroup(g);
    setSelectedExercise(null);
    setLoadingExercises(true);
    try { const { data } = await api.get(`/lesson-groups/${g._id}/exercises`); setExercises(data); }
    catch (err) { console.error(err); }
    finally { setLoadingExercises(false); }
  };

  // ============ LEVEL 2 → 3: Big Exercise → Items ============
  const openExerciseItems = async (ex) => {
    setSelectedExercise(ex);
    setLoadingItems(true);
    try { const { data } = await api.get(`/exercises/${ex._id}/items`); setItems(data); }
    catch (err) { console.error(err); }
    finally { setLoadingItems(false); }
  };

  // ============ NAVIGATION ============
  const goBackToGroups = () => { setSelectedGroup(null); setSelectedExercise(null); setExercises([]); setItems([]); };
  const goBackToExercises = () => { setSelectedExercise(null); setItems([]); };

  // ============ BIG EXERCISE CRUD ============
  const openAddEx = () => { setEditingEx(null); setExForm({ title: '', order: 0 }); setError(''); setShowExPopup(true); };
  const openEditEx = (ex) => { setEditingEx(ex); setExForm({ title: ex.title, order: ex.order || 0 }); setError(''); setShowExPopup(true); };

  const handleExSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editingEx) {
        const { data } = await api.put(`/lesson-groups/${selectedGroup._id}/exercises/${editingEx._id}`, exForm);
        setExercises(exercises.map(ex => ex._id === editingEx._id ? data : ex));
      } else {
        const { data } = await api.post(`/lesson-groups/${selectedGroup._id}/exercises`, exForm);
        setExercises([...exercises, data]);
      }
      setShowExPopup(false);
    } catch (err) { setError(err.response?.data?.message || 'Có lỗi xảy ra'); }
  };

  const handleDeleteEx = async (exId) => {
    if (window.confirm('Xóa bài tập lớn sẽ xóa TẤT CẢ bài tập nhỏ. Bạn có chắc?')) {
      try {
        await api.delete(`/lesson-groups/${selectedGroup._id}/exercises/${exId}`);
        setExercises(exercises.filter(ex => ex._id !== exId));
        if (selectedExercise?._id === exId) setSelectedExercise(null);
      } catch (err) { alert(err.response?.data?.message || 'Lỗi'); }
    }
  };

  // ============ ITEM CRUD ============
  const openAddItem = () => {
    setEditingItem(null);
    setItemForm({ title: '', type: 'document', content: '', questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', essayPrompt: '', order: 0 });
    setError(''); setShowItemPopup(true);
  };

  const openEditItem = (item) => {
    setEditingItem(item);
    setItemForm({
      title: item.title || '', type: item.type || 'document',
      content: item.content || '', questionText: item.questionText || '',
      optionA: item.optionA || '', optionB: item.optionB || '',
      optionC: item.optionC || '', optionD: item.optionD || '',
      correctAnswer: item.correctAnswer || 'A',
      essayPrompt: item.essayPrompt || '', order: item.order || 0
    });
    setError(''); setShowItemPopup(true);
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editingItem) {
        const { data } = await api.put(`/exercises/${selectedExercise._id}/items/${editingItem._id}`, itemForm);
        setItems(items.map(it => it._id === editingItem._id ? data : it));
      } else {
        const { data } = await api.post(`/exercises/${selectedExercise._id}/items`, itemForm);
        setItems([...items, data]);
      }
      setShowItemPopup(false);
    } catch (err) { setError(err.response?.data?.message || 'Có lỗi xảy ra'); }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Xóa bài tập nhỏ này?')) {
      try {
        await api.delete(`/exercises/${selectedExercise._id}/items/${itemId}`);
        setItems(items.filter(it => it._id !== itemId));
      } catch (err) { alert(err.response?.data?.message || 'Lỗi'); }
    }
  };

  // ============ HELPERS ============
  const typeIcons = {
    document: <FileText size={18} className="text-blue-500" />,
    multiple_choice: <CheckSquare size={18} className="text-green-500" />,
    essay: <AlignLeft size={18} className="text-purple-500" />
  };
  const typeNames = { document: 'Tài liệu', multiple_choice: 'Trắc nghiệm', essay: 'Tự luận' };

  // ============ DETERMINE CURRENT VIEW ============
  const currentView = selectedExercise ? 'items' : selectedGroup ? 'exercises' : 'groups';

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

            {/* ===== LEVEL 1: GROUPS ===== */}
            {currentView === 'groups' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Quản lý Bài tập</h2>
                </div>
                {loading ? <div className="text-center text-xl text-gray-600">Đang tải...</div> : (
                  <div className="space-y-4">
                    {groups.map((g, i) => (
                      <div key={g._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <BookOpen size={22} className="text-blue-500 mr-3" />
                          <span className="text-xl font-medium text-gray-800">{i + 1}. {g.name}</span>
                        </div>
                        <button onClick={() => openGroupExercises(g)} className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110" title="Xem bài tập">
                          <BookOpen size={18} />
                        </button>
                      </div>
                    ))}
                    {groups.length === 0 && <div className="text-center text-gray-500 italic">Chưa có nhóm bài học. Vui lòng tạo ở Quản lý Bài học.</div>}
                  </div>
                )}
              </>
            )}

            {/* ===== LEVEL 2: BIG EXERCISES ===== */}
            {currentView === 'exercises' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <button onClick={goBackToGroups} className="mr-4 p-2 rounded-full hover:bg-blue-200 transition-colors"><ArrowLeft size={24} className="text-blue-600" /></button>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedGroup.name} — Bài tập lớn</h2>
                  </div>
                  <button onClick={openAddEx} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform hover:scale-105">
                    <Plus size={20} className="mr-2" /> Thêm bài tập
                  </button>
                </div>
                {loadingExercises ? <div className="text-center text-xl text-gray-600">Đang tải...</div> : (
                  <div className="space-y-4">
                    {exercises.map((ex, i) => (
                      <div key={ex._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <span className="text-xl font-medium text-gray-800">{i + 1}. {ex.title}</span>
                        </div>
                        <div className="flex space-x-3">
                          <button onClick={() => openEditEx(ex)} className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110"><Pencil size={18} /></button>
                          <button onClick={() => openExerciseItems(ex)} className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110" title="Xem bài tập nhỏ"><BookOpen size={18} /></button>
                          <button onClick={() => handleDeleteEx(ex._id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    ))}
                    {exercises.length === 0 && <div className="text-center text-gray-500 italic">Chưa có bài tập lớn nào.</div>}
                  </div>
                )}
              </>
            )}

            {/* ===== LEVEL 3: EXERCISE ITEMS ===== */}
            {currentView === 'items' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <button onClick={goBackToExercises} className="mr-4 p-2 rounded-full hover:bg-blue-200 transition-colors"><ArrowLeft size={24} className="text-blue-600" /></button>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedExercise.title} — Bài tập nhỏ</h2>
                  </div>
                  <button onClick={openAddItem} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform hover:scale-105">
                    <Plus size={20} className="mr-2" /> Thêm bài tập nhỏ
                  </button>
                </div>
                {loadingItems ? <div className="text-center text-xl text-gray-600">Đang tải...</div> : (
                  <div className="space-y-4">
                    {items.map((item, i) => (
                      <div key={item._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div>
                          <span className="text-xl font-medium text-gray-800 flex items-center">
                            {typeIcons[item.type]}
                            <span className="ml-2">{i + 1}. {item.title}</span>
                          </span>
                          <span className="text-sm text-gray-500 ml-7 block">{typeNames[item.type]}</span>
                        </div>
                        <div className="flex space-x-3">
                          <button onClick={() => openEditItem(item)} className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110"><Pencil size={18} /></button>
                          <button onClick={() => handleDeleteItem(item._id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    ))}
                    {items.length === 0 && <div className="text-center text-gray-500 italic">Chưa có bài tập nhỏ nào.</div>}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ========== BIG EXERCISE POPUP ========== */}
      <PopupForm isOpen={showExPopup} onClose={() => setShowExPopup(false)} title={editingEx ? 'Sửa bài tập lớn' : 'Thêm bài tập lớn'} onSubmit={handleExSubmit}>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-center text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Tiêu đề bài tập</label>
          <input type="text" value={exForm.title} onChange={(e) => setExForm({ ...exForm, title: e.target.value })}
            placeholder="VD: Bài tập 1, Bài tập thực hành..." className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Thứ tự</label>
          <input type="number" value={exForm.order} onChange={(e) => setExForm({ ...exForm, order: parseInt(e.target.value) || 0 })}
            className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <button type="button" onClick={() => setShowExPopup(false)} className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium">Hủy</button>
          <button type="submit" className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-md">{editingEx ? 'Lưu' : 'Thêm'}</button>
        </div>
      </PopupForm>

      {/* ========== ITEM POPUP ========== */}
      <PopupForm isOpen={showItemPopup} onClose={() => setShowItemPopup(false)} title={editingItem ? 'Sửa bài tập nhỏ' : 'Thêm bài tập nhỏ'} onSubmit={handleItemSubmit} wide>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-center text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Tiêu đề</label>
          <input type="text" value={itemForm.title} onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
            className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" required />
        </div>

        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Loại</label>
          <select value={itemForm.type} onChange={(e) => setItemForm({ ...itemForm, type: e.target.value })}
            className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
            <option value="document">📄 Tài liệu (không tính điểm)</option>
            <option value="multiple_choice">✅ Trắc nghiệm (1 câu, 4 đáp án)</option>
            <option value="essay">📝 Tự luận</option>
          </select>
        </div>

        {/* Document */}
        {itemForm.type === 'document' && (
          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-1">Nội dung tài liệu</label>
            <textarea value={itemForm.content} onChange={(e) => setItemForm({ ...itemForm, content: e.target.value })}
              rows={5} placeholder="Nội dung tài liệu..." className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white resize-y" />
          </div>
        )}

        {/* Multiple Choice */}
        {itemForm.type === 'multiple_choice' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-1">Câu hỏi</label>
              <input type="text" value={itemForm.questionText} onChange={(e) => setItemForm({ ...itemForm, questionText: e.target.value })}
                placeholder="Nội dung câu hỏi..." className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Đáp án A</label>
                <input type="text" value={itemForm.optionA} onChange={(e) => setItemForm({ ...itemForm, optionA: e.target.value })}
                  className="w-full border border-gray-200 p-2 rounded-lg" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Đáp án B</label>
                <input type="text" value={itemForm.optionB} onChange={(e) => setItemForm({ ...itemForm, optionB: e.target.value })}
                  className="w-full border border-gray-200 p-2 rounded-lg" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Đáp án C</label>
                <input type="text" value={itemForm.optionC} onChange={(e) => setItemForm({ ...itemForm, optionC: e.target.value })}
                  className="w-full border border-gray-200 p-2 rounded-lg" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Đáp án D</label>
                <input type="text" value={itemForm.optionD} onChange={(e) => setItemForm({ ...itemForm, optionD: e.target.value })}
                  className="w-full border border-gray-200 p-2 rounded-lg" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-1">Đáp án đúng</label>
              <select value={itemForm.correctAnswer} onChange={(e) => setItemForm({ ...itemForm, correctAnswer: e.target.value })}
                className="w-full border border-green-300 p-3 rounded-lg bg-green-50 font-bold text-green-700">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
          </div>
        )}

        {/* Essay */}
        {itemForm.type === 'essay' && (
          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-1">Đề bài tự luận</label>
            <textarea value={itemForm.essayPrompt} onChange={(e) => setItemForm({ ...itemForm, essayPrompt: e.target.value })}
              rows={5} placeholder="Đề bài..." className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white resize-y" required />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Thứ tự</label>
          <input type="number" value={itemForm.order} onChange={(e) => setItemForm({ ...itemForm, order: parseInt(e.target.value) || 0 })}
            className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button type="button" onClick={() => setShowItemPopup(false)} className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium">Hủy</button>
          <button type="submit" className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-md">{editingItem ? 'Lưu' : 'Thêm'}</button>
        </div>
      </PopupForm>
    </div>
  );
};

export default ExerciseManagement;
