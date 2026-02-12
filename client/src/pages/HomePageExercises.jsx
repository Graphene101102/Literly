import React from 'react';
import Header from '../components/Header';
import SaveTheEnvironment from '../assets/save-the-environment.png'; // Reusing this image for now

const HomePageExercises = () => {
  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Header />

      <div className="flex flex-grow justify-center p-8 relative">
        <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-lg w-3/5 mr-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Văn bản 1: Trái Đất - cái nôi của sự sống <span className="font-normal">(Hồ Thanh Trang)</span></h2>
            <button className="w-full text-left bg-blue-100 hover:bg-blue-200 text-gray-800 font-medium py-3 px-6 rounded-lg shadow-sm mb-3">
              Thực hành tiếng Việt (1)
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Văn bản 2: Các loài chung sống với nhau như thế nào? <span className="font-normal">(Ngọc Phú)</span></h2>
            <button className="w-full text-left bg-blue-100 hover:bg-blue-200 text-gray-800 font-medium py-3 px-6 rounded-lg shadow-sm mb-3">
              Thực hành tiếng Việt (2)
            </button>
          </div>
        </div>

        <div className="w-1/4 flex items-center justify-center">
          <img src={SaveTheEnvironment} alt="Save The Environment" className="max-w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default HomePageExercises;
