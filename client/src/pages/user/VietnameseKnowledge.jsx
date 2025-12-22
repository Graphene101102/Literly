import React from 'react';
import UserHeader from '../../components/UserHeader';
import ChatBot from '../../components/ChatBot';
import EarthBackground from '../../assets/earth-background.png'; 

const VietnameseKnowledge = () => {
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

      <div className="flex flex-grow justify-center h-full w-full p-8 relative">
        <div className="bg-red-50 bg-opacity-75 p-8 mt-10 w-4/5 h-4/5 rounded-lg shadow-lg ">
          <div className="bg-white text-blue-800 font-bold h-20 w-60 p-6 rounded-lg shadow-md text-center text-xl">
          Kiến thức tiếng Việt
          </div>
          
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default VietnameseKnowledge;