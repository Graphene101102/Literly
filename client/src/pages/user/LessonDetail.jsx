import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserHeader from '../../components/UserHeader';
import ChatBot from '../../components/ChatBot';
import EarthBackground from '../../assets/earth-background.png';
import { ArrowLeft, BookOpen, Play } from 'lucide-react';
import api from '../../services/api';

const LessonDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const { data } = await api.get(`/lessons/${id}`);
                setLesson(data);
            } catch (error) {
                console.error('Error fetching lesson:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [id]);

    // Convert YouTube URL to embed URL
    const getEmbedUrl = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)/);
        if (match) return `https://www.youtube.com/embed/${match[1]}`;
        return url;
    };

    const typeLabels = {
        THEORY: { label: '📖 Lý thuyết', color: 'bg-blue-100 text-blue-700' },
        PRACTICE: { label: '✍️ Thực hành', color: 'bg-green-100 text-green-700' },
        VIDEO: { label: '🎬 Video', color: 'bg-purple-100 text-purple-700' }
    };

    if (loading) {
        return <div className="h-screen w-full flex items-center justify-center text-2xl font-bold text-blue-800">Đang tải bài học...</div>;
    }

    if (!lesson) {
        return (
            <div className="h-screen w-screen flex flex-col bg-blue-50">
                <UserHeader />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-600 mb-4">Không tìm thấy bài học</h2>
                        <button onClick={() => navigate('/lessons')} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const typeInfo = typeLabels[lesson.type] || typeLabels.THEORY;
    const embedUrl = getEmbedUrl(lesson.videoUrl);

    return (
        <div className="h-screen w-screen flex flex-col bg-blue-50">
            <UserHeader />

            {/* Background */}
            <div
                className="absolute inset-0 bg-no-repeat bg-center bg-cover"
                style={{
                    backgroundImage: `url(${EarthBackground})`,
                    top: '200px'
                }}
            >
                <div className="w-full h-full bg-white opacity-85"></div>
            </div>

            {/* Content */}
            <div className="flex-grow relative overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-2xl shadow-lg border border-blue-100 overflow-hidden">

                    {/* Header - compact */}
                    <div className="bg-blue-400 px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center">
                            <button onClick={() => navigate('/lessons')} className="mr-3 p-1.5 rounded-full hover:bg-blue-300 transition-colors">
                                <ArrowLeft size={22} className="text-white" />
                            </button>
                            <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
                        </div>
                        {lesson.author && (
                            <p className="text-blue-100 text-base font-medium">Tác giả: {lesson.author}</p>
                        )}
                    </div>

                    {/* Body */}
                    <div className="p-8">
                        {/* Mô tả */}
                        {lesson.description && (
                            <p className="text-gray-600 italic mb-6 text-base">{lesson.description}</p>
                        )}
                        {/* Video */}
                        {lesson.type === 'VIDEO' && embedUrl && (
                            <div className="mb-8">
                                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                    <iframe
                                        src={embedUrl}
                                        title={lesson.title}
                                        className="absolute inset-0 w-full h-full rounded-xl shadow-md"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        )}

                        {/* Video URL (non-YouTube) */}
                        {lesson.type === 'VIDEO' && lesson.videoUrl && !embedUrl && (
                            <div className="mb-8 bg-purple-50 p-4 rounded-lg border border-purple-200">
                                <div className="flex items-center text-purple-700">
                                    <Play size={20} className="mr-2" />
                                    <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                                        Xem video tại đây
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Content */}
                        {lesson.content && (
                            <div className="prose max-w-none">
                                <div
                                    className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                                />
                            </div>
                        )}

                        {/* Empty state */}
                        {!lesson.content && lesson.type !== 'VIDEO' && (
                            <div className="text-center text-gray-400 italic py-12">
                                <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                                <p className="text-xl">Nội dung bài học đang được cập nhật...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ChatBot />
        </div>
    );
};

export default LessonDetail;
