
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X, Plus, Check } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskModalProps {
  date: Date;
  isOpen: boolean;
  onClose: () => void;
  onTasksUpdate: (date: Date, tasks: Task[]) => void;
  tasks: Task[];
}

const TaskModal = ({ date, isOpen, onClose, onTasksUpdate, tasks }: TaskModalProps) => {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: crypto.randomUUID(),
        text: newTaskText.trim(),
        completed: false
      };
      const updatedTasks = [...localTasks, newTask];
      setLocalTasks(updatedTasks);
      onTasksUpdate(date, updatedTasks);
      setNewTaskText('');
    }
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = localTasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setLocalTasks(updatedTasks);
    onTasksUpdate(date, updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = localTasks.filter(task => task.id !== taskId);
    setLocalTasks(updatedTasks);
    onTasksUpdate(date, updatedTasks);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Tasks for {format(date, 'MMMM d, yyyy')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {localTasks.length} tasks, {localTasks.filter(t => t.completed).length} completed
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Add Task */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addTask}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {localTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <Check className="h-12 w-12 mx-auto opacity-50" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">No tasks yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add your first task above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {localTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                    }`}
                  >
                    {task.completed && <Check className="h-3 w-3" />}
                  </button>
                  
                  <span className={`flex-1 ${
                    task.completed 
                      ? 'line-through text-gray-500 dark:text-gray-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {task.text}
                  </span>
                  
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-shrink-0 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {localTasks.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Progress: {localTasks.filter(t => t.completed).length}/{localTasks.length} tasks
              </span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                    style={{ 
                      width: `${localTasks.length > 0 ? (localTasks.filter(t => t.completed).length / localTasks.length) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
