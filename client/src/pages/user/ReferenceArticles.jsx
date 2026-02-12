import React, { useState, useEffect } from 'react';
import UserHeader from '../../components/UserHeader';
import ChatBot from '../../components/ChatBot';
import EarthBackground from '../../assets/earth-background.png';
import api from '../../services/api';
import { ArrowLeft, BookOpen, X, Download, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReferenceArticles = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data } = await api.get('/documents?category=REFERENCE');
      setDocuments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-blue-50">
      <UserHeader />

      <div className="absolute inset-0 bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: `url(${EarthBackground})`, top: '200px' }}>
        <div className="w-full h-full bg-white opacity-85"></div>
      </div>

      <div className="flex-grow relative overflow-y-auto p-8 z-10 flex justify-center">
        <div className="w-full max-w-5xl bg-white bg-opacity-95 rounded-2xl shadow-xl border border-purple-100 overflow-hidden h-fit mb-20">

          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-400 px-8 py-6 flex items-center shadow-md">
            <button onClick={() => navigate('/documents')} className="mr-6 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all backdrop-blur-sm">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-3xl font-bold text-white">Bài viết tham khảo</h2>
              <p className="text-purple-100 mt-1">Các bài văn mẫu và nguồn tài liệu bổ ích</p>
            </div>
          </div>

          {/* List */}
          <div className="p-8 min-h-[400px]">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => (
                  <div
                    key={doc._id}
                    onClick={() => setSelectedDoc(doc)}
                    className="group cursor-pointer bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col items-center text-center relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500 rounded-bl-full -mr-8 -mt-8 opacity-10 group-hover:opacity-20 transition-opacity"></div>

                    <div className="bg-purple-100 p-4 rounded-full mb-4 shadow-sm group-hover:bg-purple-200 group-hover:scale-110 transition-all duration-300">
                      <FileText className="text-purple-600" size={32} />
                    </div>

                    <h3 className="font-bold text-gray-800 text-lg group-hover:text-purple-700 line-clamp-2 mb-2">{doc.title}</h3>

                    <div className="mt-auto pt-4 w-full">
                      <span className="inline-block px-4 py-1.5 rounded-full bg-purple-50 text-purple-600 text-sm font-medium border border-purple-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                        Đọc ngay
                      </span>
                    </div>
                  </div>
                ))}
                {documents.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <BookOpen size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium">Chưa có tài liệu nào trong mục này.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer Overlay */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white w-full h-full max-w-6xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden relative animate-scaleIn">
            {/* Overlay Header */}
            <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shrink-0 shadow-lg z-10">
              <h3 className="font-bold text-xl truncate pr-4 flex items-center">
                <FileText size={20} className="mr-3 text-purple-400" />
                {selectedDoc.title}
              </h3>
              <div className="flex items-center space-x-3">
                <a
                  href={`http://localhost:5001${selectedDoc.fileUrl}`}
                  download
                  className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-full transition-all hover:scale-110 active:scale-95"
                  title="Tải xuống PDF"
                >
                  <Download size={20} className="text-purple-400" />
                </a>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-2.5 bg-gray-800 hover:bg-red-500 rounded-full transition-all hover:scale-110 active:scale-95 group"
                  title="Đóng"
                >
                  <X size={24} className="group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>

            {/* PDF Content */}
            <div className="flex-grow bg-gray-200 relative">
              <iframe
                src={`http://localhost:5001${selectedDoc.fileUrl}#toolbar=0`}
                className="w-full h-full border-0"
                title="PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}

      <ChatBot />
    </div>
  );
};

export default ReferenceArticles;