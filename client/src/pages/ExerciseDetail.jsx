import React from 'react';
import Header from '../components/Header';
import ResultIcon from '../assets/result-icon.png'; // Assuming a result icon

const ExerciseDetail = () => {
    const exercises = [
    "Bài tập 1.1", "Bài tập 1.2", "Bài tập 1.3",
    "Bài tập 1.4", "Bài tập 1.5", "Bài tập 1.6",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Header />

      <div className="flex flex-grow justify-center p-8 relative">
        <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-lg w-3/5 mr-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Văn bản 1: Trái Đất - cái nôi của sự sống</h2>
          <div className="grid grid-cols-2 gap-4">
            {exercises.map((exercise, index) => (
              <button
                key={index}
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg shadow-md"
              >
                {exercise}
              </button>
            ))}
          </div>
        </div>

        <div className="w-1/4 flex flex-col items-center justify-center bg-red-100 rounded-lg shadow-lg p-4">
          <img src={ResultIcon} alt="Result" className="w-24 h-24 mb-4" />
          <span className="text-red-600 font-bold text-2xl">KẾT QUẢ</span>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;
