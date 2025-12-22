import React from 'react';
import UserHeader from '../../components/UserHeader';
import ChatBot from '../../components/ChatBot';
import { useNavigate } from 'react-router-dom';
import SaveTheEnvironment from '../../assets/save-the-environment.png';
import { ChevronRight } from 'lucide-react';
import EarthBackground from '../../assets/earth-background.png';

const HomePageLessons = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col bg-blue-50">
      <UserHeader />

      <div 
        className="absolute inset-0 bg-no-repeat bg-center bg-cover" 
        style={{ 
          backgroundImage: `url(${EarthBackground})`,
          top: '200px' 
        }}
      >
        <div className="w-full h-full bg-white opacity-85"></div>
      </div>

      <div className="flex flex-grow justify-center p-8 relative">
        <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-lg w-3/5 mr-8 border border-blue-100">

          {/* Văn bản 1 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              Văn bản 1: <span className="font-semibold">Trái Đất - cái nôi của sự sống</span>
              <span className="text-sm font-normal text-gray-500 ml-2">(Hồ Thanh Trang)</span>
            </h2>

            {/*Card-style */}
            <div
              onClick={() => navigate('/lesson/1')}
              className="group flex items-center justify-between cursor-pointer bg-white hover:bg-blue-50 border-l-4 border-blue-400 p-5 rounded-r-lg shadow-sm transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium text-lg">Lý thuyết</span>
              </div>
              <ChevronRight className="text-blue-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>

            <div
              onClick={() => navigate('/lesson/1')}
              className="group flex items-center justify-between cursor-pointer bg-white hover:bg-blue-50 border-l-4 border-blue-400 p-5 rounded-r-lg shadow-sm transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium text-lg">Thực hành tiếng Việt (1)</span>
              </div>
              <ChevronRight className="text-blue-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>

            <div
              onClick={() => navigate('/lesson/1')}
              className="group flex items-center justify-between cursor-pointer bg-white hover:bg-blue-50 border-l-4 border-blue-400 p-5 rounded-r-lg shadow-sm transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium text-lg">Thực hành tiếng Việt (2)</span>
              </div>
              <ChevronRight className="text-blue-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* Văn bản 2 */}
          <div>
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              Văn bản 2: <span className="font-semibold">Các loài chung sống với nhau như thế nào?</span>
              <span className="text-sm font-normal text-gray-500 ml-2">(Ngọc Phú)</span>
            </h2>

            <div
              onClick={() => navigate('/lesson/2')}
              className="group flex items-center justify-between cursor-pointer bg-white hover:bg-blue-50 border-l-4 border-blue-400 p-5 rounded-r-lg shadow-sm transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium text-lg">Lý thuyết</span>
              </div>
              <ChevronRight className="text-blue-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>

            <div
              onClick={() => navigate('/lesson/2')}
              className="group flex items-center justify-between cursor-pointer bg-white hover:bg-blue-50 border-l-4 border-blue-400 p-5 rounded-r-lg shadow-sm transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium text-lg">Thực hành tiếng Việt (1)</span>
              </div>
              <ChevronRight className="text-blue-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>

            <div
              onClick={() => navigate('/lesson/2')}
              className="group flex items-center justify-between cursor-pointer bg-white hover:bg-blue-50 border-l-4 border-blue-400 p-5 rounded-r-lg shadow-sm transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium text-lg">Thực hành tiếng Việt (2)</span>
              </div>
              <ChevronRight className="text-blue-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

        </div>

        <div className="w-1/4 flex items-center justify-center">
          <img src={SaveTheEnvironment} alt="Save The Environment" className="max-w-full h-auto drop-shadow-xl" />
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default HomePageLessons;