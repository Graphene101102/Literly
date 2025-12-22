import React from 'react';
import AdminHeader from '../../components/AdminHeader';
import Sidebar from '../../components/Sidebar';
import EarthBackground from '../../assets/earth-background.png';

const DocumentReferenceArticlesManagement = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-blue-50">
      <AdminHeader />

      <div className="flex flex-grow">
        <Sidebar />

        <div className="relative flex-grow p-8">
          <div
            className="absolute inset-0 bg-no-repeat bg-center bg-cover"
            style={{ backgroundImage: `url(${EarthBackground})` }}
          >
            <div className="w-full h-full bg-white opacity-85"></div>
          </div>

          <div className="relative z-10 bg-red-50 bg-opacity-75 p-8 mt-10 w-full h-4/5 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Tài liệu</h2>
              <button className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <button className="bg-red-100 hover:bg-red-200 text-red-800 font-bold py-12 px-6 rounded-lg shadow-md text-center text-xl">
                Ngữ liệu - Thể loại
              </button>
              <button className="bg-red-100 hover:bg-red-200 text-red-800 font-bold py-12 px-6 rounded-lg shadow-md text-center text-xl">
                Kiến thức tiếng Việt
              </button>
              <div className="col-span-2 flex justify-center">
                <button className="bg-red-100 text-red-800 font-bold py-12 px-6 rounded-lg shadow-md text-center text-xl w-1/2 border-2 border-red-500">
                  Bài viết tham khảo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentReferenceArticlesManagement;
