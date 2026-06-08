import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import Sidebar from '../../components/Sidebar';
import EarthBackground from '../../assets/earth-background.png';
import api from '../../services/api';
import { X, ArrowLeft, ChevronDown, ChevronRight, Users, BookOpen, Check, AlertTriangle, XCircle, ClipboardList } from 'lucide-react';

const Statistics = () => {
  // ============ STATE ============
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedClass, setExpandedClass] = useState(null);

  // Per class: lessonGroups with exercises
  const [classData, setClassData] = useState({}); // classId -> { groups: [{ group, exercises: [] }] }
  const [expandedGroups, setExpandedGroups] = useState({}); // groupId -> boolean

  // Level 2: student list for a specific exercise
  const [selectedView, setSelectedView] = useState(null); // { classId, exerciseId, exerciseTitle, className, groupName }
  const [studentDetails, setStudentDetails] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Level 3: submission detail popup
  const [showSubmissionPopup, setShowSubmissionPopup] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [essayGrades, setEssayGrades] = useState({});

  // ============ FETCH ============
  useEffect(() => { fetchClasses(); }, []);

  const fetchClasses = async () => {
    try {
      const { data } = await api.get('/classes');
      setClasses(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleClass = async (classId) => {
    if (expandedClass === classId) { setExpandedClass(null); return; }
    setExpandedClass(classId);

    if (!classData[classId]) {
      try {
        const groupsRes = await api.get('/lesson-groups');
        const groups = groupsRes.data;

        const groupsWithExercises = [];
        for (const g of groups) {
          const exRes = await api.get(`/lesson-groups/${g._id}/exercises`);
          groupsWithExercises.push({ group: g, exercises: exRes.data });
        }

        const studentsRes = await api.get(`/classes/${classId}/students`);
        const students = studentsRes.data;
        const studentCount = students.length;
        const studentIds = students.map(s => s._id);

        // Fetch all submissions & compute per-exercise stats
        const allSubsRes = await api.get('/submissions');
        const allSubs = allSubsRes.data;

        const exerciseStats = {}; // exerciseId -> { submitted, completed }
        const allExIds = groupsWithExercises.flatMap(g => g.exercises.map(e => e._id));
        for (const exId of allExIds) {
          const subs = allSubs.filter(s =>
            studentIds.includes(s.student?._id || s.student) &&
            ((s.exercise?._id || s.exercise) === exId)
          );
          exerciseStats[exId] = {
            submitted: subs.length,
            completed: subs.filter(s => s.status === 'completed').length
          };
        }

        setClassData(prev => ({
          ...prev,
          [classId]: { groups: groupsWithExercises, studentCount, exerciseStats }
        }));
      } catch (err) { console.error(err); }
    }
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // ============ LEVEL 2: Exercise Detail for a class ============
  const openExerciseStudents = async (classId, exerciseId, exerciseTitle, className, groupName) => {
    setSelectedView({ classId, exerciseId, exerciseTitle, className, groupName });
    setLoadingDetail(true);
    try {
      // Get students in class
      const studentsRes = await api.get(`/classes/${classId}/students`);
      const students = studentsRes.data;

      // Get submissions for this exercise
      const subsRes = await api.get('/submissions/my'); // We need admin endpoint
      // Actually we need all submissions - let's use the classGroupDetail but for single exercise
      // Build student detail list
      const details = [];
      for (const student of students) {
        // Check if student has submission for this exercise
        try {
          const allSubs = await api.get(`/submissions?studentId=${student._id}&exerciseId=${exerciseId}`);
          // fallback: use statistics endpoint
        } catch (err) { /* skip */ }
      }

      // Use the admin getAllSubmissions and filter
      const allSubsRes = await api.get('/submissions');
      const allSubs = allSubsRes.data;
      const studentIds = students.map(s => s._id);

      const studentDetails = students.map(student => {
        const sub = allSubs.find(s =>
          (s.student?._id === student._id || s.student === student._id) &&
          (s.exercise?._id === exerciseId || s.exercise === exerciseId)
        );

        let status = 'not_started';
        let totalScore = null;

        if (sub) {
          if (sub.status === 'needs_grading') {
            status = 'needs_grading';
          } else {
            status = 'completed';
            totalScore = sub.totalScore;
          }
        }

        return { student, submission: sub, status, totalScore };
      });

      setStudentDetails(studentDetails);
    } catch (err) { console.error(err); }
    finally { setLoadingDetail(false); }
  };

  const goBackToStats = () => { setSelectedView(null); setStudentDetails([]); };

  // ============ LEVEL 3: Submission Detail ============
  const openSubmission = async (submission) => {
    if (!submission) return;
    setLoadingSubmission(true);
    setShowSubmissionPopup(true);
    try {
      const { data } = await api.get(`/submissions/${submission._id}/detail`);
      setSubmissionData(data);
      const grades = {};
      data.answers.filter(a => a.itemType === 'essay').forEach(a => {
        grades[a._id] = a.essayScore !== null && a.essayScore !== undefined ? a.essayScore : '';
      });
      setEssayGrades(grades);
    } catch (err) { console.error(err); }
    finally { setLoadingSubmission(false); }
  };

  const handleGradeEssay = async () => {
    if (!submissionData) return;
    const grades = Object.entries(essayGrades)
      .filter(([_, score]) => score !== '' && score !== null)
      .map(([answerId, essayScore]) => ({ answerId, essayScore: parseFloat(essayScore) }));

    try {
      const { data } = await api.put(`/submissions/${submissionData._id}/grade-essay`, { grades });
      setSubmissionData(data);
      // Refresh student list
      if (selectedView) {
        openExerciseStudents(selectedView.classId, selectedView.exerciseId, selectedView.exerciseTitle, selectedView.className, selectedView.groupName);
      }
    } catch (err) { alert(err.response?.data?.message || 'Lỗi khi chấm điểm'); }
  };

  // ============ STATUS ============
  const statusColors = {
    completed: 'bg-green-100 border-green-400 text-green-800',
    needs_grading: 'bg-yellow-100 border-yellow-400 text-yellow-800',
    not_started: 'bg-red-100 border-red-400 text-red-800'
  };
  const statusLabels = { completed: 'Đã hoàn thành', needs_grading: 'Cần chấm tự luận', not_started: 'Chưa làm' };
  const statusIcons = {
    completed: <Check size={16} className="text-green-600" />,
    needs_grading: <AlertTriangle size={16} className="text-yellow-600" />,
    not_started: <XCircle size={16} className="text-red-600" />
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-blue-50">
      <AdminHeader />
      <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
        <div className="lg:h-full lg:flex-shrink-0 overflow-y-auto lg:overflow-visible max-h-48 lg:max-h-full">
          <Sidebar />
        </div>
        <div className="relative flex-grow p-4 lg:p-8 overflow-y-auto">
          <div className="absolute inset-0 bg-no-repeat bg-center bg-cover" style={{ backgroundImage: `url(${EarthBackground})` }}>
            <div className="w-full h-full bg-white opacity-85"></div>
          </div>

          <div className="relative z-10 bg-red-50 bg-opacity-75 p-4 lg:p-8 mt-4 lg:mt-10 w-full min-h-[80%] rounded-lg shadow-lg overflow-y-auto flex flex-col">

            {/* ===== LEVEL 1: Classes → Groups → Exercises ===== */}
            {!selectedView ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Thống kê</h2>
                {loading ? <div className="text-center text-xl text-gray-600">Đang tải...</div> : (
                  <div className="space-y-4">
                    {classes.map((cls) => (
                      <div key={cls._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {/* Class Header */}
                        <div onClick={() => toggleClass(cls._id)} className="flex items-center justify-between p-4 cursor-pointer hover:bg-blue-50 transition-colors">
                          <div className="flex items-center">
                            <Users size={22} className="text-blue-500 mr-3" />
                            <span className="text-xl font-bold text-gray-800">{cls.name}</span>
                            {classData[cls._id] && <span className="text-sm text-gray-500 ml-2">({classData[cls._id].studentCount} HS)</span>}
                          </div>
                          {expandedClass === cls._id ? <ChevronDown size={20} className="text-gray-500" /> : <ChevronRight size={20} className="text-gray-500" />}
                        </div>

                        {/* LessonGroups → Exercises */}
                        {expandedClass === cls._id && classData[cls._id] && (
                          <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-2">
                            {classData[cls._id].groups.map((gData) => (
                              <div key={gData.group._id}>
                                {/* LessonGroup header */}
                                <div
                                  onClick={() => toggleGroup(`${cls._id}-${gData.group._id}`)}
                                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <div className="flex items-center">
                                    <BookOpen size={18} className="text-blue-400 mr-2" />
                                    <span className="font-semibold text-gray-700">{gData.group.name}</span>
                                  </div>
                                  {expandedGroups[`${cls._id}-${gData.group._id}`]
                                    ? <ChevronDown size={16} className="text-gray-400" />
                                    : <ChevronRight size={16} className="text-gray-400" />}
                                </div>

                                {/* Big Exercises (indented) */}
                                {expandedGroups[`${cls._id}-${gData.group._id}`] && (
                                  <div className="ml-8 mt-1 space-y-2">
                                    {gData.exercises.length === 0 ? (
                                      <div className="text-gray-400 italic text-sm pl-2">Chưa có bài tập.</div>
                                    ) : (
                                      gData.exercises.map((ex) => {
                                        const stats = classData[cls._id]?.exerciseStats?.[ex._id] || { submitted: 0, completed: 0 };
                                        const total = classData[cls._id]?.studentCount || 1;
                                        const submittedPct = Math.round((stats.submitted / total) * 100);
                                        const completedPct = Math.round((stats.completed / total) * 100);
                                        return (
                                          <div
                                            key={ex._id}
                                            onClick={() => openExerciseStudents(cls._id, ex._id, ex.title, cls.name, gData.group.name)}
                                            className="p-3 bg-gray-50 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors border border-gray-100"
                                          >
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center">
                                                <ClipboardList size={16} className="text-green-500 mr-2" />
                                                <span className="text-gray-700 font-medium">{ex.title}</span>
                                              </div>
                                              <span className="text-xs text-gray-500">
                                                <span className="text-green-600 font-bold">{stats.completed}</span>
                                                <span className="text-gray-400"> / </span>
                                                <span className="text-yellow-600 font-bold">{stats.submitted}</span>
                                                <span className="text-gray-400"> / </span>
                                                <span className="font-bold">{total}</span>
                                              </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                              <div className="h-full rounded-full relative" style={{ width: `${submittedPct}%`, backgroundColor: '#facc15' }}>
                                                <div className="h-full rounded-full absolute left-0 top-0" style={{ width: completedPct > 0 ? `${Math.round((stats.completed / Math.max(stats.submitted, 1)) * 100)}%` : '0%', backgroundColor: '#22c55e' }}></div>
                                              </div>
                                            </div>
                                            <div className="flex items-center mt-1 text-[10px] text-gray-400 space-x-3">
                                              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-1"></span>Đã có điểm</span>
                                              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block mr-1"></span>Đã làm</span>
                                              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block mr-1"></span>Chưa làm</span>
                                            </div>
                                          </div>
                                        );
                                      })
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {classes.length === 0 && <div className="text-center text-gray-500 italic">Chưa có lớp nào.</div>}
                  </div>
                )}
              </>
            ) : (
              /* ===== LEVEL 2: Student List ===== */
              <>
                <div className="flex items-center mb-6">
                  <button onClick={goBackToStats} className="mr-4 p-2 rounded-full hover:bg-blue-200 transition-colors">
                    <ArrowLeft size={24} className="text-blue-600" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedView.className} — {selectedView.exerciseTitle}</h2>
                    <p className="text-sm text-gray-500">{selectedView.groupName}</p>
                  </div>
                </div>

                {loadingDetail ? <div className="text-center text-xl text-gray-600">Đang tải...</div> : (
                  <div className="space-y-3">
                    {studentDetails.map((sd, i) => (
                      <div
                        key={sd.student._id}
                        onClick={() => sd.status !== 'not_started' && openSubmission(sd.submission)}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 transition-shadow ${statusColors[sd.status]} ${sd.status !== 'not_started' ? 'cursor-pointer hover:shadow-md' : 'opacity-70'}`}
                      >
                        <div className="flex items-center">
                          {statusIcons[sd.status]}
                          <span className="ml-3 text-lg font-medium">{i + 1}. {sd.student.fullName}</span>
                          <span className="ml-2 text-sm opacity-70">@{sd.student.username}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium">{statusLabels[sd.status]}</span>
                          {sd.totalScore !== null ? (
                            <span className="bg-white px-3 py-1 rounded-full font-bold text-lg">{sd.totalScore}</span>
                          ) : sd.status === 'needs_grading' ? (
                            <span className="bg-white px-3 py-1 rounded-full font-bold text-lg text-yellow-600">?</span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                    {studentDetails.length === 0 && <div className="text-center text-gray-500 italic">Không có học sinh.</div>}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ===== LEVEL 3: Submission Detail Popup ===== */}
      {showSubmissionPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl border-2 border-blue-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-blue-400 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {submissionData ? `Bài làm: ${submissionData.student?.fullName}` : 'Đang tải...'}
              </h2>
              <button onClick={() => setShowSubmissionPopup(false)} className="text-white hover:text-blue-100"><X size={24} /></button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto flex-grow bg-blue-50 min-h-0">
              {loadingSubmission ? <div className="text-center py-8 text-gray-600">Đang tải...</div> : submissionData ? (
                <div className="space-y-4">
                  {/* Score summary */}
                  <div className="bg-white p-4 rounded-lg border border-blue-200 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Trắc nghiệm: {submissionData.mcCorrect}/{submissionData.mcTotal} đúng → <strong>{submissionData.mcScore} điểm</strong></p>
                      {submissionData.hasEssay && (
                        <p className="text-sm text-gray-500">
                          Tự luận: {submissionData.essayGraded ? 'Đã chấm ✅' : <span className="text-yellow-600 font-bold">Chưa chấm</span>}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Tổng điểm</p>
                      <p className="text-3xl font-bold">
                        {submissionData.totalScore !== null ? submissionData.totalScore : <span className="text-yellow-500">?</span>}
                      </p>
                    </div>
                  </div>

                  {/* Answers */}
                  {submissionData.answers.map((ans) => (
                    <div key={ans._id} className="bg-white p-4 rounded-lg border border-gray-200">
                      {ans.itemType === 'document' && (
                        <div>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">📄 Tài liệu</span>
                          <p className="mt-2 font-medium text-gray-700">{ans.itemDetail?.title}</p>
                          <p className="text-sm text-gray-400 italic">Không tính điểm</p>
                        </div>
                      )}

                      {ans.itemType === 'multiple_choice' && (
                        <div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${ans.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {ans.isCorrect ? '✅ Đúng' : '❌ Sai'}
                          </span>
                          <p className="mt-2 font-medium text-gray-700">{ans.itemDetail?.questionText}</p>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                            {['A', 'B', 'C', 'D'].map(key => {
                              const text = ans.itemDetail?.[`option${key}`];
                              const isSelected = ans.selectedAnswer === key;
                              const isCorrect = ans.itemDetail?.correctAnswer === key;
                              let cls = 'p-2 rounded border ';
                              if (isCorrect) cls += 'bg-green-50 border-green-400 font-bold';
                              else if (isSelected && !isCorrect) cls += 'bg-red-50 border-red-400';
                              else cls += 'border-gray-200';
                              return <div key={key} className={cls}>{key}. {text}</div>;
                            })}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">HS chọn: {ans.selectedAnswer} | Đáp án: {ans.itemDetail?.correctAnswer}</p>
                        </div>
                      )}

                      {ans.itemType === 'drag_and_drop' && (
                        <div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${ans.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {ans.isCorrect ? '✅ Đúng' : '❌ Sai'}
                          </span>
                          <p className="mt-2 font-medium text-gray-700">{ans.itemDetail?.title}</p>
                          <div className="mt-2 space-y-2">
                            {(ans.itemDetail?.matchingPairs || []).map((pair, idx) => {
                                const studentMatch = (ans.dragAndDropMatches || []).find(m => m.prompt === pair.prompt);
                                const expected = [...(pair.answers || [])].sort().join(', ');
                                const submitted = studentMatch ? [...(studentMatch.answers || [])].sort().join(', ') : '';
                                const isPairCorrect = expected === submitted;
                                return (
                                    <div key={idx} className={`p-2 rounded border ${isPairCorrect ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
                                        <div className="font-medium text-sm text-gray-800">{pair.prompt}</div>
                                        <div className="text-xs mt-1">
                                            <span className="text-gray-500">Đã chọn:</span> <span className="font-bold">{submitted || '(Trống)'}</span>
                                            {!isPairCorrect && (
                                                <span className="ml-3 text-green-600">Đáp án: {expected}</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                          </div>
                        </div>
                      )}

                      {ans.itemType === 'essay' && (
                        <div>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">📝 Tự luận</span>
                          <p className="mt-2 font-medium text-gray-700">Đề: {ans.itemDetail?.essayPrompt}</p>
                          <div className="mt-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-400 mb-1">Bài làm:</p>
                            <p className="text-gray-800 whitespace-pre-wrap">{ans.essayAnswer || <em className="text-gray-400">Không có</em>}</p>
                          </div>
                          <div className="mt-3 flex items-center space-x-3">
                            <label className="text-sm font-semibold text-purple-700">Điểm (0-10):</label>
                            <input
                              type="number" min="0" max="10" step="0.5"
                              value={essayGrades[ans._id] ?? ''}
                              onChange={(e) => setEssayGrades({ ...essayGrades, [ans._id]: e.target.value })}
                              className="w-24 border border-purple-300 p-2 rounded-lg text-center font-bold text-lg bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                            {ans.essayScore !== null && ans.essayScore !== undefined && (
                              <span className="text-sm text-green-600 font-medium">✅ Đã chấm: {ans.essayScore}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {submissionData.hasEssay && (
                    <div className="flex justify-end pt-2">
                      <button onClick={handleGradeEssay}
                        className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-transform hover:scale-105">
                        💾 Lưu điểm tự luận
                      </button>
                    </div>
                  )}
                </div>
              ) : <div className="text-gray-400 text-center py-8">Không có dữ liệu</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
