import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import Sidebar from '../../components/Sidebar';
import EarthBackground from '../../assets/earth-background.png';
import api from '../../services/api';
import { X, Plus, Pencil, Trash2, ArrowLeft, Users } from 'lucide-react';

// ================ POPUP COMPONENT ================
const PopupForm = ({ isOpen, onClose, title, onSubmit, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-2 border-blue-200 overflow-hidden">
        <div className="bg-blue-400 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-white hover:text-blue-100"><X size={24} /></button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4 bg-blue-50">
          {children}
        </form>
      </div>
    </div>
  );
};

const StudentManagement = () => {
  // ============ STATE ============
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Class popup
  const [showClassPopup, setShowClassPopup] = useState(false);
  const [editingClass, setEditingClass] = useState(null); // null = add, object = edit
  const [className, setClassName] = useState('');

  // Student view
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Student popup
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({ fullName: '', username: '', password: '', gender: 'Khác' });

  const [error, setError] = useState('');

  // ============ FETCH CLASSES ============
  useEffect(() => { fetchClasses(); }, []);

  const fetchClasses = async () => {
    try {
      const { data } = await api.get('/classes');
      setClasses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ============ CLASS CRUD ============
  const openAddClass = () => {
    setEditingClass(null);
    setClassName('');
    setError('');
    setShowClassPopup(true);
  };

  const openEditClassName = (cls) => {
    setEditingClass(cls);
    setClassName(cls.name);
    setError('');
    setShowClassPopup(true);
  };

  const handleClassSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingClass) {
        const { data } = await api.put(`/classes/${editingClass._id}`, { name: className });
        setClasses(classes.map(c => c._id === editingClass._id ? data : c));
      } else {
        const { data } = await api.post('/classes', { name: className });
        setClasses([...classes, data]);
      }
      setShowClassPopup(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteClass = async (id) => {
    if (window.confirm('Xóa lớp sẽ xóa TẤT CẢ học sinh trong lớp. Bạn có chắc không?')) {
      try {
        await api.delete(`/classes/${id}`);
        setClasses(classes.filter(c => c._id !== id));
        if (selectedClass?._id === id) setSelectedClass(null);
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi khi xóa lớp');
      }
    }
  };

  // ============ STUDENT VIEW ============
  const openClassStudents = async (cls) => {
    setSelectedClass(cls);
    setLoadingStudents(true);
    try {
      const { data } = await api.get(`/classes/${cls._id}/students`);
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const goBackToClasses = () => {
    setSelectedClass(null);
    setStudents([]);
  };

  // ============ STUDENT CRUD ============
  const openAddStudent = () => {
    setEditingStudent(null);
    setStudentForm({ fullName: '', username: '', password: '', gender: 'Khác' });
    setError('');
    setShowStudentPopup(true);
  };

  const openEditStudent = (student) => {
    setEditingStudent(student);
    setStudentForm({
      fullName: student.fullName,
      username: student.username,
      password: '',
      gender: student.gender || 'Khác'
    });
    setError('');
    setShowStudentPopup(true);
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingStudent) {
        // Edit student
        const payload = { ...studentForm };
        if (!payload.password.trim()) delete payload.password;
        const { data } = await api.put(`/classes/${selectedClass._id}/students/${editingStudent._id}`, payload);
        setStudents(students.map(s => s._id === editingStudent._id ? { ...s, ...data } : s));
      } else {
        // Add student
        const { data } = await api.post(`/classes/${selectedClass._id}/students`, studentForm);
        setStudents([...students, data]);
      }
      setShowStudentPopup(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Bạn có chắc muốn xóa học sinh này?')) {
      try {
        await api.delete(`/classes/${selectedClass._id}/students/${studentId}`);
        setStudents(students.filter(s => s._id !== studentId));
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi khi xóa học sinh');
      }
    }
  };

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
            {/* ========== CLASS LIST VIEW ========== */}
            {!selectedClass ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Quản lý Lớp học</h2>
                  <button onClick={openAddClass} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform hover:scale-105">
                    <Plus size={20} className="mr-2" />
                    Thêm Lớp
                  </button>
                </div>

                {loading ? (
                  <div className="text-center text-xl text-gray-600">Đang tải...</div>
                ) : (
                  <div className="space-y-4">
                    {classes.map((cls) => (
                      <div key={cls._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <Users size={22} className="text-blue-500 mr-3" />
                          <span className="text-xl font-medium text-gray-800">{cls.name}</span>
                        </div>
                        <div className="flex space-x-3">
                          <button onClick={() => openEditClassName(cls)} className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110" title="Sửa tên lớp">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => openClassStudents(cls)} className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110" title="Xem học sinh">
                            <Users size={18} />
                          </button>
                          <button onClick={() => handleDeleteClass(cls._id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110" title="Xóa lớp">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {classes.length === 0 && <div className="text-center text-gray-500 italic">Chưa có lớp nào.</div>}
                  </div>
                )}
              </>
            ) : (
              /* ========== STUDENT LIST VIEW ========== */
              <>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <button onClick={goBackToClasses} className="mr-4 p-2 rounded-full hover:bg-blue-200 transition-colors">
                      <ArrowLeft size={24} className="text-blue-600" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Lớp {selectedClass.name} — Danh sách học sinh
                    </h2>
                  </div>
                  <button onClick={openAddStudent} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform hover:scale-105">
                    <Plus size={20} className="mr-2" />
                    Thêm Học sinh
                  </button>
                </div>

                {loadingStudents ? (
                  <div className="text-center text-xl text-gray-600">Đang tải...</div>
                ) : (
                  <div className="space-y-4">
                    {students.map((student, index) => (
                      <div key={student._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div>
                          <span className="text-xl font-medium text-gray-800 block">
                            {index + 1}. {student.fullName}
                          </span>
                          <span className="text-sm text-gray-500 ml-6 block">
                            @{student.username} · {student.gender || 'Khác'}
                          </span>
                        </div>
                        <div className="flex space-x-3">
                          <button onClick={() => openEditStudent(student)} className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110" title="Sửa">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => handleDeleteStudent(student._id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-transform hover:scale-110" title="Xóa">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {students.length === 0 && <div className="text-center text-gray-500 italic">Chưa có học sinh nào trong lớp này.</div>}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ========== CLASS POPUP ========== */}
      <PopupForm
        isOpen={showClassPopup}
        onClose={() => setShowClassPopup(false)}
        title={editingClass ? 'Sửa tên lớp' : 'Thêm lớp mới'}
        onSubmit={handleClassSubmit}
      >
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-center text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Tên lớp</label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="VD: 6A1, 6A2..."
            className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            required
          />
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <button type="button" onClick={() => setShowClassPopup(false)} className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium">Hủy</button>
          <button type="submit" className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-md">{editingClass ? 'Lưu' : 'Thêm'}</button>
        </div>
      </PopupForm>

      {/* ========== STUDENT POPUP ========== */}
      <PopupForm
        isOpen={showStudentPopup}
        onClose={() => setShowStudentPopup(false)}
        title={editingStudent ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới'}
        onSubmit={handleStudentSubmit}
      >
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-center text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Họ và tên</label>
          <input
            type="text"
            value={studentForm.fullName}
            onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
            className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Tên đăng nhập</label>
          <input
            type="text"
            value={studentForm.username}
            onChange={(e) => setStudentForm({ ...studentForm, username: e.target.value })}
            className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">
            Mật khẩu {editingStudent && <span className="text-gray-400 font-normal">(để trống nếu không đổi)</span>}
          </label>
          <input
            type="password"
            value={studentForm.password}
            onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
            placeholder={editingStudent ? 'Nhập mật khẩu mới...' : 'Nhập mật khẩu'}
            className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            required={!editingStudent}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-800 mb-1">Giới tính</label>
          <select
            value={studentForm.gender}
            onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
            className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <button type="button" onClick={() => setShowStudentPopup(false)} className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium">Hủy</button>
          <button type="submit" className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-md">{editingStudent ? 'Lưu' : 'Thêm'}</button>
        </div>
      </PopupForm>
    </div>
  );
};

export default StudentManagement;
