import React, { useState, useRef, useEffect } from 'react';

const MatchColumns = ({ item, shuffledAnswers, userMatches, onMatch, submitted }) => {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [lines, setLines] = useState([]);

  const containerRef = useRef(null);
  const leftRefs = useRef({});
  const rightRefs = useRef({});

  // userMatches is [{ prompt: String, answers: [String] }] (using the first answer for 1-1 match)

  const calculateLines = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines = [];

    const currentMatches = userMatches || [];

    currentMatches.forEach(match => {
      const leftPrompt = match.prompt;
      const rightAnswer = match.answers && match.answers.length > 0 ? match.answers[0] : null;
      if (!rightAnswer) return;

      const leftNode = leftRefs.current[leftPrompt];
      const rightNode = rightRefs.current[rightAnswer];

      if (leftNode && rightNode) {
        const lRect = leftNode.getBoundingClientRect();
        const rRect = rightNode.getBoundingClientRect();

        let isCorrect = null;
        if (submitted) {
          const expected = (item.matchingPairs.find(p => p.prompt === leftPrompt)?.answers || [])[0];
          isCorrect = expected === rightAnswer;
        }

        newLines.push({
          id: `${leftPrompt}-${rightAnswer}`,
          x1: lRect.right - containerRect.left,
          y1: lRect.top + lRect.height / 2 - containerRect.top,
          x2: rRect.left - containerRect.left,
          y2: rRect.top + rRect.height / 2 - containerRect.top,
          isCorrect
        });
      }
    });

    setLines(newLines);
  };

  useEffect(() => {
    calculateLines();
    window.addEventListener('resize', calculateLines);
    return () => window.removeEventListener('resize', calculateLines);
  }, [userMatches, submitted, item, shuffledAnswers]);

  const handleLeftClick = (prompt) => {
    if (submitted) return;
    
    // If clicking already selected, deselect
    if (selectedLeft === prompt) {
        setSelectedLeft(null);
        return;
    }
    
    // If it already has a match, maybe we want to unmatch it first? 
    // Or just let them replace it. Let's just select it.
    setSelectedLeft(prompt);

    if (selectedRight) {
      // Create match
      onMatch(prompt, selectedRight);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  const handleRightClick = (answer) => {
    if (submitted) return;

    if (selectedRight === answer) {
        setSelectedRight(null);
        return;
    }

    setSelectedRight(answer);

    if (selectedLeft) {
      onMatch(selectedLeft, answer);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  const handleUnmatch = (prompt, answer) => {
      if (submitted) return;
      onMatch(prompt, null); // custom logic in parent to remove
  };

  return (
    <div className="relative w-full overflow-hidden p-2" ref={containerRef}>
      {/* SVG for lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ minHeight: '100%' }}>
        <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
            </marker>
            <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#16a34a" />
            </marker>
            <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#dc2626" />
            </marker>
        </defs>
        {lines.map(line => {
            let strokeColor = "#888";
            let marker = "url(#arrowhead)";
            if (submitted) {
                strokeColor = line.isCorrect ? "#16a34a" : "#dc2626";
                marker = line.isCorrect ? "url(#arrowhead-green)" : "url(#arrowhead-red)";
            }
            return (
              <line
                key={line.id}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={strokeColor}
                strokeWidth="3"
                markerEnd={marker}
              />
            );
        })}
      </svg>

      <div className="flex justify-between relative z-20 w-full">
        {/* Left Column (Prompts) */}
        <div className="flex flex-col space-y-4 w-[45%]">
          {(item.matchingPairs || []).map((pair, idx) => {
            const hasMatch = (userMatches || []).some(m => m.prompt === pair.prompt && m.answers?.length > 0);
            return (
              <div
                key={idx}
                ref={el => leftRefs.current[pair.prompt] = el}
                onClick={() => handleLeftClick(pair.prompt)}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer shadow-sm
                  ${submitted ? 'bg-gray-50 border-gray-300 opacity-90' :
                    selectedLeft === pair.prompt ? 'bg-blue-100 border-blue-500 animate-pulse' :
                    hasMatch ? 'bg-indigo-50 border-indigo-300' :
                    'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <span className="font-semibold text-gray-800">{pair.prompt}</span>
              </div>
            );
          })}
        </div>

        {/* Right Column (Answers) */}
        <div className="flex flex-col space-y-4 w-[45%]">
          {(shuffledAnswers || []).map((ans, idx) => {
            // Find if this answer is matched
            const matchRecord = (userMatches || []).find(m => m.answers && m.answers.includes(ans));
            const isMatched = !!matchRecord;
            
            return (
              <div
                key={idx}
                ref={el => rightRefs.current[ans] = el}
                onClick={() => {
                    if (isMatched && !submitted) {
                        handleUnmatch(matchRecord.prompt, ans);
                    } else {
                        handleRightClick(ans);
                    }
                }}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer shadow-sm
                  ${submitted ? 'bg-gray-50 border-gray-300 opacity-90' :
                    selectedRight === ans ? 'bg-orange-100 border-orange-500 animate-pulse' :
                    isMatched ? 'bg-indigo-50 border-indigo-300 relative' :
                    'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <span className="font-semibold text-gray-800">{ans}</span>
                {isMatched && !submitted && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:scale-110">
                        ×
                    </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Correct Answers Feedback if submitted */}
      {submitted && (
          <div className="mt-6 space-y-2">
            {(item.matchingPairs || []).map((pair, idx) => {
                const matchRecord = (userMatches || []).find(m => m.prompt === pair.prompt);
                const submittedAns = matchRecord && matchRecord.answers ? matchRecord.answers[0] : null;
                const expectedAns = pair.answers ? pair.answers[0] : null;
                const isCorrect = submittedAns === expectedAns;
                if (!isCorrect) {
                    return (
                        <div key={idx} className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm">
                            <span className="font-bold">Sửa lỗi "{pair.prompt}":</span> Phải nối với <span className="font-bold text-green-700">{expectedAns}</span> (Bạn nối với: {submittedAns || 'Trống'})
                        </div>
                    );
                }
                return null;
            })}
          </div>
      )}
    </div>
  );
};

export default MatchColumns;
