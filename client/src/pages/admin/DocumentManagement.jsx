import React from 'react';
import AdminHeader from '../../components/AdminHeader';
import Sidebar from '../../components/Sidebar';
import EarthBackground from '../../assets/earth-background.png';

const DocumentManagement = () => {
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
            </div>

            <div className="grid grid-cols-2 gap-8">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentManagement;
