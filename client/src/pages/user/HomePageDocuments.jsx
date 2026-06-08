import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserHeader from '../../components/UserHeader';
import ChatBot from '../../components/ChatBot';
import EarthBackground from '../../assets/earth-background.png';

const HomePageDocuments = () => {
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

      <div className="flex flex-grow justify-center p-4 md:p-8 relative">
        <div className="relative z-10 bg-red-50 bg-opacity-75 p-4 md:p-8 mt-4 md:mt-10 w-full max-w-5xl min-h-[80%] rounded-lg shadow-lg flex flex-col items-center justify-center overflow-y-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full px-2 md:px-8">
            <button
              onClick={() => navigate('/documents/corpus-genre')}
              className="bg-white hover:bg-blue-50 border-2 border-blue-200 text-blue-800 font-bold py-10 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-xl flex flex-col items-center justify-center"
            >
              <span className="text-4xl mb-4">📚</span>
              Ngữ liệu - Thể loại
            </button>

            <button
              onClick={() => navigate('/documents/vietnamese-knowledge')}
              className="bg-white hover:bg-green-50 border-2 border-green-200 text-green-800 font-bold py-10 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-xl flex flex-col items-center justify-center"
            >
              <span className="text-4xl mb-4">🧠</span>
              Kiến thức tiếng Việt
            </button>

            <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
              <button
                onClick={() => navigate('/documents/reference-articles')}
                className="bg-white hover:bg-purple-50 border-2 border-purple-200 text-purple-800 font-bold py-10 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-xl w-full md:w-1/2 flex flex-col items-center justify-center"
              >
                <span className="text-4xl mb-4">📝</span>
                Bài viết tham khảo
              </button>
            </div>
          </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default HomePageDocuments;