
import { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  addMonths,
  subMonths,
  isFuture
} from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  onDateClick: (date: Date) => void;
  tasks: Record<string, Array<{id: string, text: string, completed: boolean}>>;
}

const Calendar = ({ onDateClick, tasks }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  const getDateColor = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayTasks = tasks[dateKey] || [];
    
    if (isFuture(date) && !isToday(date)) {
      return 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500';
    }
    
    if (dayTasks.length === 0) {
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
    }
    
    const completedTasks = dayTasks.filter(task => task.completed);
    
    if (completedTasks.length === dayTasks.length) {
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
    }
    
    return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(direction === 'next' ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center py-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {dateRange.map(date => {
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const dateKey = format(date, 'yyyy-MM-dd');
          const dayTasks = tasks[dateKey] || [];
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateClick(date)}
              className={`
                aspect-square p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isCurrentMonth ? 'opacity-100' : 'opacity-40'}
                ${isToday(date) ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
                ${getDateColor(date)}
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-lg font-semibold mb-1">
                  {format(date, 'd')}
                </span>
                {dayTasks.length > 0 && (
                  <div className="flex gap-1">
                    {dayTasks.slice(0, 3).map((_, index) => (
                      <div key={index} className="w-1.5 h-1.5 bg-current rounded-full opacity-60" />
                    ))}
                    {dayTasks.length > 3 && (
                      <span className="text-xs opacity-75">+{dayTasks.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">No tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Incomplete</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Complete</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Future</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
