import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils';

const Calendar = ({ selected, onSelect, className, ...props }) => {
  const [currentDate, setCurrentDate] = useState(selected || new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  const days = [];
  let day = startDate;
  while (days.length < 42) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const isSameDay = (d1, d2) => {
    return d1 && d2 && d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className={cn("p-3 bg-white rounded-md border", className)} {...props}>
      <div className="flex justify-between items-center mb-2">
        <button onClick={handlePrevMonth} className="p-1 rounded hover:bg-gray-100">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="font-semibold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
        <button onClick={handleNextMonth} className="p-1 rounded hover:bg-gray-100">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => (
          <button
            key={i}
            onClick={() => onSelect && onSelect(d)}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-md text-sm transition-colors",
              "hover:bg-gray-100",
              {
                "text-gray-400": d.getMonth() !== currentDate.getMonth(),
                "bg-indigo-600 text-white hover:bg-indigo-700": isSameDay(d, selected),
                "border border-indigo-600": isSameDay(d, new Date()) && !isSameDay(d, selected),
              }
            )}
          >
            {d.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};

Calendar.displayName = "Calendar";

export { Calendar };
