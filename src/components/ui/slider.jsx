import React, { useState } from "react";
import { cn } from "../utils";

const Slider = React.forwardRef(({ 
  className, 
  min = 0, 
  max = 100, 
  step = 1, 
  value = [50], 
  onValueChange,
  ...props 
}, ref) => {
  const [currentValue, setCurrentValue] = useState(value[0] || 50);
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    setCurrentValue(newValue);
    if (onValueChange) {
      onValueChange([newValue]);
    }
  };

  return (
    <div className={cn("relative flex w-full items-center", className)}>
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        {...props}
      />
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
});

Slider.displayName = "Slider";

export { Slider };
