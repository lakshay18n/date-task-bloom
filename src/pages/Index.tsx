
import { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import TaskModal from '../components/TaskModal';
import ProgressBar from '../components/ProgressBar';
import ThemeToggle from '../components/ThemeToggle';
import SidePanel from '../components/SidePanel';
import { format } from 'date-fns';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Record<string, Array<{id: string, text: string, completed: boolean}>>>({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleTasksUpdate = (date: Date, updatedTasks: Array<{id: string, text: string, completed: boolean}>) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    setTasks(prev => ({
      ...prev,
      [dateKey]: updatedTasks
    }));
  };

  const getTodayProgress = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayTasks = tasks[today] || [];
    if (todayTasks.length === 0) return 0;
    const completed = todayTasks.filter(task => task.completed).length;
    return Math.round((completed / todayTasks.length) * 100);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Task Calendar
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your daily tasks and build productive habits
            </p>
          </div>
          <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
        </div>

        {/* Progress Bar */}
        <ProgressBar progress={getTodayProgress()} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Calendar */}
          <div className="flex-1">
            <Calendar 
              onDateClick={handleDateClick}
              tasks={tasks}
            />
          </div>

          {/* Side Panel */}
          <div className="lg:w-80">
            <SidePanel tasks={tasks} />
          </div>
        </div>

        {/* Task Modal */}
        {isModalOpen && selectedDate && (
          <TaskModal
            date={selectedDate}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onTasksUpdate={handleTasksUpdate}
            tasks={tasks[format(selectedDate, 'yyyy-MM-dd')] || []}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
