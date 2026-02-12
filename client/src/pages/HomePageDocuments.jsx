import React from 'react';
import Header from '../components/Header';
import SaveTheEnvironment from '../assets/save-the-environment.png'; // Reusing this image for now

const HomePageDocuments = () => {
  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Header />

      <div className="flex flex-grow justify-center p-8 relative">
        <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-lg w-3/5 grid grid-cols-2 gap-8">
          <button className="bg-red-100 hover:bg-red-200 text-red-800 font-bold py-12 px-6 rounded-lg shadow-md text-center text-xl">
            Ngữ liệu - Thể loại
          </button>
          <button className="bg-red-100 hover:bg-red-200 text-red-800 font-bold py-12 px-6 rounded-lg shadow-md text-center text-xl">
            Kiến thức tiếng Việt
          </button>
          <div className="col-span-2 flex justify-center">
            <button className="bg-red-100 hover:bg-red-200 text-red-800 font-bold py-12 px-6 rounded-lg shadow-md text-center text-xl w-1/2">
              Bài viết tham khảo
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

export default HomePageDocuments;
