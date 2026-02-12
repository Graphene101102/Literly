import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserHeader from '../../components/UserHeader';
import ChatBot from '../../components/ChatBot';
import EarthBackground from '../../assets/earth-background.png';
import { ArrowLeft, FileText, CheckSquare, AlignLeft, Send } from 'lucide-react';
import api from '../../services/api';

const ExerciseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const { data } = await api.get(`/exercises/${id}`);
        setExercise(data);
        setItems(data.items || []);

        // Check if already submitted
        const mySubmissions = await api.get('/submissions/my');
        const existing = mySubmissions.data.find(s => s.exercise?._id === id || s.exercise === id);
        if (existing) {
          setSubmitted(true);
          setResult(existing);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercise();
  }, [id]);

  const handleMCAnswer = (itemId, answer) => {
    setAnswers(prev => ({ ...prev, [itemId]: { ...prev[itemId], selectedAnswer: answer } }));
  };

  const handleEssayAnswer = (itemId, text) => {
    setAnswers(prev => ({ ...prev, [itemId]: { ...prev[itemId], essayAnswer: text } }));
  };

  // Validation: check all MC and essay are answered
  const mcItems = items.filter(i => i.type === 'multiple_choice');
  const essayItems = items.filter(i => i.type === 'essay');
  const unansweredMC = mcItems.filter(i => !answers[i._id]?.selectedAnswer);
  const unansweredEssay = essayItems.filter(i => !answers[i._id]?.essayAnswer?.trim());
  const allAnswered = unansweredMC.length === 0 && unansweredEssay.length === 0;
  const totalUnanswered = unansweredMC.length + unansweredEssay.length;

  const handleSubmit = async () => {
    if (submitting) return;
    if (!allAnswered) {
      alert(`Vui lòng hoàn thành tất cả bài tập trước khi nộp!\n- Trắc nghiệm chưa chọn: ${unansweredMC.length}\n- Tự luận chưa viết: ${unansweredEssay.length}`);
      return;
    }
    if (!window.confirm('Bạn có chắc muốn nộp bài? Không thể sửa sau khi nộp.')) return;

    setSubmitting(true);
    try {
      const answersList = items
        .filter(item => item.type !== 'document')
        .map(item => ({
          exerciseItemId: item._id,
          selectedAnswer: answers[item._id]?.selectedAnswer || '',
          essayAnswer: answers[item._id]?.essayAnswer || ''
        }));

      // Also include document items
      const docAnswers = items
        .filter(item => item.type === 'document')
        .map(item => ({ exerciseItemId: item._id }));

      const { data } = await api.post('/submissions', {
        exerciseId: id,
        answers: [...docAnswers, ...answersList]
      });
      setSubmitted(true);
      setResult(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi nộp bài');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center text-2xl font-bold text-blue-800">Đang tải bài tập...</div>;
  }

  if (!exercise) {
    return (
      <div className="h-screen w-screen flex flex-col bg-blue-50">
        <UserHeader />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Không tìm thấy bài tập</h2>
            <button onClick={() => navigate('/exercises')} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Quay lại</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-blue-50">
      <UserHeader />

      <div className="absolute inset-0 bg-no-repeat bg-center bg-cover" style={{ backgroundImage: `url(${EarthBackground})`, top: '200px' }}>
        <div className="w-full h-full bg-white opacity-85"></div>
      </div>

      <div className="flex-grow relative overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-2xl shadow-lg border border-blue-100 overflow-hidden">

          {/* Header */}
          <div className="bg-blue-400 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={() => navigate('/exercises')} className="mr-3 p-1.5 rounded-full hover:bg-blue-300 transition-colors">
                <ArrowLeft size={22} className="text-white" />
              </button>
              <h1 className="text-2xl font-bold text-white">{exercise.title}</h1>
            </div>
            {submitted && result && (
              <div className="text-white text-right">
                <span className="text-sm opacity-80">Điểm: </span>
                <span className="text-2xl font-bold">
                  {result.totalScore !== null ? result.totalScore : '?'}
                </span>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-8 space-y-6">

            {/* Already submitted notice */}
            {submitted && (
              <div className="bg-green-50 border border-green-300 p-4 rounded-lg text-center">
                <p className="text-green-700 font-bold text-lg">✅ Bạn đã nộp bài này!</p>
                {result?.mcTotal > 0 && (
                  <p className="text-green-600 text-sm mt-1">Trắc nghiệm: {result.mcCorrect}/{result.mcTotal} đúng</p>
                )}
                {result?.hasEssay && !result?.essayGraded && (
                  <p className="text-yellow-600 text-sm mt-1">📝 Tự luận đang chờ giáo viên chấm</p>
                )}
              </div>
            )}

            {/* Exercise Items */}
            {items.map((item, i) => (
              <div key={item._id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">

                {/* === DOCUMENT === */}
                {item.type === 'document' && (
                  <div>
                    <div className="flex items-center mb-3">
                      <FileText size={18} className="text-blue-500 mr-2" />
                      <span className="font-bold text-gray-700">{item.title}</span>
                      <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Tài liệu</span>
                    </div>
                    <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">{item.content}</div>
                  </div>
                )}

                {/* === MULTIPLE CHOICE === */}
                {item.type === 'multiple_choice' && (
                  <div>
                    <div className="flex items-center mb-3">
                      <CheckSquare size={18} className="text-green-500 mr-2" />
                      <span className="font-bold text-gray-700">Câu {i}. {item.title}</span>
                      <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Trắc nghiệm</span>
                    </div>
                    <p className="text-gray-800 mb-4 font-medium">{item.questionText}</p>

                    <div className="space-y-2">
                      {(item.shuffledOptions || []).map((opt) => {
                        const isSelected = answers[item._id]?.selectedAnswer === opt.key;
                        return (
                          <label
                            key={opt.key}
                            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${submitted ? 'cursor-default opacity-80' :
                              isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                              }`}
                          >
                            <input
                              type="radio"
                              name={`mc-${item._id}`}
                              checked={isSelected}
                              onChange={() => !submitted && handleMCAnswer(item._id, opt.key)}
                              disabled={submitted}
                              className="mr-3 accent-blue-500"
                            />
                            <span className="text-gray-700">{opt.text}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* === ESSAY === */}
                {item.type === 'essay' && (
                  <div>
                    <div className="flex items-center mb-3">
                      <AlignLeft size={18} className="text-purple-500 mr-2" />
                      <span className="font-bold text-gray-700">{item.title}</span>
                      <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">Tự luận</span>
                    </div>
                    <p className="text-gray-800 mb-4 font-medium">{item.essayPrompt}</p>
                    <textarea
                      rows={6}
                      placeholder="Nhập câu trả lời của bạn..."
                      value={answers[item._id]?.essayAnswer || ''}
                      onChange={(e) => !submitted && handleEssayAnswer(item._id, e.target.value)}
                      disabled={submitted}
                      className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-y bg-white disabled:bg-gray-100"
                    />
                  </div>
                )}
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-center text-gray-400 italic py-8">Chưa có bài tập nhỏ nào.</div>
            )}

            {/* Submit section */}
            {!submitted && items.length > 0 && (
              <div className="pt-4 space-y-3">
                {/* Warning if not all answered */}
                {!allAnswered && (mcItems.length > 0 || essayItems.length > 0) && (
                  <div className="bg-yellow-50 border border-yellow-300 p-3 rounded-lg text-center">
                    <p className="text-yellow-700 font-medium text-sm">
                      ⚠️ Còn {totalUnanswered} bài tập chưa hoàn thành
                      {unansweredMC.length > 0 && ` (${unansweredMC.length} trắc nghiệm)`}
                      {unansweredEssay.length > 0 && ` (${unansweredEssay.length} tự luận)`}
                    </p>
                  </div>
                )}
                <div className="flex justify-center">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !allAnswered}
                    className={`flex items-center font-bold py-3 px-8 rounded-xl shadow-lg transition-transform text-lg ${allAnswered
                        ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    <Send size={20} className="mr-2" />
                    {submitting ? 'Đang nộp...' : allAnswered ? 'Nộp bài' : 'Hoàn thành hết để nộp bài'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ChatBot />
    </div>
  );
};

export default ExerciseDetail;