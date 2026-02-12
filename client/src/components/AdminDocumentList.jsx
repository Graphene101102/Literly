import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FileText, X } from 'lucide-react';
import AdminHeader from './AdminHeader';
import Sidebar from './Sidebar';
import EarthBackground from '../assets/earth-background.png';
import api from '../services/api';

const AdminDocumentList = ({ title, category }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [newTitle, setNewTitle] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, [category]);

    const fetchDocuments = async () => {
        try {
            const { data } = await api.get(`/documents?category=${category}`);
            setDocuments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !newTitle) {
            alert('Vui lòng nhập tên và chọn file PDF');
            return;
        }

        const formData = new FormData();
        formData.append('title', newTitle);
        formData.append('category', category);
        formData.append('file', file);

        setUploading(true);
        try {
            await api.post('/documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowModal(false);
            setNewTitle('');
            setFile(null);
            fetchDocuments();
        } catch (error) {
            alert(error.response?.data?.message || 'Lỗi khi tải lên');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa tài liệu này?')) return;
        try {
            await api.delete(`/documents/${id}`);
            fetchDocuments();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-blue-50">
            <AdminHeader />
            <div className="flex flex-grow">
                <Sidebar />
                <div className="relative flex-grow p-8">
                    <div className="absolute inset-0 bg-no-repeat bg-center bg-cover" style={{ backgroundImage: `url(${EarthBackground})` }}>
                        <div className="w-full h-full bg-white opacity-85"></div>
                    </div>

                    <div className="relative z-10 bg-red-50 bg-opacity-75 p-8 mt-10 w-full h-4/5 rounded-lg shadow-lg overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-colors"
                            >
                                <Plus size={20} className="mr-2" />
                                Thêm tài liệu
                            </button>
                        </div>

                        {loading ? <p className="text-center text-gray-500">Đang tải...</p> : (
                            <div className="space-y-3">
                                {documents.map((doc) => (
                                    <div key={doc._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-red-100">
                                        <a
                                            href={`http://localhost:5001${doc.fileUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center hover:text-blue-600 transition-colors flex-grow"
                                        >
                                            <div className="bg-red-100 p-2 rounded-full mr-3 text-red-600">
                                                <FileText size={20} />
                                            </div>
                                            <span className="font-medium text-lg text-gray-800">{doc.title}</span>
                                        </a>
                                        <button
                                            onClick={() => handleDelete(doc._id)}
                                            className="ml-4 text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}
                                {documents.length === 0 && (
                                    <div className="text-center text-gray-500 italic py-8">Chưa có tài liệu nào.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-xl font-bold text-gray-800 mb-6">Thêm tài liệu mới</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên tài liệu</label>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Nhập tên tài liệu..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">File PDF</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        required
                                    />
                                    <div className="flex flex-col items-center">
                                        <FileText size={32} className="text-gray-400 mb-2" />
                                        <span className="text-gray-600 text-sm">{file ? file.name : 'Nhấn để chọn file PDF'}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-all ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 hover:scale-[1.02]'}`}
                            >
                                {uploading ? 'Đang tải lên...' : 'Thêm tài liệu'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDocumentList;
