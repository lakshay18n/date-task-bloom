
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Calendar from '../components/Calendar';
import TaskModal from '../components/TaskModal';
import ProgressBar from '../components/ProgressBar';
import ThemeToggle from '../components/ThemeToggle';
import SidePanel from '../components/SidePanel';
import { LogOut } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  date: string;
}

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      console.log('Fetching tasks for user:', user?.id);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }

      console.log('Fetched tasks:', data);

      const tasksGrouped: Record<string, Task[]> = {};
      data?.forEach((task) => {
        const dateKey = task.date;
        if (!tasksGrouped[dateKey]) {
          tasksGrouped[dateKey] = [];
        }
        tasksGrouped[dateKey].push({
          id: task.id.toString(),
          title: task.title,
          description: task.description,
          completed: task.completed,
          date: task.date
        });
      });

      setTasks(tasksGrouped);
      console.log('Grouped tasks:', tasksGrouped);
    } catch (error: any) {
      console.error('Failed to load tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleTasksUpdate = async (date: Date, updatedTasks: Array<{id: string, text: string, completed: boolean}>) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    
    console.log('Updating tasks for date:', dateKey, updatedTasks);
    
    // Convert to our Task format
    const formattedTasks: Task[] = updatedTasks.map(task => ({
      id: task.id,
      title: task.text,
      completed: task.completed,
      date: dateKey
    }));

    // Update local state immediately
    setTasks(prev => ({
      ...prev,
      [dateKey]: formattedTasks
    }));

    // Sync with database
    try {
      // First, delete existing tasks for this date
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('user_id', user?.id)
        .eq('date', dateKey);

      if (deleteError) {
        console.error('Error deleting existing tasks:', deleteError);
        throw deleteError;
      }

      // Then insert all tasks for this date
      if (formattedTasks.length > 0) {
        const tasksToInsert = formattedTasks.map(task => {
          // Only include id if it's not a temporary ID
          const taskData: any = {
            user_id: user?.id,
            title: task.title,
            description: task.description || null,
            date: dateKey,
            completed: task.completed
          };
          
          // Only add id if it's not a temporary ID (starts with "temp_")
          if (!task.id.startsWith('temp_')) {
            const numericId = parseInt(task.id);
            if (!isNaN(numericId)) {
              taskData.id = numericId;
            }
          }
          
          return taskData;
        });

        console.log('Inserting tasks:', tasksToInsert);

        const { error: insertError } = await supabase
          .from('tasks')
          .insert(tasksToInsert);

        if (insertError) {
          console.error('Error inserting tasks:', insertError);
          throw insertError;
        }
      }

      // Refresh tasks to get the correct IDs from database
      await fetchTasks();

      toast({
        title: "Success",
        description: "Tasks saved successfully",
      });
    } catch (error: any) {
      console.error('Failed to save tasks:', error);
      toast({
        title: "Error",
        description: "Failed to save tasks: " + error.message,
        variant: "destructive",
      });
      // Refresh tasks to get the correct state
      fetchTasks();
    }
  };

  const getTodayProgress = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayTasks = tasks[today] || [];
    if (todayTasks.length === 0) return 0;
    const completed = todayTasks.filter(task => task.completed).length;
    return Math.round((completed / todayTasks.length) * 100);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  // Transform tasks for Calendar component
  const calendarTasks = Object.keys(tasks).reduce((acc, dateKey) => {
    acc[dateKey] = tasks[dateKey].map(task => ({
      id: task.id,
      text: task.title,
      completed: task.completed
    }));
    return acc;
  }, {} as Record<string, Array<{id: string, text: string, completed: boolean}>>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
              Welcome back, {user?.email}! Track your daily tasks and build productive habits.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
            <button
              onClick={handleSignOut}
              className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
            >
              <LogOut className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar progress={getTodayProgress()} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Calendar */}
          <div className="flex-1">
            <Calendar 
              onDateClick={handleDateClick}
              tasks={calendarTasks}
            />
          </div>

          {/* Side Panel */}
          <div className="lg:w-80">
            <SidePanel tasks={calendarTasks} />
          </div>
        </div>

        {/* Task Modal */}
        {isModalOpen && selectedDate && (
          <TaskModal
            date={selectedDate}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onTasksUpdate={handleTasksUpdate}
            tasks={tasks[format(selectedDate, 'yyyy-MM-dd')]?.map(task => ({
              id: task.id,
              text: task.title,
              completed: task.completed
            })) || []}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
