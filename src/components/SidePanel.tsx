
import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { Calendar, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

interface SidePanelProps {
  tasks: Record<string, Array<{id: string, text: string, completed: boolean}>>;
}

const SidePanel = ({ tasks }: SidePanelProps) => {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculate weekly stats
  const weeklyStats = weekDays.reduce((acc, date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayTasks = tasks[dateKey] || [];
    const completedTasks = dayTasks.filter(task => task.completed);
    
    acc.totalTasks += dayTasks.length;
    acc.completedTasks += completedTasks.length;
    
    return acc;
  }, { totalTasks: 0, completedTasks: 0 });

  // Find missed days (red days) in current month
  const missedDays = monthDays.filter(date => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayTasks = tasks[dateKey] || [];
    return dayTasks.length === 0 && date <= now;
  });

  const weeklyCompletionRate = weeklyStats.totalTasks > 0 
    ? Math.round((weeklyStats.completedTasks / weeklyStats.totalTasks) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Weekly Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            This Week
          </h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Tasks Completed</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {weeklyStats.completedTasks}/{weeklyStats.totalTasks}
            </span>
          </div>
          
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${weeklyCompletionRate}%` }}
            ></div>
          </div>
          
          <div className="text-center">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {weeklyCompletionRate}%
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400">completion rate</p>
          </div>
        </div>
      </div>

      {/* Missed Days */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-4">
          <XCircle className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Missed Days
          </h3>
        </div>
        
        {missedDays.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2 opacity-50" />
            <p className="text-green-600 dark:text-green-400 font-medium">Perfect month!</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">No missed days so far</p>
          </div>
        ) : (
          <div className="space-y-2">
            {missedDays.slice(0, 5).map(date => (
              <div key={date.toISOString()} className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <span className="text-sm text-red-700 dark:text-red-400">
                  {format(date, 'MMM d')}
                </span>
                <span className="text-xs text-red-500 dark:text-red-400">
                  No tasks
                </span>
              </div>
            ))}
            {missedDays.length > 5 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
                +{missedDays.length - 5} more missed days
              </p>
            )}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Stats
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {Object.values(tasks).reduce((acc, dayTasks) => acc + dayTasks.length, 0)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total Tasks</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {Object.values(tasks).reduce((acc, dayTasks) => 
                acc + dayTasks.filter(task => task.completed).length, 0
              )}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
