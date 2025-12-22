import React from 'react';
import AdminHeader from '../../components/AdminHeader';
import Sidebar from '../../components/Sidebar';
import EarthBackground from '../../assets/earth-background.png';

const LessonManagement = () => {
  const lessons = [
    { id: '1', title: 'Văn bản 1: Trái Đất - cái nôi của sự sống', author: 'Hồ Thanh Trang' },
    { id: '2', title: 'Thực hành tiếng Việt (1)', author: null },
    { id: '3', title: 'Văn bản 2: Các loài chung sống với nhau như thế nào?', author: 'Ngọc Phú' },
    { id: '4', title: 'Thực hành tiếng Việt (2)', author: null },
  ];

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
              <h2 className="text-2xl font-bold text-gray-800">Bài học</h2>
              <button className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm video
              </button>
            </div>

            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-xl font-medium text-gray-800">{`${index + 1}. ${lesson.title} ${lesson.author ? `(${lesson.author})` : ''}`}</span>
                  <div className="flex space-x-3">
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonManagement;
