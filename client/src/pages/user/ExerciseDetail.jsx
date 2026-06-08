import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserHeader from '../../components/UserHeader';
import ChatBot from '../../components/ChatBot';
import EarthBackground from '../../assets/earth-background.png';
import { ArrowLeft, FileText, CheckSquare, AlignLeft, Send, Link as LinkIcon } from 'lucide-react';
import api from '../../services/api';
import MatchColumns from '../../components/MatchColumns';

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
  const [shuffledAnswers, setShuffledAnswers] = useState({});
  const [selectedDraggable, setSelectedDraggable] = useState(null); // { itemId, answerStr }

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const { data } = await api.get(`/exercises/${id}`);
        setExercise(data);
        setItems(data.items || []);

        const shuffles = {};
        (data.items || []).forEach(item => {
            if ((item.type === 'drag_and_drop' || item.type === 'match_columns') && item.matchingPairs) {
                const ansList = item.matchingPairs.flatMap(p => p.answers || []);
                for (let i = ansList.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [ansList[i], ansList[j]] = [ansList[j], ansList[i]];
                }
                shuffles[item._id] = ansList;
            }
        });
        setShuffledAnswers(shuffles);

        // Check if already submitted
        const mySubmissions = await api.get('/submissions/my');
        const existing = mySubmissions.data.find(s => s.exercise?._id === id || s.exercise === id);
        if (existing) {
          setSubmitted(true);
          setResult(existing);
          const populatedAnswers = {};
          (existing.answers || []).forEach(ans => {
            populatedAnswers[ans.exerciseItem] = {
                selectedAnswer: ans.selectedAnswer,
                essayAnswer: ans.essayAnswer,
                dragAndDropMatches: ans.dragAndDropMatches,
                isCorrect: ans.isCorrect,
                essayScore: ans.essayScore
            };
          });
          setAnswers(populatedAnswers);
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

  const handleDragAndDropMatch = (itemId, prompt, action, answerStr) => {
    if (submitted) return;
    setAnswers(prev => {
      const currentItemAns = prev[itemId] || {};
      const currentMatches = [...(currentItemAns.dragAndDropMatches || [])];
      
      const matchIndex = currentMatches.findIndex(m => m.prompt === prompt);
      if (matchIndex === -1) {
          if (action === 'add') {
              currentMatches.push({ prompt, answers: [answerStr] });
          }
      } else {
          const match = { ...currentMatches[matchIndex] };
          const answersArr = [...(match.answers || [])];
          if (action === 'add' && !answersArr.includes(answerStr)) {
              answersArr.push(answerStr);
          } else if (action === 'remove') {
              const idx = answersArr.indexOf(answerStr);
              if (idx > -1) answersArr.splice(idx, 1);
          }
          match.answers = answersArr;
          currentMatches[matchIndex] = match;
      }
      
      return { ...prev, [itemId]: { ...currentItemAns, dragAndDropMatches: currentMatches } };
    });
    setSelectedDraggable(null);
  };

  const handleMatchColumnsMatch = (itemId, prompt, answerStr) => {
    if (submitted) return;
    setAnswers(prev => {
      const currentItemAns = prev[itemId] || {};
      let currentMatches = [...(currentItemAns.dragAndDropMatches || [])];
      
      if (!answerStr) {
          currentMatches = currentMatches.filter(m => m.prompt !== prompt);
      } else {
          currentMatches = currentMatches.filter(m => m.prompt !== prompt);
          currentMatches = currentMatches.map(m => ({
              prompt: m.prompt,
              answers: m.answers.filter(a => a !== answerStr)
          })).filter(m => m.answers.length > 0);
          
          currentMatches.push({ prompt, answers: [answerStr] });
      }

      return { ...prev, [itemId]: { ...currentItemAns, dragAndDropMatches: currentMatches } };
    });
  };

  // Validation
  const mcItems = items.filter(i => i.type === 'multiple_choice');
  const essayItems = items.filter(i => i.type === 'essay');
  const dndItems = items.filter(i => i.type === 'drag_and_drop');
  const matchItems = items.filter(i => i.type === 'match_columns');

  const unansweredMC = mcItems.filter(i => !answers[i._id]?.selectedAnswer);
  const unansweredEssay = essayItems.filter(i => !answers[i._id]?.essayAnswer?.trim());
  const unansweredDnd = dndItems.filter(i => {
      if (!answers[i._id]?.dragAndDropMatches) return true;
      let totalFilled = 0;
      answers[i._id].dragAndDropMatches.forEach(m => totalFilled += (m.answers || []).length);
      const totalExpected = i.matchingPairs.reduce((sum, p) => sum + (p.answers || []).length, 0);
      return totalFilled < totalExpected;
  });
  const unansweredMatch = matchItems.filter(i => {
      if (!answers[i._id]?.dragAndDropMatches) return true;
      let totalFilled = 0;
      answers[i._id].dragAndDropMatches.forEach(m => totalFilled += (m.answers || []).length);
      const totalExpected = i.matchingPairs.reduce((sum, p) => sum + (p.answers || []).length, 0);
      return totalFilled < totalExpected;
  });

  const allAnswered = unansweredMC.length === 0 && unansweredEssay.length === 0 && unansweredDnd.length === 0 && unansweredMatch.length === 0;
  const totalUnanswered = unansweredMC.length + unansweredEssay.length + unansweredDnd.length + unansweredMatch.length;

  const handleSubmit = async () => {
    if (submitting) return;
    if (!allAnswered) {
      alert(`Vui lòng hoàn thành tất cả bài tập trước khi nộp!\n- Trắc nghiệm chưa chọn: ${unansweredMC.length}\n- Tự luận chưa viết: ${unansweredEssay.length}\n- Kéo thả chưa xong: ${unansweredDnd.length}`);
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
          essayAnswer: answers[item._id]?.essayAnswer || '',
          dragAndDropMatches: answers[item._id]?.dragAndDropMatches || []
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

      <div className="flex-grow relative overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-2xl shadow-lg border border-blue-100 overflow-hidden">

          {/* Header */}
          <div className="bg-blue-400 px-4 md:px-6 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
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
          <div className="p-4 md:p-8 space-y-6">

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
                {item.imageUrl && (
                  <div className="mb-4 flex justify-center">
                    <img src={item.imageUrl} alt={item.title} className="max-w-full h-auto rounded-xl shadow-sm max-h-[400px] object-contain" />
                  </div>
                )}

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
                        const isCorrectOption = submitted && item.correctAnswer === opt.key;
                        const isWrongSelection = submitted && isSelected && !isCorrectOption;

                        let labelClass = "flex items-center p-3 rounded-lg border-2 transition-all ";
                        if (submitted) {
                            labelClass += "cursor-default opacity-90 ";
                            if (isCorrectOption) labelClass += "border-green-500 bg-green-50 text-green-800 font-bold ";
                            else if (isWrongSelection) labelClass += "border-red-500 bg-red-50 text-red-800 ";
                            else labelClass += "border-gray-200 bg-gray-50 text-gray-500 ";
                        } else {
                            labelClass += "cursor-pointer hover:border-blue-300 hover:bg-blue-50 ";
                            if (isSelected) labelClass += "border-blue-500 bg-blue-50 ";
                            else labelClass += "border-gray-200 ";
                        }

                        return (
                          <label key={opt.key} className={labelClass}>
                            <input
                              type="radio"
                              name={`mc-${item._id}`}
                              checked={isSelected}
                              onChange={() => !submitted && handleMCAnswer(item._id, opt.key)}
                              disabled={submitted}
                              className={`mr-3 accent-blue-500 ${submitted ? 'opacity-50' : ''}`}
                            />
                            <span>{opt.text}</span>
                            {submitted && isCorrectOption && <span className="ml-auto text-green-600 font-bold">✅</span>}
                            {submitted && isWrongSelection && <span className="ml-auto text-red-600 font-bold">❌</span>}
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
                      className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-y bg-white disabled:bg-gray-100 disabled:text-gray-700"
                    />
                    {submitted && (
                      <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg flex justify-between items-center">
                        <span className="font-semibold text-purple-800">Điểm tự luận:</span>
                        <span className="text-lg font-bold text-purple-700">
                          {answers[item._id]?.essayScore !== null && answers[item._id]?.essayScore !== undefined 
                            ? `${answers[item._id]?.essayScore} / 10` 
                            : 'Đang chờ GV chấm'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* === DRAG AND DROP (TAP TO MATCH) === */}
                {item.type === 'drag_and_drop' && (
                  <div>
                    <div className="flex items-center mb-3">
                      <CheckSquare size={18} className="text-orange-500 mr-2" />
                      <span className="font-bold text-gray-700">{item.title}</span>
                      <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Kéo thả đáp án</span>
                    </div>
                    <p className="text-gray-800 mb-4 font-medium text-sm italic">
                      Hướng dẫn: Chạm vào một đáp án ở khung bên dưới, sau đó chạm vào ô trống bên cạnh đề tương ứng để ghép nối.
                    </p>

                    <div className="grid grid-cols-1 gap-3 mb-6">
                      {(item.matchingPairs || []).map((pair, idx) => {
                        const matchedAnswers = (answers[item._id]?.dragAndDropMatches || []).find(m => m.prompt === pair.prompt)?.answers || [];
                        const expectedAnswers = [...(pair.answers || [])].sort();
                        const submittedAnswers = [...matchedAnswers].sort();
                        const expectedStr = expectedAnswers.join(', ');
                        const submittedStr = submittedAnswers.join(', ');
                        const isPairCorrect = expectedStr === submittedStr;
                        const expectedCount = expectedAnswers.length;
                        
                        return (
                          <div key={idx} className="flex flex-col md:flex-row gap-2 relative">
                            <div className="flex-1 bg-orange-50 p-3 rounded-xl border border-orange-200 text-orange-900 font-medium flex items-center shadow-sm">
                              {pair.prompt}
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                {Array.from({ length: expectedCount }).map((_, slotIdx) => {
                                    const placedAns = matchedAnswers[slotIdx];
                                    let slotClass = "p-3 rounded-xl border-2 flex items-center justify-center transition-all ";
                                    
                                    if (submitted) {
                                        slotClass += isPairCorrect ? "bg-green-50 border-green-400 text-green-800 shadow-sm " : "bg-red-50 border-red-400 text-red-800 shadow-sm ";
                                    } else {
                                        slotClass += "border-dashed ";
                                        if (placedAns) slotClass += "bg-white border-orange-400 cursor-pointer shadow-sm ";
                                        else if (selectedDraggable && selectedDraggable.itemId === item._id) slotClass += "bg-orange-100 border-orange-500 cursor-pointer animate-pulse ";
                                        else slotClass += "bg-gray-50 border-gray-300 cursor-pointer hover:bg-gray-100 ";
                                    }

                                    return (
                                        <div 
                                          key={slotIdx}
                                          onClick={() => {
                                            if (submitted) return;
                                            if (placedAns) {
                                              handleDragAndDropMatch(item._id, pair.prompt, 'remove', placedAns);
                                            } else if (selectedDraggable && selectedDraggable.itemId === item._id) {
                                              handleDragAndDropMatch(item._id, pair.prompt, 'add', selectedDraggable.answerStr);
                                            }
                                          }}
                                          className={slotClass}
                                        >
                                          {placedAns ? (
                                            <span className="font-bold text-center">{placedAns}</span>
                                          ) : (
                                            <span className="text-gray-400 text-sm">Chạm để thả đáp án...</span>
                                          )}
                                        </div>
                                    )
                                })}
                                {submitted && !isPairCorrect && (
                                    <div className="text-sm text-green-600 bg-green-50 p-2 rounded-lg border border-green-200 mt-1">
                                        <span className="font-bold">Đáp án đúng:</span> {expectedStr}
                                    </div>
                                )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200 shadow-inner">
                      <p className="text-sm text-gray-500 font-semibold mb-3 uppercase tracking-wider text-center">Các đáp án để chọn</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {(shuffledAnswers[item._id] || []).map((ansStr, idx) => {
                          const isUsed = (answers[item._id]?.dragAndDropMatches || []).some(m => (m.answers || []).includes(ansStr));
                          const isSelected = selectedDraggable?.itemId === item._id && selectedDraggable?.answerStr === ansStr;
                          
                          if (isUsed) return null; // Hide used answers
                          
                          return (
                            <button
                              key={idx}
                              disabled={submitted}
                              onClick={() => {
                                if (isSelected) setSelectedDraggable(null); // unselect
                                else setSelectedDraggable({ itemId: item._id, answerStr: ansStr });
                              }}
                              className={`px-5 py-3 rounded-xl font-bold shadow-sm transition-transform select-none ${
                                submitted ? 'opacity-50 cursor-not-allowed bg-white border border-gray-300 text-gray-400' :
                                isSelected ? 'bg-orange-500 text-white transform scale-110 shadow-lg ring-4 ring-orange-200' : 
                                'bg-white text-orange-700 border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50'
                              }`}
                            >
                              {ansStr}
                            </button>
                          );
                        })}
                        {(shuffledAnswers[item._id] || []).filter(ans => !(answers[item._id]?.dragAndDropMatches || []).some(m => (m.answers || []).includes(ans))).length === 0 && (
                          <div className="text-gray-400 italic text-sm py-2 text-center w-full">Đã dùng hết đáp án. Bạn có thể chạm vào ô bên trên để gỡ đáp án ra.</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* === MATCH COLUMNS === */}
                {item.type === 'match_columns' && (
                  <div>
                    <div className="flex items-center mb-3">
                      <LinkIcon size={18} className="text-indigo-500 mr-2" />
                      <span className="font-bold text-gray-700">{item.title}</span>
                      <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">Nối cột</span>
                    </div>
                    <p className="text-gray-800 mb-4 font-medium text-sm italic">
                      Hướng dẫn: Lần lượt chạm vào một thẻ ở cột trái và một thẻ ở cột phải để nối chúng lại với nhau.
                    </p>

                    <MatchColumns
                      item={item}
                      shuffledAnswers={shuffledAnswers[item._id] || []}
                      userMatches={answers[item._id]?.dragAndDropMatches || []}
                      onMatch={(prompt, answerStr) => handleMatchColumnsMatch(item._id, prompt, answerStr)}
                      submitted={submitted}
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