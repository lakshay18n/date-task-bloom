
interface ProgressBarProps {
  progress: number;
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Today's Progress
        </h3>
        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {progress}%
        </span>
      </div>
      
      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transition-all duration-500 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
        </div>
      </div>
      
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {progress === 100 ? '🎉 Great job! All tasks completed!' : 
         progress === 0 ? 'No tasks added yet today' : 
         'Keep going! You\'re making progress!'}
      </div>
    </div>
  );
};

export default ProgressBar;
