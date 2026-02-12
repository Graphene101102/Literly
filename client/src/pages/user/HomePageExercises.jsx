import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserHeader from '../../components/UserHeader';
import ChatBot from '../../components/ChatBot';
import SaveTheEnvironment from '../../assets/save-the-environment.png';
import { ChevronRight, ChevronDown, BookOpen } from 'lucide-react';
import EarthBackground from '../../assets/earth-background.png';
import api from '../../services/api';

const HomePageExercises = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [exercisesByGroup, setExercisesByGroup] = useState({});
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data } = await api.get('/lesson-groups');
        setGroups(data);
      } catch (error) {
        console.error('Error fetching lesson groups:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const toggleGroup = async (group) => {
    if (expandedGroup === group._id) {
      setExpandedGroup(null);
      return;
    }
    setExpandedGroup(group._id);

    if (!exercisesByGroup[group._id]) {
      try {
        const { data } = await api.get(`/lesson-groups/${group._id}/exercises`);
        setExercisesByGroup(prev => ({ ...prev, [group._id]: data }));
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    }
  };

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center text-2xl font-bold text-blue-800">Đang tải bài tập...</div>;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-blue-50">
      <UserHeader />

      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: `url(${EarthBackground})`, top: '200px' }}
      >
        <div className="w-full h-full bg-white opacity-85"></div>
      </div>

      <div className="flex flex-grow justify-center p-8 relative overflow-y-auto">
        <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-lg w-3/5 mr-8 border border-blue-100 h-fit">

          {groups.map((group, index) => {
            const isExpanded = expandedGroup === group._id;
            const exercises = exercisesByGroup[group._id] || [];

            return (
              <div key={group._id} className="mb-4 last:mb-0">
                {/* Group Header */}
                <div
                  onClick={() => toggleGroup(group)}
                  className="flex items-center justify-between cursor-pointer bg-blue-100 hover:bg-blue-200 p-5 rounded-lg shadow-sm transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen size={22} className="text-blue-600" />
                    <h2 className="text-xl font-bold text-blue-900">{index + 1}. {group.name}</h2>
                  </div>
                  {isExpanded ? <ChevronDown className="text-blue-500" /> : <ChevronRight className="text-blue-500" />}
                </div>

                {/* Big exercises */}
                {isExpanded && (
                  <div className="mt-2 ml-6 space-y-2">
                    {exercises.length === 0 ? (
                      <div className="text-gray-400 italic pl-4 py-2">Chưa có bài tập nào.</div>
                    ) : (
                      exercises.map((exercise, idx) => (
                        <div
                          key={exercise._id}
                          onClick={() => navigate(`/exercises/${exercise._id}`)}
                          className="group flex items-center justify-between cursor-pointer bg-white hover:bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg shadow-sm transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-1.5 rounded-full group-hover:bg-blue-200 w-8 h-8 flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-sm">{idx + 1}</span>
                            </div>
                            <span className="text-gray-700 font-medium text-lg">{exercise.title}</span>
                          </div>
                          <ChevronRight className="text-blue-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {groups.length === 0 && (
            <div className="text-center text-gray-500 italic">Chưa có bài tập nào.</div>
          )}
        </div>

        <div className="w-1/4 flex items-center justify-center sticky top-8 h-fit">
          <img src={SaveTheEnvironment} alt="Save The Environment" className="max-w-full h-auto drop-shadow-xl" />
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default HomePageExercises;