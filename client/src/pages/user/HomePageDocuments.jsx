import React from 'react';
import UserHeader from '../../components/UserHeader';
import ChatBot from '../../components/ChatBot';
import { useNavigate } from 'react-router-dom';
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

      <div className="flex flex-grow justify-center p-8 relative">
        <div className="bg-red-50 bg-opacity-75 p-8 rounded-lg shadow-lg w-3/5 mr-8 grid grid-cols-2 gap-8">
          <button onClick={() => navigate('/documents/corpus-genre')}  className="bg-white hover:bg-red-200 text-blue-800 font-bold py-12 px-6 rounded-lg shadow-md text-center text-xl">
            Ngữ liệu - Thể loại
          </button>
          <button onClick={() => navigate('/documents/vietnamese-knowledge')}  className="bg-white hover:bg-red-200 text-blue-800 font-bold py-12 px-6 rounded-lg shadow-md text-center text-xl">
            Kiến thức tiếng Việt
          </button>
          <div className="col-span-2 flex justify-center">
            <button onClick={() => navigate('/documents/reference-articles')}  className="bg-white hover:bg-red-200 text-blue-800 font-bold py-12 px-6 rounded-lg shadow-md text-center text-xl w-1/2">
              Bài viết tham khảo
            </button>
          </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default HomePageDocuments;