
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="relative p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
    >
      <div className="relative w-6 h-6">
        <Sun className={`absolute inset-0 h-6 w-6 text-yellow-500 transition-all duration-300 ${
          isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
        }`} />
        <Moon className={`absolute inset-0 h-6 w-6 text-slate-700 dark:text-slate-300 transition-all duration-300 ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
        }`} />
      </div>
      
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
    </button>
  );
};

export default ThemeToggle;
